// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const verifyToken = require('./middleware/authMiddleware');
const allowRoles = require('./middleware/roleMiddleware');
require('./cron'); // ⏱ démarre le rappel automatique

const app = express();
const PORT = process.env.PORT || 5500;

// Connexion à la DB via models/index.js
const {
  sequelize,
  User,
  Donation,
  Centre,
  Collecte,
  Stock,
  DemandeDon,
  BloodRequest
} = require('./models');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const stockRoutes = require('./routes/stock');
const donationRoutes = require('./routes/donation');
const appelRoutes = require('./routes/appel');
const listedonRoutes = require('./routes/listedon');
const centreRoutes = require('./routes/centresroutes');
const routeCollecteDonneur = require('./routes/collecteDonneurRoutes');
const bloodRequestRoutes = require('./routes/bloodRequest');
const collecteroutesRoutes = require('./routes/collecteroute');



app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/blood_request', bloodRequestRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/appel', appelRoutes);
app.use('/api/listedon', listedonRoutes);
app.use('/api/centresroutes', centreRoutes);
app.use('/api/collectes', routeCollecteDonneur);
app.use('/api/collecteroute', collecteroutesRoutes);
app.use('/api/collecteDonneurRoutes', routeCollecteDonneur);
app.get('/protected', verifyToken, allowRoles('utilisateur'), (req, res) => {
  res.json({ message: 'Accès autorisé ✅', user: req.user });
});

// Vérification du .env
console.log("Email utilisé :", process.env.EMAIL_USER);
console.log("Mot de passe appli (longueur) :", process.env.EMAIL_PASS?.length);

// Test de la connexion DB
async function startServer() {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("Connexion à MySQL réussie.");
      break;
    } catch (err) {
      attempt++;
      console.log(`Tentative ${attempt}/${maxRetries} échouée...`);
      console.log("Nouvelle tentative dans 5 secondes...");
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  if (attempt === maxRetries) {
    console.error("Impossible de se connecter à MySQL après plusieurs tentatives.");
    process.exit(1);
  }

  try {
    await sequelize.sync({ alter: true });
    console.log("Toutes les tables ont été synchronisées.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });

  } catch (syncError) {
    console.error("Erreur lors de la synchronisation :", syncError);
  }
}

startServer();

