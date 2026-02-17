// models/BloodRequest.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Centre = require('./Centre');
const User = require('./User');
const Stock = require('./Stock');

const BloodRequest = sequelize.define('BloodRequest', {
  
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sexe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupe_sanguin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_besoin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  date_derniere_transfusion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  quantity_needed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('en attente', 'validée', 'refusée'),
    defaultValue: 'en attente',
  },
  centre_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Relations
BloodRequest.belongsTo(Centre, { foreignKey: 'centre_id' });
BloodRequest.belongsTo(User, { foreignKey: 'user_id' });
BloodRequest.belongsTo(Stock, {
  foreignKey: 'groupeSanguin',  // Assurez-vous d'utiliser 'groupe_sanguin' pour la relation
  targetKey: 'groupeSanguin', // Correspond au champ unique dans Stock pour le type sanguin
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

module.exports = BloodRequest;
