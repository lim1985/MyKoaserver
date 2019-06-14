/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('T_Admin', {
    ID:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AdminName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    AdminPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false
    }
  
    
  }, {
  timestamps: false,
  tableName: 'T_Admin'
  });
};
