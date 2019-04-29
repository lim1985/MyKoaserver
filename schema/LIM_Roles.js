/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Roles', {
    
        roleid:{
          type:DataTypes.INTEGER,
          allowNull:false,
          primaryKey: true,
          autoIncrement: true
          },  
          rolekey: {
          type: DataTypes.STRING,
          allowNull: false
          } ,
        rolevalue: {
          type: DataTypes.STRING,
          allowNull: false
        } ,
        roledescription:{
          type: DataTypes.TEXT,
          allowNull: true
        },
        addtime:{
          type: DataTypes.DATE(6), 
          defaultValue: Sequelize.NOW 
        },
        static:{
          type: DataTypes.INTEGER, 
          defaultValue: 1
        },
        PremissionValue: {
          type: DataTypes.STRING,
          allowNull: true
        } ,


    }, {
    timestamps: false,
    tableName: 'LIM_Roles'
    });
  };
