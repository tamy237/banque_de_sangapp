const express = require('express');
const router = express.Router();
const { Centre, Collecte, BloodRequest } = require('../models');
const verifyToken = require('../middleware/authMiddleware');

// GET tous les centres
router.get('/', verifyToken, async (req, res) => {
  try {
    const userRole = req.user?.role;

    const centres = userRole === 'personnel'
      ? await Centre.findAll()
      : await Centre.findAll({
          attributes: ['id', 'name', 'location', 'latitude', 'longitude', 'address']
        });

    res.json(centres);
  } catch (err) {
    console.error("Erreur récupération centres:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// POST ajouter un centre
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, location, address, phone, latitude, longitude } = req.body;
    const userRole = req.user?.role;

    if (userRole !== 'personnel') {
      return res.status(403).json({ message: "Accès interdit" });
    }

    if (!name || !location || !address || !phone || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newCentre = await Centre.create({
      name, location, address, phone, latitude, longitude
    });

    res.status(201).json(newCentre);
  } catch (err) {
    console.error("Erreur création centre:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT mise à jour d’un centre
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, location, address, phone, latitude, longitude } = req.body;
    const { id } = req.params;
    const userRole = req.user?.role;

    if (userRole !== 'personnel') {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const centre = await Centre.findByPk(id);
    if (!centre) return res.status(404).json({ message: "Centre non trouvé" });

    centre.name = name;
    centre.location = location;
    centre.address = address;
    centre.phone = phone;
    centre.latitude = latitude;
    centre.longitude = longitude;

    await centre.save();
    res.status(200).json(centre);
  } catch (err) {
    console.error("Erreur MAJ centre:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// routes/centres.js
router.delete("/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  try {
    // Supprimer les demandes de sang associées
    await BloodRequest.destroy({ where: { centre_id: id } });

    // Supprimer les collectes associées
    await Collecte.destroy({ where: { centre_id: id } });

    // Supprimer le centre
    const deleted = await Centre.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Centre introuvable" });
    }

    res.json({ message: "Centre, collectes et demandes associées supprimés avec succès." });
  } catch (err) {
    console.error("Erreur suppression complète centre :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
