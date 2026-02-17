// models/DonDeSang.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const DonDeSang = sequelize.define('DonDeSang', {
  nom: DataTypes.STRING,
  age: DataTypes.INTEGER,
  telephone: DataTypes.STRING, // utiliser STRING pour les numéros de téléphone
  sexe: DataTypes.STRING,
  poids: DataTypes.INTEGER,
  groupeSanguin: DataTypes.STRING,
  quantite: DataTypes.INTEGER,
  statut: {
    type: DataTypes.ENUM('en_attente', 'valide', 'refuse'),
    defaultValue: 'en_attente'
  },
  dateDon: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  centreId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});


module.exports = DonDeSang;
