const db = require('../config/db')
const gov = db.gov
const Sequelize = require('sequelize');
const CustomGroup = gov.import('../schema/LIM_CustomGroup')
const RefereceGroup = gov.import('../schema/LIM_RefereceGroup')
const Area = gov.import('../schema/LIM_Area')
const Admin = gov.import('../schema/PE_Admin')
const Permission = gov.import('../schema/LIM_Permission')
const Deps = gov.import('../schema/LIM_Department')
const UserPhone = gov.import('../schema/LIM_UsersPhone')
const GroupsUsers = gov.import('../schema/LIM_RefereceGroupAndUserPhone')
const DEPUsers = gov.import('../schema/LIM_ResferenceAndDep')

// User.belongsToMany(Project, {  as: 'Tasks', through: UserProjects, foreignKey: 'userId' })
// Project.belongsToMany(User, {  as: 'Workers',through: UserProjects ,foreignKey: 'projectId'})
// Post.belongsToMany(Tag, {
//   through: {
//       model: PostTag,
//       unique: false,
//   },
//   foreignKey: 'postId', //通过外键postId
//   constraints: false
// });
// Tag.belongsToMany(Post, {
//   through: {
//       model: PostTag,
//       unique: false,
//   },
//   foreignKey: 'tagId', //通过外键tagId
//   constraints: false
// });
//  CustomGroup.belongsToMany(UserPhone,{foreignKey:'GroupID',sourceKey: 'ID' })
//  UserPhone.belongsToMany(CustomGroup,{foreignKey:'',sourceKey: 'GroupID' })
// CustomGroup.belongsToMany(UserPhone, {  through:GroupsUsers ,foreignKey: 'UserPhoneID' })
// UserPhone.belongsToMany(CustomGroup, {  through:GroupsUsers ,foreignKey: 'GroupID'})

Area.hasMany(Admin,{foreignKey:'AdminID',sourceKey:'AdminID',as:'AD'});//Area和admin 表 1对多
Area.hasMany(Permission,{foreignKey:'areakey',sourceKey:'areakey',as:'Permission'});//area和Permission 表 1对多
Permission.hasMany(Deps,{foreignKey:'Permission_Key',sourceKey:'Permission_key',as:'DEP'});//Permission和 Deps 表 1对多
// Deps.hasMany(UserPhone,{foreignKey:'Department_ID',sourceKey:'DepartmentId',as:'Users'});

Deps.belongsToMany(UserPhone, {  as: 'Users', through: DEPUsers,sourceKey:'DepartmentId', foreignKey: 'DepID' })
UserPhone.belongsToMany(Deps, {  as: 'Deps',through: DEPUsers ,sourceKey:'ID', foreignKey: 'UserPhoneID'})


// gov.sync().then(function(result){
//   console.log('同步完成')
//   //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
//   })

