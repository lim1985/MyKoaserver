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

module.exports={
  gov
}