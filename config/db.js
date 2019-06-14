const Sequelize = require('sequelize');

const config = {
  database: 'wwwgovcn',
  username: 'sa',
  password: 'aa//123',
  host: '59.230.230.48',
  port: 1433
}
const gov = new Sequelize(config.database,config.username,config.password, {
    host: config.host,
    dialect: 'mssql',//'mysql'|'sqlite'|'postgres'|'mssql',  
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
    define:{
      timestamps:false
    }
  });
  gov
  .authenticate()
  .then(async () => {
    console.log('数据库连接成功了！')
   
    // const admin = gov.import('../schema/T_Admin.js')
    // const area = gov.import('../schema/T_Area.js')

    // area.hasOne(admin);
    // admin.belongsTo(area);
    // area.hasMany(admin,{
    //   foreignKey:'AdminID',sourceKey:'id', as: 'admins'
    // })
    // admin.belongsTo(area, {
    //   foreignKey:'AdminID',targetKey:'AdminID', as: 'areas'
    // })
    // area.hasMany(admin, { foreignKey: 'ID', targetKey: 'AdminID', as: 'admin' });
    // admin.belongsTo(area,{as:'area',foreignKey:'ID'});
  
    // gov.sync().then(function(result){
    //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
    // })
  })
module.exports={
  gov
}