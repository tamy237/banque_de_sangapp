// cron.js
const cron = require('node-cron');
const envoyerRappel = require('./utils/rappelRendezvous');

// 🕗 Tous les jours à 8h
cron.schedule('0 8 * * *', () => {
  console.log("⏰ Tâche CRON exécutée pour les rappels de rendez-vous...");
  envoyerRappel();
});
