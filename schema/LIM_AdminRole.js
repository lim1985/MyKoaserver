/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_AdminRole', {
      ID:{
          type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true
      },
      RoleID:{
        type:DataTypes.INTEGER,
          allowNull:false
        },  
      AdminID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    timestamps: false,
    tableName: 'LIM_AdminRole'
    });
  };
  