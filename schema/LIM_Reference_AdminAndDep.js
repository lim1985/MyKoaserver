/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Reference_AdminAndDep', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },          
          AdminID:{
            type:DataTypes.INTEGER,
              allowNull:false,             
            },  
        DepID:{
        type:DataTypes.INTEGER,
          allowNull:false,         
        }     
    }, {
    timestamps: false,
    tableName: 'LIM_Reference_AdminAndDep'
    });
  };
  