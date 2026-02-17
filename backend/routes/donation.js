const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Donation = require('../models/Donation');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const Stock = require('../models/Stock');
const Centre = require("../models/Centre");
const nodemailer = require('nodemailer');

// Fonction utilitaire : Génère les deux formats possibles du numéro
function generateTwoPhoneFormats(phone) {
  if (!phone) return [];

  let cleaned = phone.replace(/\s+/g, '');

  // Format long +237xxxxxxxxx (13 chars) et format court xxxxxxxxx (9 chars)
  if (cleaned.startsWith('+237') && cleaned.length === 13) {
    const shortFormat = cleaned.slice(4); // enleve +237
    return [cleaned, shortFormat];
  }

  if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
    const longFormat = '+237' + cleaned;
    return [longFormat, cleaned];
  }

  // Sinon retourne juste le numéro nettoyé (potentiellement invalide)
  return [cleaned];
}

// POST : Enregistrer un nouveau don
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      name,
      dateNaissance,
      phone,
      sexe,
      poids,
      centre_id,
      groupeSanguin,
      dateDisponibilite
    } = req.body;

    // console.log("Requête reçue :", req.body);

    if (!name || !dateNaissance || !phone || !sexe || !poids || !centre_id || !groupeSanguin || !dateDisponibilite) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    // Utilise generateTwoPhoneFormats pour générer les formats à chercher
    const phonesToCheck = generateTwoPhoneFormats(phone);

    const existingUser = await User.findOne({
      where: {
        [Op.or]: phonesToCheck.map(p => ({ phone: p }))
      },
      attributes: ['id']
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Aucun utilisateur correspondant à ce numéro" });
    }

    // Sauvegarde du don avec le numéro en format long (+237xxxxxxxxx)
    const normalizedPhone = phonesToCheck.find(p => p.startsWith('+237')) || phone;

    const don = await Donation.create({
      name,
      dateNaissance,
      phone: normalizedPhone,
      sexe,
      user_id: existingUser.id,
      poids,
      centre_id,
      groupeSanguin,
      dateDisponibilite
    });

    res.status(201).json({ message: "Don enregistré avec succès", don });

  } catch (error) {
    console.error("Erreur lors de la création du don :", error);
    res.status(500).json({ error: "Erreur lors de la création du don" });
  }
});

// GET utilisateur par numéro
// router.get('/by-phone/:phone', verifyToken, async (req, res) => {
//   try {
//     const rawPhone = req.params.phone;

//     const phonesToCheck = generateTwoPhoneFormats(rawPhone);

//     const user = await User.findOne({
//       where: {
//         [Op.or]: phonesToCheck.map(p => ({ phone: p }))
//       }
//     });

//     if (!user) {
//       return res.status(404).json({ message: "Utilisateur non trouvé" });
//     }

//     res.json(user);
//   } catch (error) {
//     console.error("Erreur recherche utilisateur:", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// });

// 📄 Liste de tous les dons
router.get('/all', verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const dons = await Donation.findAll({
      include: [
        { model: Centre, attributes: ['name', 'location'] },
        { model: User, attributes: ['name', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });
      // console.log("Dons trouvés :", dons);
    res.json(dons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des dons.' });
  }
});

// ✅ Valider ou refuser une demande
router.patch('/:id/statut', verifyToken, allowRoles('personnel'), async (req, res) => {
    console.log('Requête PATCH reçue pour id =', req.params.id);

  try {
    const { statut } = req.body;

    if (!['valide', 'refuse'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const dons = await Donation.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['email', 'name'] }]
    });

    if (!dons) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }
// console.log('DONNEES:', dons);

   if (statut === 'valide') {
  let stock = await Stock.findOne({
    where: {
      groupeSanguin: dons.groupeSanguin,
      centre_id: dons.centre_id
    }
  });

  // console.log('Stocks pour centre', dons.centre_id, stock);

  // ✅ Si le stock existe, on le met à jour
  if (stock) {
    stock.quantity += 1;
    await stock.save();
  } else {
    // ✅ Sinon, on le crée avec une quantité de 1
    stock = await Stock.create({
      groupeSanguin: dons.groupeSanguin,
      centre_id: dons.centre_id,
      quantity: 1
    });
    console.log('Nouveau stock créé pour', dons.groupeSanguin, 'au centre', dons.centre_id);
  }
}

    dons.statut = statut;
    await dons.save();

    // --- ENVOI EMAIL ---
    if (dons.User && dons.User.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        }
      });

      let subject = '', text = '';
      if (statut === 'valide') {
        subject = 'Votre demande de sang a été validée';
        text = `Bonjour ${dons.User.name},\n\nVotre demande de sang (Groupe: ${dons.groupeSanguin}) a été validée. Merci de vous présenter au centre concerné.\n\nCordialement,\nL'équipe Banque de Sang`;
      } else {
        subject = 'Votre demande de sang a été refusée';
        text = `Bonjour ${dons.User.name},\n\nVotre demande de sang (Groupe: ${dons.groupeSanguin}) a été refusée. Veuillez nous contacter pour plus d'informations.\n\nCordialement,\nL'équipe Banque de Sang`;
      }

      await transporter.sendMail({
        from: '"Banque de Sang" <tchiosteve425@gmail.com>',
        to: dons.User.email,
        subject,
        text
      });
    }

    res.json({ message: `Demande ${statut}.`, dons });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
});

// ✅ GET /centresroutes - tous les centres
router.get('/', verifyToken, async (req, res) => {
  try {
    const centres = await Centre.findAll();
    res.json(centres);
  } catch (error) {
    console.error("Erreur récupération centres:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ GET utilisateur par numéro
router.get('/by-phone/:phone', verifyToken, async (req, res) => {
  try {
    const rawPhone = req.params.phone;

    const possiblePhones = [
      rawPhone,
      normalizePhone(rawPhone),
      rawPhone.startsWith('+237') ? rawPhone.slice(4) : null
    ].filter(Boolean);

    const user = await User.findOne({
      where: {
        [Op.or]: possiblePhones.map(p => ({ phone: p }))
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur recherche utilisateur:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🧠 Récupérer tous les rendez-vous (dons) d'un utilisateur
router.get('/auth/:id/rendezvous', async (req, res) => {
  try {
    const { id } = req.params;

    // 🔎 Cherche tous les dons faits par l'utilisateur, avec l'utilisateur associé
    const rendezvous = await Donation.findAll({
      where: { user_id: id },
      include: {
        model: User,
        attributes: ['name'] // pour avoir le nom du donneur
      },
      attributes: ['id', 'datedisponibilite', 'statut'],
      order: [['datedisponibilite', 'DESC']]
    });

    res.json(rendezvous);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// 🔴 Annuler un rendez-vous de don
router.delete('/rendezvous/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Donation.destroy({ where: { id } });

    if (deleted) {
      res.json({ message: 'Rendez-vous annulé avec succès' });
    } else {
      res.status(404).json({ message: 'Rendez-vous introuvable' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
});

// ✅ Confirmer un rendez-vous
router.patch('/rendezvous/:id/confirm', async (req, res) => {
  try {
    const don = await Donation.findByPk(req.params.id);
    if (!don) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    don.status = "confirmé";
    await don.save();

    res.json({ message: "Rendez-vous confirmé", don });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});



module.exports = router;
