const { Donation, User } = require('../models');
const { Op } = require('sequelize');

const envoyerRappel = async () => {
  const today = new Date();
  const deuxJoursPlusTard = new Date(today);
  deuxJoursPlusTard.setDate(today.getDate() + 2);

  const dons = await Donation.findAll({
    where: {
      datedisponibilite: {
        [Op.eq]: deuxJoursPlusTard.toISOString().split('T')[0] // format YYYY-MM-DD
      },
      status: "confirmé"
    },
    include: {
      model: User,
      attributes: ['nom', 'email', 'telephone']
    }
  });

  for (let don of dons) {
    const { nom, email, telephone } = don.User;
    const date = don.datedisponibilite;

    console.log(`Envoi de rappel à ${nom} (Tel: ${telephone}, Email: ${email}) pour le don prévu le ${date}`);
    // Envoie SMS ou email ici si tu as un service comme Twilio ou SMTP
  }
};

module.exports = envoyerRappel;
