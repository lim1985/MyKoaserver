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
     dialectOptions: {
    useUTC: false //for reading from database
  },
    define:{
      timestamps:false
    },
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  });
  gov
  .authenticate()
  .then(async () => {
    console.log('数据库连接成功了！')
    gov.sync().then(function(result){
      console.log('角色和权限多对多')
      //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
      })
    // const admin = gov.import('../schema/T_Admin.js')
    // const area = gov.import('../schema/T_Area.js')


  })
module.exports={
  gov
}