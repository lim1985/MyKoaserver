/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Phonerecord', {
        ID:{
            type:DataTypes.INTEGER,
            allowNull:false,          
            primaryKey: true,
            autoIncrement: true        
          },          
        UserName:{
            type:DataTypes.STRING,
              allowNull:false,             
            },  
        PhoneNum:{
              type:DataTypes.STRING,
                allowNull:false,             
              }, 
        DepName:{
          type:DataTypes.STRING,
          allowNull:false,             
                },   
        DepID:{
               type:DataTypes.INTEGER,
               allowNull:false,         
                },
        status:{
          type:DataTypes.INTEGER,
          allowNull:false,         
        },
        recordUrl:{
          type:DataTypes.STRING,
          allowNull:false,             
                }, 
        
        Intime: {
          type: DataTypes.DATE,
          allowNull: true,      
        },   
    }, {
    timestamps: false,
    tableName: 'LIM_Phonerecord'
    });
  };
  