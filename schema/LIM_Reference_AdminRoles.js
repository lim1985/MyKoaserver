/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Reference_RolesDeps', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },         
    }, {
    timestamps: false,
    tableName: 'LIM_Reference_RolesDeps'
    });
  };
  