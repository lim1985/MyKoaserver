const db = require('../config/db')
const gov = db.gov
const Sequelize = require('sequelize');
const ErrInformation=gov.import('../schema/LIM_Errorinformation')
const Admin = gov.import('../schema/PE_Admin.js')
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')
var moment = require('moment');
// const Area = gov.import('../schema/LIM_Area')
// const Op = Sequelize.Op
// const Deps = gov.import('../schema/LIM_Department')
// Camera.hasMany(Car,{
//   foreignKey:'cameraId',sourceKey:'id', as: 'Cars'
// })
// Car.belongsTo(Camera, {
//   foreignKey:'cameraId',targetKey:'id', as: 'Camera'
// })
ErrInformation.hasMany(Admin,{
    foreignKey:'AdminID',sourceKey:'AdminID', as: 'AdminInfo'
  })
  ErrInformation.hasMany(UsersPhone,{
    foreignKey:'ID',sourceKey:'UserID', as: 'UserInfo'
  })
  // Admin.belongsTo(ErrInformation, {
  //   foreignKey:'AdminID',targetKey:'AdminID', as: 'AdminInfo'
  // })
// UsersPhone.hasOne(ResferenceUserPhoneAndDEP)

// gov.sync().then(function(result){
//   console.log('部门和列表成员同步完成')
//   //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
//   })

class ErrorInformationModel {
  static async Add(param)
  {
    return new Promise((resolve,reject)=>{
      try {
        var Mydate=new Date();
        var year=Mydate.getFullYear(); //获取完整的年份(4位,1970-????)
        var Month= Mydate.getMonth(); //获取当前月份(0-11,0代表1月)
        var Dates=Mydate.getDate();
        var Time= Mydate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        var Hours=Mydate.getHours(); //获取当前小时数(0-23)
        var Minutes=Mydate.getMinutes(); //获取当前分钟数(0-59)
        var seconds=Mydate.getSeconds(); //获取当前秒数(0-59)
        let _dataTime=year+'-'+Month+'-'+Dates+' '+Hours+':'+Minutes+':'+seconds
        let _fomrmatTime=moment(_dataTime).format('YYYY-MM-DD HH:mm:ss')
   
        //moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
        ErrInformation.create({   
          'status':false,
          'UserID':param.UserID,
          'InputTime':_fomrmatTime,
          'AdminID':param.AdminID,
          'Errorinformation':param.Errorinformation
        },
     
        ).then(res=>{
          if(res)
          {
            resolve({
              code:1,
              res
            })
          }
          else
          {
            resolve({
              code:-1              
            })
          }
    
        })
      } catch (error) {
          reject(error)
      }
    })
  }
  static async Select(param){
          return new Promise (async(resolve,reject)=>{
            try {
              const Errorlist=await ErrInformation.findAndCountAll({
                attributes:[
                  'InputTime',
                  'ID',                 
                  'UserID',
                  'AdminID',
                  'Errorinformation',
                   Sequelize.col('AdminInfo.AdminName'),
                   Sequelize.col('UserInfo.UserName'),                
                   Sequelize.col('UserInfo.UJOB'),
                   Sequelize.col('UserInfo.cellphone'),                           
                   Sequelize.col('UserInfo.H_cellphone'),
                   Sequelize.col('UserInfo.Tel'),
                   Sequelize.col('UserInfo.H_Tel'),                
                   Sequelize.col('UserInfo.avatar'),
                   Sequelize.col('UserInfo.QQ'),
                   Sequelize.col('UserInfo.Sex'),                
                   Sequelize.col('UserInfo.status'),
                   Sequelize.col('UserInfo.Permission_Key'),
                   Sequelize.col('UserInfo.Department_ID'),
                   Sequelize.col('UserInfo.Email'),
                   Sequelize.col('UserInfo.UJOB'),                
                   Sequelize.col('UserInfo.BirthDay'),
                   Sequelize.col('UserInfo.UserName'),
                  //  UserInfo.UJOB

                  // ID:record.ID,
                  // cellphone:record.cellphone,
                  // H_cellphone:record.H_cellphone,
                  // Tel:record.Tel,
                  // H_Tel:record.H_Tel,
                  // avatar:record.avatar,       
                  // QQ:record.QQ,
                  // Sex: record.Sex+'' ,
                  // status: record.status+'',
                  // DepKeylist:record.DepKeylist,

                  // Email:record.Email,
                  // UJOB:record.UJOB,
                  // BirthDay:record.BirthDay,
                  // UserName:record.UserName,

                 
              ],
                where:{
                  status:param.status
                },
                include:[{
                  model:Admin,                 
                  as:'AdminInfo',
                  attributes:[],
                  required: false   
                },
                {
                  model:UsersPhone,
                  as:'UserInfo',
                  attributes:[],
                  required: false   
                }           
              ],
              order:[
                ['ID', 'DESC'],],
              raw:true
              })
              resolve(Errorlist)

            } catch (error) {
              reject(error)
            }
          })
  }
  static async Del(param){

  }
  static async Update(param){
      return new Promise(async (resolve,reject)=>{
        try {
          // Permission.update(data,{where:{ID:data.ID}})
          const Isupdate=await ErrInformation.update(param,{
            where:{
              ID:param.ID
            }
          
          })
          if(Isupdate)
          {
            resolve({code:1})
          }
        } catch (error) {
          
        }
      })
  }
}

module.exports = ErrorInformationModel
