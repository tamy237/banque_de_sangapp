const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const verifyToken = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;
const MEDICAL_ACCESS_PASSWORD = process.env.MEDICAL_ACCESS_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function genererMotDePasseTemporaire() {
  return Math.random().toString(36).slice(-8); // ex: a4tz9sdf
}

// === ROUTE D’INSCRIPTION ===
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role, bloodType } = req.body;

  if (!name || !email || !phone || !role || (role === 'personnel' && !password)) {
    return res.status(400).json({ message: "Champs obligatoires manquants." });
  }

  try {
    const userExist = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { phone }]
      }
    });

    if (userExist) {
      return res.status(400).json({ message: "Email ou téléphone déjà utilisé." });
    }

    // 🔒 Vérifie si le mot de passe est bien le mot de passe secret pour les personnels
    if (role === 'personnel' && password !== MEDICAL_ACCESS_PASSWORD) {
      return res.status(403).json({ message: "Mot de passe incorrect pour le personnel médical." });
    }

    // Si utilisateur classique, utilise mot de passe fourni ou génère un temporaire
    const motDePasseInitial = role === 'personnel'
      ? MEDICAL_ACCESS_PASSWORD // temporairement stocké, sera changé après
      : (password || genererMotDePasseTemporaire());

    const hashedPassword = await bcrypt.hash(motDePasseInitial, 10);

    const userData = {
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      mustChangePassword: role === 'personnel'
    };

    if (role === 'utilisateur' && bloodType) {
      userData.bloodType = bloodType;
    }

    const newUser = await User.create(userData);

    if (role === 'personnel') {
      await transporter.sendMail({
        to: email,
        subject: "Compte personnel médical créé",
        text: `Bonjour ${name}, vous avez été inscrit avec succès comme personnel médical.\n\nUtilisez le mot de passe temporaire que vous avez saisi pour vous connecter et pensez à le changer dès votre première connexion.`
      });
    }

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    const { password: _, ...userSansPass } = newUser.toJSON();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: userSansPass,
      motDePasseInitial: password ? undefined : motDePasseInitial,
      token,
      mustChangePassword: newUser.mustChangePassword
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
  }
});

// === ROUTE LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Email ou mot de passe incorrect." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '4h' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        mustChangePassword: user.mustChangePassword || false
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
});

// === CHANGER MOT DE PASSE ===
router.put('/changerpass', verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { nouveauMotDePasse } = req.body;

  if (!nouveauMotDePasse || nouveauMotDePasse.length < 6) {
    return res.status(400).json({ message: "Le mot de passe doit avoir au moins 6 caractères." });
  }

  try {
    const hashed = await bcrypt.hash(nouveauMotDePasse, 10);
    await User.update(
      { password: hashed, mustChangePassword: false },
      { where: { id: userId } }
    );
    res.json({ message: "Mot de passe changé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors du changement de mot de passe." });
  }
});

// === LISTE TOUS LES UTILISATEURS ===
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs." });
  }
});

// === SUPPRIMER UN UTILISATEUR ===
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    await user.destroy();
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
});

module.exports = router;
