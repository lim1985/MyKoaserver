/* jshint indent: 2 */

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_user_token', {
    
        id:{
          type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true
          },  
         Adminid: {
            type: DataTypes.STRING,
            allowNull: false
          } ,
        token: {
          type: DataTypes.STRING,
          allowNull: false
        } ,
        expire :{
            type: DataTypes.DATE,
            allowNull: true
        }

    }, {
    timestamps: false,
    tableName: 'LIM_user_token'
    });
  };
