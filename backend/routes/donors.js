// routes/donors.js
const express = require('express');
const verifyToken = require('../middleware/authMiddleware');  // Import du middleware
const router = express.Router();

// Exemple de route protégée : afficher la liste des donneurs
router.get('/list', verifyToken, (req, res) => {
  // Ici, les informations des donneurs seront envoyées à l'utilisateur authentifié
  res.json({ message: 'Liste des donneurs récupérée avec succès.', donneurs: [] });
});
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Accès autorisé à l’utilisateur authentifié.', user: req.user });
  });
  

module.exports = router;
