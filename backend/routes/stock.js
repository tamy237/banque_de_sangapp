// routes/stock.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const { Stock, Centre } = require('../models');


const router = express.Router();

// Consulter le stock de sang

router.get('/', verifyToken, allowRoles('personnel',"utilisateur"), async (req, res) => {
  try {
    const stocks = await Stock.findAll({
      include: [{
        model: Centre,
        as: 'centre', // ✅ alias obligatoire ici
        attributes: ['name'],
      }],
    });
    res.json(stocks);
  } catch (err) {
    console.error('Erreur récupération stock :', err); // ✅ log utile
    res.status(500).json({ message: 'Erreur lors de la récupération des stocks.' });
  }
});

// GET /centres
// router.get('/centresroutes', verifyToken, allowRoles('personnel'), async (req, res) => {
//   try {
//     const centres = await Centre.findAll({ attributes: ['id', 'name'] });
//     res.json(centres);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la récupération des centres.' });
//   }
// });


//message d'alert
router.get('/alerte', verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const seuil = 5; // seuil critique par défaut
    const stocks = await Stock.findAll();
    res.json(stocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération du stock.' });
  }
});

router.get("/statsstock", verifyToken, allowRoles("personnel"), async (req, res) => {
  try {
    const total = await Stock.sum("quantity");
    res.status(200).json({ total });
  } catch (error) {
    console.error("Erreur lors du calcul du stock total :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
