const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Collecte = require('./Collecte');

const CollecteDonneur = sequelize.define('CollecteDonneur', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  collecte_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Collecte,
      key: 'id',
    },
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',  // Exemple de statut (en attente, confirmé, etc.)
  },
});

User.belongsToMany(Collecte, { through: CollecteDonneur });
Collecte.belongsToMany(User, { through: CollecteDonneur });

module.exports = CollecteDonneur;
