const db = require('../config/db')
const gov = db.gov
const attachs = gov.import('../schema/LIM_attachs.js')
const MeetingList = gov.import('../schema/LIM_MeetingList.js')
const MeetingSubject = gov.import('../schema/LIM_MeetingSubject.js')
const MeetingUsers = gov.import('../schema/LIM_MeetingUsers.js')
const userPhone = gov.import('../schema/LIM_UsersPhone.js')
const Sequelize = require('sequelize');
const ReferceGroupUser = gov.import('../schema/LIM_RefereceGroupAndUserPhone.js')
const CustomGroup = gov.import('../schema/LIM_CustomGroup.js')
const Dep = gov.import('../schema/LIM_Department.js')



MeetingList.hasMany(MeetingSubject,{foreignKey:'meetingID',sourceKey:'meetingID',as:'M_Sub'});//MeetingList和MeetingSubject 表 1对多
MeetingSubject.hasMany(attachs,{foreignKey:'meetingSubjectID',sourceKey:'meetingSubjectID',as:'M_atta'});//MeetingSubject和attachs 表 1对多
// MeetingSubject.belongsTo(Dep,{foreignKey:'meetingSubjectDepID',targetKey:'DepartmentId',as:'M_Dep'});//MeetingSubject和attachs 表 1对1
// MeetingSubject.hasOne(Dep,{foreignKey:'DepartmentId',targetKey:'meetingSubjectDepID',as:'M_Dep'});//MeetingSubject和attachs 表 1对1
MeetingSubject.belongsTo(Dep,{foreignKey:'meetingSubjectDepID',sourceKey:'DepartmentId',as:'M_Dep'});//MeetingSubject和attachs 表 1对1

MeetingSubject.hasMany(MeetingUsers,{foreignKey:'meetingSubjectID',sourceKey:'meetingSubjectID',as:'M_Users'});//MeetingSubject和attachs 表 1对多
// Dep.belongsTo(MeetingSubject,{foreignKey:'DepartmentId',sourceKey:'meetingSubjectDepID',as:'Dep'});//MeetingSubject和attachs 表 1对多
MeetingUsers.belongsTo(userPhone,{ foreignKey:'meetingUserID',sourceKey:'ID',as:'users' })
MeetingUsers.belongsTo(CustomGroup,{ foreignKey:'meetingPersonGroupID',targetKey:'GroupID',as:'Group' })

// CustomGroup.hasOne(ReferceGroupUser,{foreignKey:'GroupID',sourceKey:'GroupID' })

//Permission.hasMany(DEP,{foreignKey:'PID',sourceKey:'ID',as:'Deps'});//area和Permission 表 1对多


class MeetingModel {
  static async selectmeetSubUsers(data)
  {
    return new Promise(async(resolve,reject)=>{
      try {
            let userlist=await MeetingSubject.findAll({
              attributes:[
               
                Sequelize.col('M_Users->users.UJOB'),//内容
                Sequelize.col('M_Users->users.ID'),//内容
                Sequelize.col('M_Users->users.cellphone'),//内容
                Sequelize.col('M_Users->users.Department_ID'),//内容
                Sequelize.col('M_Users->users.UserName'),//内容
            ],
              where:{
                meetingSubjectID:data.m_submeetID
              },
              include:[
                {
                  attributes:['meetingPersonGroupID'],
                  model:MeetingUsers,
                  as:'M_Users',
                  include:[
                    {
                      attributes:[],
                      model:userPhone,
                      as:'users'
                    }
                  ]
                }               
              ],
              // order:[
              //    ['meetingID','DESC']
              //   ],
                raw:true         
            })
            resolve(userlist)
      } catch (err) {
        reject(err)
        
      }
    })
  }
  static async removeSubmeetingUser(data)
  {
    return new Promise(async(resolve,reject)=>{
      try {
        let res=await MeetingUsers.destroy({
            where:{
              meetingPersonID:data.meetingPersonID
            }
          })
          console.log(res)
          resolve(res)
      } catch (err) {
        reject(err)
      }
    })
  }
  //批量新增议题参加人员
  static async MeetingUsersCreate(data)
  {       
    return new Promise((resolve,reject)=>{
          try {
            MeetingUsers.bulkCreate(data).then(res=>{
              console.log(res)
              resolve(true)    
            })                
          } catch (error) {
              reject(error);
          }
    })
  }

 //议题新增
 static async MeetingSubjectCreate(data)
 {
  return new Promise(async(resolve,reject)=>{
    try {
      let result=await MeetingSubject.create(data);
          resolve(result)
    } catch (error) {
      reject(error)
    }
  })
 }

