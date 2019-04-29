/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Department_Members', {
   
        AdminId:{
        type:DataTypes.INTEGER,
          allowNull:false
        },  
        DepartmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Permission_key: {
          type: DataTypes.STRING,
          allowNull: false
        },
        EnableViewer: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        EnableEditer: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        RoleID:{
          type: DataTypes.INTEGER,
          allowNull: false
        }
    }, {
    timestamps: false,
    tableName: 'LIM_Department_Members'
    });
  };
  