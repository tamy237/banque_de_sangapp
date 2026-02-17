const express = require('express');
const router = express.Router();
const DonDeSang = require('../models/DonDeSang');
const Stock = require('../models/Stock');
const Centre = require('../models/Centre'); // On inclut le modèle Centre
const verifyToken = require('../middleware/authMiddleware');

// POST : Enregistrer un don
router.post('/', verifyToken, async (req, res) => {
  const { nom, age, telephone, sexe, poids, groupeSanguin, quantite, centreId } = req.body;

  try {
    // Vérifier si le centre existe
    const centre = await Centre.findByPk(centreId);
    if (!centre) {
      return res.status(400).json({ message: 'Centre invalide.' });
    }

    // Enregistrer le don de sang
    const don = await DonDeSang.create({
      nom,
      age,
      telephone,
      sexe,
      poids,
      groupeSanguin,
      quantite,
      centreId  // On enregistre le centre choisi
    });

    // Mettre à jour le stock de sang
    const stock = await Stock.findOne({ where: { groupeSanguin: don.groupeSanguin } });
    if (stock) {
      stock.quantite += don.quantite;
      await stock.save();
    } else {
      await Stock.create({
        groupeSanguin: don.groupeSanguin,
        quantite: don.quantite
      });
    }

    res.json({ message: 'Don de sang enregistré avec succès.', don });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'enregistrement du don." });
  }
});

module.exports = router;
