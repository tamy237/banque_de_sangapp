// models/Stock.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define("Stock", {
  groupeSanguin: {  // Assure-toi que le nom de la colonne dans Stock est 'groupe_sanguin'
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true, // ou unique: true si ce n’est pas une clé primaire
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,  // Quantité initiale à zéro
  },
  centre_id: { // ✅ Ajout de la colonne
      type: DataTypes.INTEGER,
      allowNull: false,
    },
});
  
module.exports = Stock;
