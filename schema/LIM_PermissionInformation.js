/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_PermissionInformation', {
   
      RoleID:{
        type:DataTypes.INTEGER,
          allowNull:false
        },  
        PermissionKey: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      IsParent: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        IsView: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        IsEdit: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        DepID:{
          type: DataTypes.INTEGER,
          allowNull: false
        }
    }, {
    timestamps: false,
    tableName: 'LIM_PermissionInformation'
    });
  };
  