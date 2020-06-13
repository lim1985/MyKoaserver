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
              allowNull:true,             
            },  
        PhoneNum:{
              type:DataTypes.STRING,
                allowNull:true,             
              }, 
        DepName:{
          type:DataTypes.STRING,
          allowNull:true,             
                },   
        DepID:{
               type:DataTypes.INTEGER,
               allowNull:true,         
                },
        status:{
          type:DataTypes.INTEGER,
          allowNull:true,         
        },
        recordUrl:{
          type:DataTypes.STRING,
          allowNull:true,             
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
  