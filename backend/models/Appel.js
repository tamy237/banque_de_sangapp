// models/Appel.js (exemple)
module.exports = (sequelize, DataTypes) => {
  const Appel = sequelize.define('Appel', {
    centre_id: DataTypes.INTEGER,
    collecte_id: DataTypes.INTEGER, // 👈 Ajoute ceci
    groupeSanguin: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    heure: DataTypes.TIME
  });

  Appel.associate = (models) => {
    Appel.belongsTo(models.Centre, { foreignKey: 'centre_id' });
    Appel.belongsTo(models.Collecte, { foreignKey: 'collecte_id' });
  };

  return Appel;
};
