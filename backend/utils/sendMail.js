const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou 'outlook', etc.
  auth: {
    user: 'tchiosteve425@gmail.com',
    pass: 'Bonjour237.4', // NE JAMAIS utiliser ton vrai mot de passe Gmail
  },
});

const sendStatusEmail = async (to, nom, statut) => {
  const subject = `Mise à jour du statut de votre don`;
  const statusMessages = {
    valide: "Votre demande de sang a été accepté.vous pouvez passer recuperer la sang dans le centre concerné!",
    refuse: "Nous sommes désolés, Notre stock ne nous permet pas de vous satisfaire",
    en_attente: "Votre demande est actuellement en attente de validation.",
  };

  const html = `
    <h3>Bonjour ${nom},</h3>
    <p>${statusMessages[statut]}</p>
    <p>— Banque de sang</p>
  `;

  return transporter.sendMail({
    from: '"Banque de sang" <tchiosteve425@gmail.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendStatusEmail;
