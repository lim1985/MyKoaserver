/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_ResferenceAndDep', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },
        DepID:{
        type:DataTypes.INTEGER,
          allowNull:false,
         
        },  
        status: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UserPhoneID: {
      
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
    timestamps: false,
    tableName: 'LIM_ResferenceAndDep'
    });
  };
  