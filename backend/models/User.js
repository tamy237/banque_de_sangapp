const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'unique_email',
      msg: 'Cet email est déjà utilisé.',
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      name: 'unique_phone',
      msg: 'Ce numéro est déjà utilisé.',
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('utilisateur', 'personnel'),
    allowNull: false,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true, // seulement pour les utilisateurs
  },
  mustChangePassword: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',        // ✅ Nom exact de ta table
  freezeTableName: true      // (optionnel) pour éviter que Sequelize le mette au pluriel automatiquement
});

module.exports = User;
