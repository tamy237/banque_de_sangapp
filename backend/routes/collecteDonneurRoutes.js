const express = require('express');
const router = express.Router();
const { Collecte, Centre } = require('../models'); // Assure-toi que Collecte et Centre sont bien définis
const verifyToken = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const { Op } = require('sequelize');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, date, heure, centre_id, cts, associations} = req.body;
    console.log("Requête reçue :", req.body);
    const userRole = req.user?.role;

    if (userRole !== 'personnel') {
      return res.status(403).json({ message: "Accès interdit" });
    }
    if ( !type || !date || !heure || !centre_id || !cts || !associations) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    console.log(res.body);

    const newCollecte = await Collecte.create({
      type, date, heure, centre_id, cts, associations
    });

    res.status(201).json(newCollecte);
  } catch (err) {
    console.error("Erreur création centre:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer toutes les collectes
router.get('/', async (req, res) => {
  try {
    const collectes = await Collecte.findAll({
      include: [
        {
          model: Centre,
          attributes: ['id', 'name', 'location', 'address'], // ajoute les champs utiles
        }
      ],
      order: [['date', 'DESC'], ['heure', 'DESC']],
    });
    res.json(collectes);
  } catch (error) {
    console.error('Erreur lors de la récupération des collectes :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// SUPPRIMER une collecte par ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Chercher la collecte
    const collecte = await Collecte.findByPk(id);
    if (!collecte) {
      return res.status(404).json({ message: 'Collecte non trouvée' });
    }

    // Supprimer la collecte
    await collecte.destroy();

    res.json({ message: 'Collecte supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la collecte :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
  }
});

router.get("/statscollectes", verifyToken, allowRoles('personnel'), async (req, res) => {
  try {
    const total = await Collecte.count({
      where: { date: { [Op.gt]: new Date() } },
    });
    res.status(200).json({ total });
  } catch (error) {
    console.error('Erreur lors du calcul des stats collectes :', error);
    res.status(500).json({ message: 'Erreur serveur lors du calcul des statistiques.' });
  }
});


module.exports = router;
