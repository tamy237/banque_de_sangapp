const express = require('express');
const router = express.Router();
const Collecte = require('../models/Collecte');
const User = require('../models/User');
const Centre = require('../models/Centre');
const nodemailer = require('nodemailer');
const { Vonage } = require('@vonage/server-sdk');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

// 🔐 Chargement des variables d’environnement
const {
  VONAGE_API_KEY,
  VONAGE_API_SECRET,
  VONAGE_SMS_SENDER,
  EMAIL_USER,
  EMAIL_PASS
} = process.env;

// Initialisation du SDK Vonage
const vonage = new Vonage({
  apiKey: VONAGE_API_KEY,
  apiSecret: VONAGE_API_SECRET
});

// Regex pour numéro local camerounais (sans indicatif)
const localPhoneRegex = /^6\d{8}$/;

router.post('/', verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const { type, date, heure, centreId, ctsId, associations } = req.body;

    // Vérification de l'existence du centre
    const centre = await Centre.findByPk(centreId);
    if (!centre) {
      return res.status(400).json({ message: "Le centre sélectionné n'existe pas." });
    }

    // Création de la collecte
    const collecte = await Collecte.create({
      type,
      date,
      heure,
      centre_id: centre.id,
      ctsId,
      associations
    });

    // Récupérer tous les utilisateurs
    const users = await User.findAll();
const message = `Collecte de sang le ${date} à ${centre.name} (${centre.address}) dès ${heure}.
Merci pour votre soutien. Donner son sang, c'est sauver des vies.`;

    const failedSMS = [];
    const failedEmail = [];

    // Config email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    });

    for (const user of users) {
      // Envoi SMS avec Vonage
      try {
        let formattedPhone = user.phone;
        if (formattedPhone && localPhoneRegex.test(formattedPhone)) {
          formattedPhone = '+237' + formattedPhone;
        }

        if (formattedPhone && /^\+2376\d{8}$/.test(formattedPhone)) {
          await vonage.sms.send({
            to: formattedPhone,
            from: VONAGE_SMS_SENDER || "BanqueSang",
            text: message
          });
        } else {
          failedSMS.push({ phone: user.phone, error: 'Numéro camerounais invalide' });
        }
      } catch (err) {
        console.error(`Échec SMS à ${user.phone}:`, err.message);
        failedSMS.push({ phone: user.phone, error: err.message });
      }

      //  Envoi Email
      try {
        if (user.email) {
          await transporter.sendMail({
            from: `"Banque de sang" <${EMAIL_USER}>`,
            to: user.email,
            subject: "Appel à don de sang",
            text: message
          });
        }
      } catch (err) {
        console.error(`Échec Email à ${user.email}:`, err.message);
        failedEmail.push({ email: user.email, error: err.message });
      }
    }

    return res.status(201).json({
      message: `Collecte ajoutée. ${failedSMS.length || failedEmail.length ? "Des échecs ont été enregistrés." : "Tous les messages ont été envoyés avec succès."}`,
      collecte,
      failedSMS,
      failedEmail
    });
  } catch (err) {
    console.error("Erreur collecte:", err);
    return res.status(500).json({ message: "Erreur serveur lors de la création de la collecte ou de l'envoi des alertes." });
  }
});

module.exports = router;
