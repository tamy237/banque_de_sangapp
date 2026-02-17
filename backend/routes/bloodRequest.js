const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const BloodRequest = require('../models/BloodRequest');
const Centre = require('../models/Centre');
const Stock = require('../models/Stock');
const User = require('../models/User');

const router = express.Router();

// ➕ Créer une demande de sang
router.post('/', verifyToken, allowRoles('utilisateur'), async (req, res) => {
  const {
    nom,
    sexe,
    age,
    telephone,
    groupe_sanguin,
    date_besoin,
    date_derniere_transfusion,
    quantity_needed,
    reason,
    centre_id
  } = req.body;
console.log("Champs extraits :", { nom, sexe, age, telephone, groupe_sanguin, date_besoin, date_derniere_transfusion, quantity_needed, reason, centre_id });
  console.log("📥 Corps de la requête reçu :", req.body);

  if (!nom || !sexe || !age || !telephone || !groupe_sanguin || !date_besoin || !date_derniere_transfusion || !quantity_needed || !reason || !centre_id) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Vérification du centre
    const centre = await Centre.findByPk(centre_id);
    if (!centre) {
      return res.status(404).json({ message: 'Centre non trouvé.' });
    }

    // Recherche de l'utilisateur par numéro de téléphone
   const utilisateur = await User.findOne({ where: { phone: telephone } });

    if (!utilisateur) {
      console.warn("❌ Aucun utilisateur trouvé avec ce numéro :", telephone);
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec ce numéro." });
    }
    //verification si la demande existe deja
    const phone = telephone; // mappe correctement
    const existing = await BloodRequest.findOne({
      where: {
        telephone,
        groupe_sanguin,
        centre_id,
        date_besoin
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Une demande similaire a déjà été enregistrée.' });
    }

    // Création de la demande
    const request = await BloodRequest.create({
      nom,
      sexe,
      age,
      telephone,
      groupe_sanguin,
      date_besoin,
      date_derniere_transfusion,
      quantity_needed,
      reason,
      centre_id,
      user_id: utilisateur.id
    });

    console.log("✅ Demande enregistrée avec succès :", request);

    res.status(201).json({
      message: 'Demande enregistrée avec succès.',
      request,
      demandeur: utilisateur.name
    });
  } catch (err) {
    console.error("💥 Erreur lors de l’enregistrement :", err);
    res.status(500).json({ message: 'Erreur lors de l’enregistrement de la demande.' });
  }
});


 
// 📄 Liste de toutes les demandes (réservée au personnel médical)
router.get('/all', verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const demandes = await BloodRequest.findAll({
      include: [
        {
          model: Centre,
          attributes: ['name', 'location'],
        },
        {
          model: User,
          attributes: ['name', 'email','phone'],
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log(JSON.stringify(demandes, null, 2));  // voir le contenu complet

    res.json(demandes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes.' });
  }
});


// ✅ Valider ou refuser une demande et mettre à jour le stock
const nodemailer = require('nodemailer');

router.patch('/:id/statut', verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const { statut } = req.body;

    if (!['validée', 'refusée'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const demande = await BloodRequest.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['email', 'name'] }]
    });
    if (!demande) {
      return res.status(404).json({ message: 'Demande introuvable.' });
    }

    // Gestion stock si validée
    if (statut === 'validée') {
      const stock = await Stock.findOne({
        where: {
          groupe: demande.groupe_sanguin,
          centre_id: demande.centre_id
        }
      });

      if (!stock) {
        return res.status(404).json({ message: 'Stock de ce type de sang introuvable dans ce centre.' });
      }

      if (stock.quantite < demande.quantity_needed) {
        return res.status(400).json({ message: 'Stock insuffisant pour répondre à la demande.' });
      }

      stock.quantite -= demande.quantity_needed;
      await stock.save();
    }

    demande.status = statut;
    await demande.save();

    // --- ENVOI EMAIL ---
    if (demande.User && demande.User.email) {
      // Configurer transporteur SMTP (exemple Gmail, adapter selon ton service email)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tchiosteve425@gmail.com',     // <-- à remplacer par ton email
          pass: 'razg qjre qapa vaht'     // <-- mot de passe d’application ou mot de passe SMTP
        }
      });

      // Sujet et message selon statut
      let subject = '';
      let text = '';

      if (statut === 'validée') {
        subject = 'Votre demande de sang a été validée';
        text = `Bonjour ${demande.User.name},\n\nVotre demande de sang (Groupe: ${demande.groupe_sanguin}) a été validée. Merci de vous présenter au centre concerné.\n\nCordialement,\nL'équipe Banque de Sang`;
      } else if (statut === 'refusée') {
        subject = 'Votre demande de sang a été refusée';
        text = `Bonjour ${demande.User.name},\n\nNous sommes désolés de vous informer que votre demande de sang (Groupe: ${demande.groupe_sanguin}) a été refusée. Veuillez nous contacter pour plus d'informations.\n\nCordialement,\nL'équipe Banque de Sang`;
      }

      await transporter.sendMail({
        from: '"Banque de Sang" <ton.email@gmail.com>',
        to: demande.User.email,
        subject,
        text
      });
    }

    res.json({ message: `Demande ${statut}.`, demande });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
  }
});


router.get("/statsdemandes", verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const demandes = await BloodRequest.count({
      where: { status: "en_attente" },
    });
    res.status(200).json({ total: demandes });
  } catch (error) {
    console.error("Erreur lors du calcul des stats demandes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});



module.exports = router;
