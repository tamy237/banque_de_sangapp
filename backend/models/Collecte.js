const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Centre = require('./Centre');

const Collecte = sequelize.define('Collecte', {
  type: {
    type: DataTypes.STRING,
    allowNull: true, // Peut être 'mobile', 'fixe', etc.
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  heure: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  centre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cts: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  associations: {
    type: DataTypes.TEXT, // texte brut (ex: 'Croix-Rouge, Lions Club')
    allowNull: true,
  },
}, {
  tableName: 'Collectes',
  timestamps: true,
});

// Association
Collecte.belongsTo(Centre, { foreignKey: 'centre_id', as: 'centre' });

module.exports = Collecte;
