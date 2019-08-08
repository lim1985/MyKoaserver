/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Reference_RolesArea', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },      
             
          status:{
            type:DataTypes.INTEGER,
            allowNull:false,  
          }, 
          // A_ID:{
          //   type:DataTypes.INTEGER,
          //   allowNull:false,  
          // },    
          // R_ID:{
          //   type:DataTypes.INTEGER,
          //   allowNull:false,  
          // },    
    }, {
    timestamps: false,
    tableName: 'LIM_Reference_RolesArea'
    });
  };
  