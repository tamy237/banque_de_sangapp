const Collecte = require('../models/Collecte');
const Centre = require('../models/Centre');

// Créer une collecte
const createCollecte = async (req, res) => {
  const { date, lieu, centre_id } = req.body;

  if (!date || !lieu || !centre_id) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const centre = await Centre.findByPk(centre_id);
    if (!centre) {
      return res.status(404).json({ error: 'Centre organisateur introuvable.' });
    }

    const collecte = await Collecte.create({ date, lieu, centre_id });

    res.status(201).json({ message: 'Collecte créée avec succès', collecte });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la collecte.' });
  }
};

// Récupérer toutes les collectes
// Récupérer toutes les collectes avec leur centre associé
const getCollectes = async (req, res) => {
  try {
    const collectes = await Collecte.findAll({
      include: {
        model: Centre,
        as: 'centre',
        attributes: ['id', 'nom'], // on ne récupère que ce qui est nécessaire
      },
    });
    res.json(collectes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des collectes' });
  }
};
exports.addDonneurToCollecte = async (req, res) => {
  const { user_id, collecte_id } = req.body;
  try {
    const collecte = await Collecte.findByPk(collecte_id);
    const user = await User.findByPk(user_id);

    if (!collecte || !user) {
      return res.status(404).json({ error: 'Collecte ou utilisateur introuvable.' });
    }

    await collecte.addUser(user);  // Utilisation de la relation définie dans le modèle

    res.status(200).json({ message: 'Utilisateur ajouté à la collecte avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur à la collecte.' });
  }
};


// Supprimer une collecte
const deleteCollecte = async (req, res) => {
  try {
    const { id } = req.params;
    await Collecte.destroy({ where: { id } });
    res.status(200).json({ message: 'Collecte supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
};

// ✅ Export propre
module.exports = {
  createCollecte,
  getCollectes,
  deleteCollecte,
};