// Area.hasMany(Admin, {as: 'admin'})
// DEP.belongsTo(Perinformation, { foreignKey: 'DepartmentId', targetKey: 'DepID', as: 'DepInformation' });
// Area.hasMany(Admin, { foreignKey: 'AdminID', targetKey: 'AdminID', as: 'admin' });
// Area.hasMany(Admin, {as: "admin"});  // 会在article数据中添加外键blogId
// Admin.belongsTo(Area);
// Area.hasMany(Admin,  {foreignKey: 'AdminID', targetKey: 'AdminID'});
// Admin.belongsTo(Area, {foreignKey: 'AdminID', targetKey: 'AdminID'});
// Area.hasMany(Permission, {as: 'permission'})
const Op = Sequelize.Op
// const DEP = gov.import('../schema/LIM_Department.js')
// DEP.belongsTo(Perinformation, { foreignKey: 'DepartmentId', targetKey: 'DepID', as: 'DepInformation' });
class ReferenceUserModel {
  static async FindAllUsersByGroupID(s)
  {
    
    const count= `SELECT count(*) as [count]
    FROM      LIM_CustomGroup INNER JOIN
                    LIM_RefereceGroupAndUserPhone ON 
                    LIM_CustomGroup.GroupID = LIM_RefereceGroupAndUserPhone.GroupID INNER JOIN
                    LIM_UsersPhone ON LIM_RefereceGroupAndUserPhone.UserPhoneID = LIM_UsersPhone.ID
    WHERE   (LIM_CustomGroup.GroupID ='${s.GroupID}')`

    // const sql=`SELECT   LIM_CustomGroup.GroupName, LIM_UsersPhone.UserName, LIM_UsersPhone.*, LIM_CustomGroup.GroupID
    // FROM      LIM_CustomGroup INNER JOIN
    //                 LIM_RefereceGroupAndUserPhone ON 
    //                 LIM_CustomGroup.GroupID = LIM_RefereceGroupAndUserPhone.GroupID INNER JOIN
    //                 LIM_UsersPhone ON LIM_RefereceGroupAndUserPhone.UserPhoneID = LIM_UsersPhone.ID
    // WHERE   (LIM_CustomGroup.GroupID ='${s.GroupID}')`
//     const sql=`SELECT   LIM_CustomGroup.GroupName, LIM_UsersPhone.UserName, LIM_UsersPhone.ID, 
//     LIM_UsersPhone.UserName AS Expr1, LIM_UsersPhone.Tel, LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, 
//     LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, 
//     LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, 
//     LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, LIM_UsersPhone.inTime, LIM_UsersPhone.status, 
//     LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, LIM_UsersPhone.Py_Index, LIM_CustomGroup.GroupID AS Expr2, 
//     LIM_Permission.Permission_name
// FROM      LIM_CustomGroup INNER JOIN
//     LIM_RefereceGroupAndUserPhone ON 
//     LIM_CustomGroup.GroupID = LIM_RefereceGroupAndUserPhone.GroupID INNER JOIN
//     LIM_UsersPhone ON LIM_RefereceGroupAndUserPhone.UserPhoneID = LIM_UsersPhone.ID INNER JOIN
//     LIM_Permission ON LIM_UsersPhone.Permission_Key = LIM_Permission.Permission_key
// WHERE   (LIM_CustomGroup.GroupID ='${s.GroupID}')`

const sql=`SELECT   LIM_CustomGroup.GroupName, LIM_UsersPhone.UserName, LIM_UsersPhone.ID, 
LIM_UsersPhone.UserName AS Expr1, LIM_UsersPhone.Tel, LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, 
LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, 
LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, 
LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, LIM_UsersPhone.inTime, LIM_UsersPhone.status, 
LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, LIM_UsersPhone.Py_Index, LIM_CustomGroup.GroupID, 
LIM_Department.DepartmentName, LIM_Department.DepartmentId
FROM      LIM_CustomGroup INNER JOIN
LIM_RefereceGroupAndUserPhone ON 
LIM_CustomGroup.GroupID = LIM_RefereceGroupAndUserPhone.GroupID INNER JOIN
LIM_UsersPhone ON LIM_RefereceGroupAndUserPhone.UserPhoneID = LIM_UsersPhone.ID INNER JOIN
LIM_Department ON LIM_UsersPhone.Department_ID = LIM_Department.DepartmentId
WHERE   (LIM_CustomGroup.GroupID ='${s.GroupID}')`

return new Promise(async(resolve,reject)=>{
let res={}
res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT})
let c=await gov.query(count,{type : gov.QueryTypes.SELECT})
console.log(c[0].count)
res.count=c[0].count
console.log(res)
resolve(res)
  })
  }
  static async DeleteGroupByGroupID(s)
  {
    await GroupsUsers.destroy({
      where:{
        GroupID:s.GroupID
      }
    })
    await CustomGroup.destroy({
      where:{
        GroupID:s.GroupID
      }
    })
    await RefereceGroup.destroy({
      where:{
        GroupID:s.GroupID
      }
    })
    return true
  }
  static async DeleteUserbyUID(s)
  {
     await GroupsUsers.destroy({
       where:{
        GroupID:s.GroupID,
        UserPhoneID:s.UserPhoneID
       }
     })
     return true
  }
  static async GetUserByGroupID(s)
  {
   const Users=await GroupsUsers.findAll({
      where: {
        GroupID:s.GroupID//string nvchar50
       //string nvchar50
      }
    })
    
    return Users
  }
      static async InitGroup(s)
    {
      
     return new Promise((resolve,reject)=>{        
       ReferenceUserModel.GetUserByGroupID(s).then(res=>{        
         return res.length
       }).then(count=>{
         console.log(count);
         if(count>=0)
         {
           try {
            GroupsUsers.destroy({
              where:{
                GroupID:s.GroupID
              }
            }).then(()=>{
                resolve(true)
            })
           } catch (error) {
             reject(error)
           }
         }
        //  if(count >= 0)
        //  {
        //    try{
        //     GroupsUsers.destroy({
        //       where:{
        //         GroupID:s.GroupID
        //       }        
        //     }).then(res=>{
        //       console.log(res)
        //       resolve(res)
        //     })
        //   }catch(error)
        //   {
        //     reject(error)
        //   }
        //  }
       })
      })  
      
    }
  static async addUsersToGroup(datalist)
  {
  
    return new Promise((resolve,reject)=>{
      console.log(datalist)
    try{
     
        GroupsUsers.bulkCreate(datalist, {        
      }).then((modelList) => {
        
        resolve(modelList);
          //这里也找不到可以表达实际入库数量的参数
      })
      }catch(error)
      {
        reject(error)
      }
    })
    
  }

  static async GetCustomGroupByDepID(s)
  {
  const count=`SELECT  count(*) AS [count] FROM LIM_Department INNER JOIN LIM_RefereceGroup ON LIM_Department.DepartmentId = LIM_RefereceGroup.DepID INNER JOIN
               LIM_CustomGroup ON LIM_RefereceGroup.GroupID = LIM_CustomGroup.GroupID
  WHERE   (LIM_Department.DepartmentId = ${s.DepID})`
  const sql=`SELECT LIM_Department.DepartmentId, LIM_RefereceGroup.GroupID, LIM_CustomGroup.GroupName, 
  LIM_Department.DepartmentName FROM LIM_Department INNER JOIN
  LIM_RefereceGroup ON LIM_Department.DepartmentId = LIM_RefereceGroup.DepID INNER JOIN
  LIM_CustomGroup ON LIM_RefereceGroup.GroupID = LIM_CustomGroup.GroupID
  WHERE (LIM_Department.DepartmentId = ${s.DepID})`
  
  return new Promise(async(resolve,reject)=>{
    let res={}
       res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT})
    let c=await gov.query(count,{type : gov.QueryTypes.SELECT})
    console.log(c[0].count)
       res.count=c[0].count
    console.log(res)

  //  let sql=`SELECT   LIM_Permission.*, LIM_Department.DepartmentId, LIM_Department.DepartmentName FROM LIM_Department INNER JOIN
  //  LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_key`
  //  let res =await gov.query(sql, {type : gov.QueryTypes.SELECT})
  //  resolve(res)
  //  console.log(res)

// console.log(data)
resolve(res)
})
}
static async GetAllAeraDepUserbyAdminID(s)
{
   const ss=await Area.findAll({  
    where:{
      AdminID:s.AdminID
    },     
    include:[{
      model:Permission,
      as:'Permission',
      include:[{
        model:Deps,
        as:'DEP',
        include:[{
          model:UserPhone,
          as:'Users',
          through: {
            
            where: {status:-1}
          }      
          // 'order': "OrderID DESC"          
        }]
      
      }]
    },
    {
      model:Admin,
      as:'AD'
    }], 
    // order:[[Sequelize.col('Permission.Deps.UserPhone.OrderID'), 'DESC']]
    
    // raw:true      
   })
   return ss
  // TArea.create({
  //   'AdminID':1,
  //   'areaname':'123123',
  //   'description':11,
  //   'areakey':222
  // }).then(res=>{
  //   console.log(res)
  // })
//   const sql=`SELECT PE_Admin.AdminName, LIM_Area.areakey, LIM_Permission.Permission_name, LIM_Permission.Permission_key, 
//   PE_Admin.AdminID, LIM_Department.DepartmentName, LIM_Department.UploadDir, LIM_Area.areaname,LIM_UsersPhone.UserName, LIM_UsersPhone.cellphone, LIM_UsersPhone.Sex, LIM_UsersPhone.UJOB, 
//   LIM_UsersPhone.status, LIM_Department.Priority, LIM_Permission.OrderID FROM LIM_Area INNER JOIN PE_Admin ON LIM_Area.AdminID = PE_Admin.AdminID INNER JOIN
//   LIM_Permission ON LIM_Area.areakey = LIM_Permission.areakey INNER JOIN LIM_Department ON LIM_Permission.Permission_key = LIM_Department.Permission_Key INNER JOIN
//   LIM_UsersPhone ON LIM_Department.DepartmentId = LIM_UsersPhone.Department_ID WHERE   (PE_Admin.AdminID = ${s.AdminID}) ORDER BY LIM_Permission.OrderID desc`
// return new Promise(async(resolve,reject)=>{
//   let res={}
//      res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT}) 
//      console.log(res)
//      resolve(res)
// })
}
   /**
   * 查询一个用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async FindReferencesGroupName (s) {
    const ReferenceGroupInfo = await CustomGroup.findOne({

      attributes:['GroupName','GroupID'],
      where: {
        GroupID:s.GroupID//string nvchar50
       //string nvchar50
      }
    })
    return ReferenceGroupInfo
  }
  static async CreateCustomGroup(s)
  {
    await CustomGroup.create({
      'GroupID': s.GroupID,
      'GroupName':s.GroupName     
    }).then(async res=>{
      if(res)
      {
        await RefereceGroup.create({
          'DepID':s.DepID,
          'GroupID':s.GroupID
        }).then(res=>{
          console.log(res)
        })
      }
    })
    return true
  }

  static async CreateRefereceGroup(s)
  {
    await RefereceGroup.create({
      'DepID': s.DepID,
      'GroupID':s.GroupID     
    })
    return true
  }
/**
 * 查询部门用户按部门查找
 * @param {depid} s 
 * @returns {Promise.<*>}
 */
