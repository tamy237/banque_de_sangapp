const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Donation = sequelize.define('Donation', {
  dateDisponibilite: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  poids: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
   sexe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  groupeSanguin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  centre_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  remarque: {
    type: DataTypes.STRING
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'valide', 'refuse'),
    defaultValue: 'en_attente'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // ou 'Users' si tu utilises le nom de table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT' // ou 'SET NULL' si tu veux autoriser la suppression
  }
}, {
  tableName: 'donations'
});

Donation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Donation, { foreignKey: 'user_id' });

module.exports = Donation;