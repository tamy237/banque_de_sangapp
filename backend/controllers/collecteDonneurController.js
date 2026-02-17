// controllers/collecteDonneurController.js
const CollecteDonneur = require('../models/CollecteDonneur');
const { User } = require('../models');  // Remplacé 'Donneur' par 'User'
const Collecte = require('../models/Collecte');

const addDonneurToCollecte = async (req, res) => {
  const { donneur_id, remarque } = req.body;
  const { id } = req.params;  // Récupérer l'id de la collecte depuis l'URL

  try {
    // Vérification si le donneur existe
    const donneur = await User.findByPk(donneur_id);  // Remplacé 'Donneur' par 'User'
    if (!donneur) {
      return res.status(404).json({ error: 'Donneur introuvable.' });
    }

    // Vérification si la collecte existe
    const collecte = await Collecte.findByPk(id);
    if (!collecte) {
      return res.status(404).json({ error: 'Collecte introuvable.' });
    }

    // Création du lien entre le donneur et la collecte
    const collecteDonneur = await CollecteDonneur.create({
      donneur_id,
      collecte_id: id,
      remarque,
    });

    res.status(201).json({ message: 'Donneur ajouté à la collecte avec succès.', collecteDonneur });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du donneur à la collecte.' });
  }
};

// Récupérer tous les donneurs d'une collecte
const getDonneursByCollecte = async (req, res) => {
  const { id } = req.params;  // Récupérer l'id de la collecte depuis l'URL

  try {
    const donneurs = await CollecteDonneur.findAll({
      where: { collecte_id: id },
      include: [
        { model: User, as: 'donneur' },  // Remplacé 'Donneur' par 'User'
        { model: Collecte, as: 'collecte' },
      ],
    });

    if (donneurs.length === 0) {
      return res.status(404).json({ message: 'Aucun donneur trouvé pour cette collecte.' });
    }

    res.json(donneurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des donneurs pour cette collecte.' });
  }
};

module.exports = { addDonneurToCollecte, getDonneursByCollecte };
