/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_SMSDepCount', {
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
            SMSCount:{
        type:DataTypes.INTEGER,
          allowNull:false,         
        }     
    }, {
    timestamps: false,
    tableName: 'LIM_SMSDepCount'
    });
  };
  