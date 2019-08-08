/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Reference_RolesPermission', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },  
          RoleID:{
            type:DataTypes.INTEGER,
            allowNull:false,  
          },    
          PID:{
            type:DataTypes.INTEGER,
            allowNull:false,  
          },  
      
       
    }, {
    timestamps: false,
    tableName: 'LIM_Reference_RolesPermission'
    });
  };
  