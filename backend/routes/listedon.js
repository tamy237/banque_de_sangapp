const express = require('express');
const router = express.Router();

const DonDeSang = require('../models/DonDeSang');
const Centre = require('../models/Centre');

// Liste des dons avec les centres associés
router.get('/', async (req, res) => {
  try {
    const listedons = await DonDeSang.findAll({
      include: {
        model: Centre,
        attributes: ['id', 'name', 'address', 'phone']
      }
    });
    res.json(listedons);
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des dons :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
