const express = require('express');
const router = express.Router();
const { User, Centre, Collecte } = require('../models');
const { Appel } = require('../models'); 
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/authMiddleware');

// ✅ Créer un appel et notifier les donneurs
router.post('/', verifyToken, async (req, res) => {
  const { centre_id, collecte_id, groupeSanguin, date, heure } = req.body;

  try {
    const centre = await Centre.findByPk(centre_id);
    const collecte = await Collecte.findByPk(collecte_id);

    if (!centre || !collecte) {
      return res.status(400).json({ message: 'Centre ou collecte introuvable.' });
    }

   const nouvelAppel = await Appel.create({
    centre_id, // ID directement depuis req.body
    collecte_id, // Ajoute bien ce champ dans ton modèle si ce n’est pas déjà fait
    groupeSanguin,
    date,
    heure
  });

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const donneurs = await User.findAll({ where: { bloodType: bloodTypes } });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await Promise.all(
      donneurs.map((donneur) =>
        transporter.sendMail({
          from: `"Banque de Sang" <${process.env.EMAIL_USER}>`,
          to: donneur.email,
          subject: `📣 Appel au Don de Sang - Groupe ${groupeSanguin}`,
          text: `Bonjour ${donneur.name},

          Un appel au don de sang a été lancé pour le groupe ${groupeSanguin}.
          📍 Lieu : ${centre.name}
          🏥 CTS : ${collecte.cts}
          📅 Date : ${date} à ${heure}

          Merci de contribuer à sauver des vies.

          Banque de Sang`
                  })
                )
              );

    res.status(201).json({ message: 'Appel créé et donneurs notifiés.' });
  } catch (error) {
    console.error('Erreur appel :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l’appel.' });
  }
});

// Exemple de route GET /api/appel complète (à adapter si non existante ou incomplète)
router.get('/', verifyToken, async (req, res) => {
  try {
    const appels = await Appel.findAll({
      include: [
        { model: Centre, attributes: ['name', 'location'] },
        { model: Collecte, attributes: ['type', 'date'] }
      ]
    });

    const appelsFormatés = appels.map(appel => ({
      id: appel.id,
      centreNom: appel.Centre.name,
      collecte: appel.Collecte,
      groupeSanguin: appel.groupeSanguin,
      date: appel.date,
      heure: appel.heure
    }));

    res.json(appelsFormatés);
  } catch (err) {
    console.error('Erreur lors de la récupération des appels :', err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// SUPPRIMER une collecte par ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Chercher la collecte
    const appel = await Appel.findByPk(id);
    if (!appel) {
      return res.status(404).json({ message: 'Collecte non trouvée' });
    }

    // Supprimer la collecte
    await appel.destroy();

    res.json({ message: 'Appel supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l appel :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});


// ✅ Routes pour récupérer les centres et collectes
router.get('/centresroutes', verifyToken, async (req, res) => {
  try {
    const centres = await Centre.findAll();
    res.json(centres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur chargement centres' });
  }
});

router.get('/collectes', verifyToken, async (req, res) => {
  try {
    const collectes = await Collecte.findAll();
    res.json(collectes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur chargement collectes' });
  }
});

module.exports = router;
