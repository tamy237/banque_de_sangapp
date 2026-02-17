const sequelize = require('../config/database');

const User = require('./User');
const Donation = require('./Donation');
const Centre = require('./Centre');
const Collecte = require('./Collecte');
const Stock = require('./Stock');
const BloodRequest = require('./BloodRequest');
const AppelModel = require('./Appel');

const Appel = AppelModel(sequelize, require('sequelize').DataTypes);

// Associations
User.hasMany(Donation, { foreignKey: 'user_id' });
Donation.belongsTo(User, { foreignKey: 'user_id' });

Centre.hasMany(Donation, { foreignKey: 'centre_id' });
Donation.belongsTo(Centre, { foreignKey: 'centre_id' });

Centre.hasMany(Collecte, { foreignKey: 'centre_id' });
Collecte.belongsTo(Centre, { foreignKey: 'centre_id' });

Centre.hasMany(BloodRequest, { foreignKey: 'centre_id' });
BloodRequest.belongsTo(Centre, { foreignKey: 'centre_id' });

User.hasMany(BloodRequest, { foreignKey: 'user_id' });
BloodRequest.belongsTo(User, { foreignKey: 'user_id' });

Stock.hasMany(BloodRequest, {
  foreignKey: 'groupeSanguin',
  sourceKey: 'groupeSanguin'
});
BloodRequest.belongsTo(Stock, {
  foreignKey: 'groupeSanguin',
  targetKey: 'groupeSanguin'
});

Stock.belongsTo(Centre, {
  foreignKey: 'centre_id',
  as: 'centre'
});

Appel.belongsTo(Centre, { foreignKey: 'centre_id' });
Appel.belongsTo(Collecte, { foreignKey: 'collecte_id' });
Centre.hasMany(Appel, { foreignKey: 'centre_id' });
Collecte.hasMany(Appel, { foreignKey: 'collecte_id' });


module.exports = {
  sequelize,
  User,
  Donation,
  Centre,
  Collecte,
  Stock,
  BloodRequest,
  Appel // 👈 Ajout ici
};