// static async GetPhoneUserByDepID(s)
// {
//        const PhoneUserList=await UsersPhone.findAndCountAll(
//          {
//            where:{          
//              Department_ID:s.depid
//            },
//            order:[
//              ['OrderID', 'DESC'],],
//          }
//        )
//        return PhoneUserList
// }


// /**
//  * 查询部门用户
//  * @param {key ,depid} s 
//  * @returns {Promise.<*>}
//  */
//  static async GetPhoneUserByDepIDAndPermissionKey(s)
//  { 
//   //  key: 'QXZ_XT', DepID: 74, status: 9 },
//         const PhoneUserList=await UsersPhone.findAndCountAll(
//           {
//             where:{
//               Permission_Key:s.key,
//               Department_ID:s.DepID,
//               status:s.status
//             },
//             order:[
//               ['OrderID', 'DESC'],],
//           }
//         )
//         return PhoneUserList
//  }
//   /**
//    * 查询用户信息
//    * @param name  姓名
//    * @returns {Promise.<*>}
//    */
//   static async findUserByPhoneNum (s) {
//     const userInfo = await UsersPhone.findOne({
//       where: {
//         [Op.or]: [
//            { cellphone : s.tel },
//            { H_cellphone: s.tel }
//         ],
//      },
//     })
//     return userInfo
//   }
//     /**
//    * 查询用户信息
//    * @param name  姓名
//    * @returns {Promise.<*>}
//    */
//   static async findUserInformationByID (s) {
//     const userInfo = await UsersPhone.findOne({
//       where: {
//           ID:s.ID
//      },
//     })
//     return userInfo
//   }
//  /**
//    * 获得所有用户列表
//    * @param name  姓名
//    * @returns {Promise.<*>}
//    */
//   static async allUserPhone () {
    
