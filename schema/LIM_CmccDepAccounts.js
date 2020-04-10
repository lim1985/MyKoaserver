/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_CmccDepAccounts', {
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
        ApID:{
            type:DataTypes.STRING,
            allowNull:false,         
          },  
        Password:{
            type:DataTypes.STRING,
            allowNull:false,         
          },            
        Sign:{
            type:DataTypes.STRING,
            allowNull:false,         
          },  
        AddSerial:{
            type:DataTypes.STRING,
            allowNull:true,         
        },  
        EcName:{
            type:DataTypes.STRING,
            allowNull:false,         
        },  
        TemplateId:{
          type:DataTypes.STRING,
          allowNull:true,         
      },
        Params:{
          type:DataTypes.STRING,
          allowNull:true,         
      }  

    }, {
    timestamps: false,
    tableName: 'LIM_CmccDepAccounts'
    });
  };
  