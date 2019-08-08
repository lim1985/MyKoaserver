/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Category', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },                   
          CategoryName:{
            type:DataTypes.STRING,
            allowNull:false,  
          },  
          DepID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
          } ,
          status:{
            type:DataTypes.BOOLEAN,
            allowNull:false,  
            defaultValue: false
            },
          IsEdit:{
            // type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
            type:DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
          },
            IsView:{
              // type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
              type:DataTypes.BOOLEAN,
              allowNull: false,
              defaultValue: false
            }
    }, {
    timestamps: false,
    tableName: 'LIM_Category'
    });
  };
  