//     const UsersPhonelist = await UsersPhone.findAndCountAll(
//       {     
//         order:[
//         ['ID', 'DESC'],],       
//       }
//           //{ offset: 0, limit: 10 },
//      )
//     return UsersPhonelist
//   }
//  /**
//    * 获得所有用户列表
//    * @param name  姓名
//    * @returns {Promise.<*>}
//    */
//   static async GetallUserPhoneByPermissionKey (s) {
//     console.log(`key的值是`)
//     console.log(s.key)
//     const UsersPhonelist = await UsersPhone.findAndCountAll(
//       {
//         where:{
//           Permission_Key:s.key
//         },
//         order:[
//         ['ID', 'DESC'],],
       
//       }
//           //{ offset: 0, limit: 10 },
//      )
//     return UsersPhonelist
//   }
//   /**
//    * 信件通信录用户信息
//    * @param user
//    * @returns {Promise.<boolean>}
//    */
  static async InertIntoReference (s) {
    // var timestamp = Math.round(new Date().getTime()/1000).toString();
    // let mydata=new Date(parseInt(1554110850) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');  
    // console.log(mydata)
    await ReferenceDEPUserPhones.create({
      'DepID': s.DepID,
      'status':6,//被引用状态
      'UserPhoneID':s.UserPhoneID      
    })
    return true
  }

//    /**
//    * 修改用户信息
//    * @param data
//    * @returns {Promise.<boolean>}
//    */
//   static async UpdateUserPhonebyID (data) {
//       return new Promise((resolve,reject)=>{
//         try{
//           UsersPhone.update(data,{where:{ID:data.ID}}).then(res=>{
//             resolve(res)
//           })
//         }catch(error)
//         {
//           reject(error)
//         }
//       })
//   }
}

module.exports = ReferenceUserModel
