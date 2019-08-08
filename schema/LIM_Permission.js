/* jshint indent: 2 */


module.exports = function(sequelize, DataTypes) {
    return sequelize.define('LIM_Permission', {
      ID:{
            type:DataTypes.INTEGER,
              allowNull:false,
              primaryKey: true,
              autoIncrement: true
            },  
        RoleID:{
          type:DataTypes.INTEGER,
            allowNull:true,                   
          },  
          Permission_key: {
            type: DataTypes.STRING,
            allowNull: true
          },
          Permission_name: {
            type: DataTypes.STRING,
            allowNull: true
          },   
          description: {
            type: DataTypes.STRING,
            allowNull: true
          },          
          optioncode: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          OrderID:{
            type:DataTypes.INTEGER,
            allowNull:true,  
          },
          areakey:{
            type:DataTypes.STRING,
            allowNull:true,  
          },
          AreaID:{
            type:DataTypes.INTEGER,
            allowNull:true,  
          },
          status:{
            type:DataTypes.INTEGER,
            allowNull:true,  
          }

    }, {
     paranoid: true,
    timestamps: false,
    tableName: 'LIM_Permission'
    });
  };