  //会议新增
  static async MeetingCreate(data)
  {
    return new Promise(async(resolve,reject)=>{
      try {
        let result=await MeetingList.create(data);
            resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  static async selectMeetListByDepID(data)
  {
    return new Promise(async (resolve,reject)=>{
      try {
        // Permission.update(data,{where:{ID:data.ID}})
      console.log(data)
       const meetingList=await MeetingList.findAndCountAll({
      //   attributes:[
      //     'meetingID',            
      // ],
        // offset:data.offset,
        // limit:data.limit,       
        //  subQuery:false ,  //
        distinct:true,
        where:{
          meetingConvenDepID:data.meetingConvenDepID
        },
      
        include:[{
          required:false,
          model:MeetingSubject,
          as:'M_Sub',
          include:[   
              
            {
              required:false,
              model:Dep,
              as:'M_Dep'
            },     
          {
            required:false,
            model:attachs,
            as:'M_atta'
          },
          {
            required:false,
            model:MeetingUsers,
            as:'M_Users',            
           
            include:[{
              model:userPhone,
              as:'users',            
            },
            {
              model:CustomGroup,
              as:'Group'
            }
        ]
          }        
        ],       
        }],
        order:[    
          ['meetingID','DESC'],   
          [Sequelize.col('M_Sub->M_Users.orderID'), 'DESC'],
          [Sequelize.col('M_Sub.meetingSubjectID'), 'ASC']
          // [MeetingSubject, MeetingUsers, 'orderID', 'DESC']
          // order:[[Player, PlayerLevel, 'level', DESC]]
          // ['M_Sub->M_Users','orderID', 'DESC'],
          // ['MeetingUsers.orderID','DESC']
          //  [Sequelize.col(MeetingUsers.orderID), 'DESC']  
          // [Sequelize.col('[M_Sub->M_Users].[orderID]'), 'DESC']  
          // [Sequelize.col('M_Sub->M_Users.orderID'), 'DESC']  
          // ['M_Sub->M_Users.orderID','DESC']
          // ['M_Users.orderID', 'DESC']  
          // [Sequelize.col('Perinformation.Deps.DepartmentId'), 'DESC']
          // [Sequelize.col('Perinformation->Deps.Priority'), 'DESC']
          ],
          // raw:true
      })
      resolve(meetingList)
      } catch (error) { 
        reject(error)       
      }
    })
  }
  static async selectMeetingbyMeetingID(data)
  {
    return new Promise(async (resolve,reject)=>{
      try {
        // Permission.update(data,{where:{ID:data.ID}})
       const meetingList=await MeetingList.findAndCount({
      //   attributes:[
      //     'meetingID',            
      // ],
        distinct:true,
        where:{
          meetingID:data.meetingID
        },
        include:[{
          model:MeetingSubject,
          as:'M_Sub',
          include:[{
            model:attachs,
            as:'M_atta'
          },
          {
            model:MeetingUsers,
            as:'M_Users'
          }        
        ],
          // include:[{
          //   model:MeetingUsers,
          //   as:'M_Users'
          // }]
        }]
      })
      resolve(meetingList)
      } catch (error) { 
        reject(error)       
      }
    })
    
  }

  // {
  //   "result": {
  //     "count": 3,
  //     "rows": [{
  //       "meetingID": 1,
  //       "M_Sub": [{
  //         "meetingSubjectID": 1,
  //         "meetingSubjectName": "议题1",
  //         "meetingID": 1,
  //         "meetingSubjectDepID": 12,
  //         "startTime": null,
  //         "endTime": null,
  //         "isReport": true,
  //         "M_Users": [{
  //           "meetingPersonID": 1,
  //           "meetingPersonType": "出席人",
  //           "meetingSubjectID": 1,
  //           "meetingUserID": 112,
  //           "meetingPersonGroupID": 1,
  //           "orderID": 1
  //         }, {
  //           "meetingPersonID": 2,
  //           "meetingPersonType": "列席人",
  //           "meetingSubjectID": 1,
  //           "meetingUserID": 113,
  //           "meetingPersonGroupID": 2,
  //           "orderID": null
  //         }]
  //       }, {
  //         "meetingSubjectID": 2,
  //         "meetingSubjectName": "议题2",
  //         "meetingID": 1,
  //         "meetingSubjectDepID": 13,
  //         "startTime": null,
  //         "endTime": null,
  //         "isReport": true,
  //         "M_Users": []
  //       }]
  //     }]
  //   }
  // }
   /**
 * 创建角色权限表
 * 
 */
// static async dbasync()
// {
//     AdminRole.sync({force: false}).then(function () {
//     // 已创建数据表    
//     console.log('已经创建表！')
//     return true
//     // return User.create({
//     //   firstName: 'John',
//     //   lastName: 'Hancock'
//     // });
//   }).catch(err)
//   {
//       console.log(err)
//       return false
//   };
// }
//  /**
//    * 给管理员添加权限
//    * @param user
//    * @returns {Promise.<boolean>}
//    */
//   static async createAdminRoles (ctx) {
//     await AdminRole.create({
//       'RoleID': ctx.RoleID,
//       'AdminID': ctx.AdminID
//     })
//     return true
//   }

 

}
module.exports = MeetingModel