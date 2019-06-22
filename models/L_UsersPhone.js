const db = require('../config/db')
const gov = db.gov
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')
const ResferenceUserPhoneAndDEP = gov.import('../schema/LIM_ResferenceAndDep.js')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Deps = gov.import('../schema/LIM_Department')
const ReferenceDEPUserPhones = gov.import('../schema/LIM_ResferenceAndDep.js')
Deps.belongsToMany(UsersPhone, {through: ResferenceUserPhoneAndDEP,sourceKey:'DepartmentId', foreignKey: 'DepID' })
UsersPhone.belongsToMany(Deps, {through: ResferenceUserPhoneAndDEP ,sourceKey:'ID', foreignKey: 'UserPhoneID'})
gov.sync().then(function(result){
  console.log('同步完成')
  //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
  })

class UsersPhoneModel {

   /**
   * 查询一个用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
//   static async findUserByAminID (AdminID) {
//     const userInfo = await Admin.findOne({
//       where: {
//         AdminID
//       }
//     })
//     return userInfo
//   }
/**
 * 查询部门用户按部门ID查找,加入被引用的用户
 * @param {depid} s 
 * @returns {Promise.<*>}
 */
static async GetAllPhoneUserReferencUserByDepID(s)
{
      
  let sql= `SELECT LIM_ResferenceAndDep.status AS Rstatus, LIM_UsersPhone.ID, LIM_UsersPhone.UserName, LIM_UsersPhone.Tel, 
LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, 
LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, 
LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, 
LIM_UsersPhone.inTime, LIM_UsersPhone.status AS Ustatus, LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, 
LIM_UsersPhone.Py_Index, LIM_Department_1.DepartmentName, 
LIM_Department_1.Permission_Key AS Permissionkey
FROM      LIM_UsersPhone INNER JOIN
LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
WHERE   (LIM_Department.DepartmentId = ${s.depid}) ORDER BY LIM_UsersPhone.OrderID DESC`

//  `SELECT  LIM_ResferenceAndDep.status AS Rstatus, LIM_UsersPhone.ID, LIM_UsersPhone.UserName, LIM_UsersPhone.Tel, 
//  LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, 
//  LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, 
//  LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, 
//  LIM_UsersPhone.inTime, LIM_UsersPhone.status AS Ustatus, LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, 
//  LIM_UsersPhone.Py_Index, LIM_Department_1.DepartmentName, 
//  LIM_Department_1.Permission_Key AS Permissionkey
// FROM      LIM_UsersPhone INNER JOIN
//  LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
//  LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
//  LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
// WHERE   (LIM_Department.DepartmentId = ${s.depid})`
let count =`SELECT  count(*) AS [count]
FROM      LIM_UsersPhone INNER JOIN
                LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
                LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
                LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
WHERE   (LIM_Department.DepartmentId =${s.depid})`
return new Promise(async(resolve)=>{
  let res={}
  res.rows=await gov.query(sql,{type: gov.QueryTypes.SELECT})
  let c=await gov.query(count,{type: gov.QueryTypes.SELECT})
  res.count=c[0].count
  resolve(res)
}).then(r=>{
  console.log('返回数据成功！')

  console.log(r)
  return r
  
})
  

  // let count=` SELECT count([LIM_Department].[DepartmentId]) AS [count] FROM [LIM_Department] AS [LIM_Department]`
  //   let sql=`SELECT   LIM_Permission.ID, LIM_Permission.RoleID, LIM_Permission.Permission_Key, LIM_Permission.Permission_name, 
  //   LIM_Permission.description, LIM_Permission.optioncode, LIM_Permission.OrderID, LIM_Department.DepartmentId, 
  //   LIM_Department.DepartmentName, LIM_Department.Abbreviation, LIM_Department.UploadDir, 
  //   LIM_Department.ParentDepartmentId, LIM_Department.Priority FROM LIM_Department LEFT OUTER JOIN LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_Key ORDER BY LIM_Department.DepartmentId desc`
  //   return new Promise(async(resolve,reject)=>{
  //       let res={}
  //          res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT})
  //       let c=await gov.query(count,{type : gov.QueryTypes.SELECT})
  //       console.log(c[0].count)
  //          res.count=c[0].count
  //       console.log(res)
  //   resolve(res)
  // })


      //  const PhoneUserReferencUserList=await UsersPhone.findAndCountAll(
      //    {
      //      where:{          
      //        Department_ID:s.depid
      //      },
      //      order:[
      //        ['OrderID', 'DESC'],],
      //    }
      //  )
      //  return PhoneUserReferencUserList
}
/**
 * 查询部门用户按部门查找
 * @param {depid} s 
 * @returns {Promise.<*>}
 */
static async GetPhoneUserByDepID(s)
{
       const PhoneUserList=await UsersPhone.findAndCountAll(
         {
           where:{          
             Department_ID:s.depid
           },
           order:[
             ['OrderID', 'DESC'],],
         }
       )
       return PhoneUserList
}


/**
 * 查询部门用户
 * @param {key ,depid} s 
 * @returns {Promise.<*>}
 */
 static async GetPhoneUserByDepIDAndPermissionKey(s)
 { 
  
        const PhoneUserList=await Deps.findAndCountAll({
          attributes:['Abbreviation',
                      'DepartmentId',
                      'Permission_Key',
                      'Priority',
                      'UploadDir',
                      Sequelize.col('Users.Email'),//内容
                      Sequelize.col('Users.QQ'),//内容
                      Sequelize.col('Users.status'),//内容
                      Sequelize.col('Users.UserName'),//内容
                      Sequelize.col('Users.UJOB'),//内容
                      Sequelize.col('Users.Tel'),//内容
                      Sequelize.col('Users.OrderID'),//内容
                      Sequelize.col('Users.ID'),//内容
                      Sequelize.col('Users.cellphone'),//内容
                    ],
          where:{
            DepartmentId:s.DepID
          },
          include:[{
            model:UsersPhone,  
            as:'Users',
            attributes:[], 
            through: {
            
              where: {status:-1}
            }
          }
         ], 
           raw:true  
        })
        return PhoneUserList       
 }
  /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserByPhoneNum (s) {
    const userInfo = await UsersPhone.findOne({
      where: {
        [Op.or]: [
           { cellphone : s.tel },
           { H_cellphone: s.tel }
        ],
     },
    })
    return userInfo
  }
    /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserInformationByID (s) {
    const userInfo = await UsersPhone.findOne({
      where: {
          ID:s.ID
     },
    })
    return userInfo
  }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async allUserPhone () {
    
    const UsersPhonelist = await UsersPhone.findAndCountAll(
      {     
        order:[
        ['ID', 'DESC'],],       
      }
          //{ offset: 0, limit: 10 },
     )
    return UsersPhonelist
  }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async GetallUserPhoneByPermissionKey (s) {
    console.log(`key的值是`)
    console.log(s.key)
    const UsersPhonelist = await UsersPhone.findAndCountAll(
      {
        where:{
          Permission_Key:s.key
        },
        order:[
        ['ID', 'DESC'],],
       
      }
          //{ offset: 0, limit: 10 },
     )
    return UsersPhonelist
  }
  /**
   * 信件通信录用户信息
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async InertUserPhones (s) {
    var timestamp = Math.round(new Date().getTime()/1000).toString();
    // let mydata=new Date(parseInt(1554110850) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');  
    // console.log(mydata)
    await UsersPhone.create({
      'UserName': s.UserName,
      'Department_ID': s.DepKeylist[1],
      'Permission_Key':s.DepKeylist[0],
      'UJOB': s.UJOB,
      'Tel': s.tel,
      'H_Tel': s.htel,
      'cellphone': s.cellphone,
      'H_cellphone': s.hc,
      'QQ': s.qq,
      'avatar': s.avatar,
      'inTime':timestamp,
      'BirthDay': s.bhd,
      'Type': s.type,
      'OrderID': s.orderid,
      'Sex': s.Sex,
      'status': 9,
      'Email':'',
      'Py_Index':s.Py_Index      
    }).then(res=>{    
        let s={
          ID:res.ID,
          DepID:res.Department_ID         
        }
      return s    
    }).then(res=>{
      ResferenceUserPhoneAndDEP.create({
       'UserPhoneID':res.ID,
       'DepID':res.DepID,
       'status':-1
      })      
    })
    return true
  }
  /**
   * 根据用户ID 删除主表用户，并且删除关联表里的数据
   * @params data
   * @return {Promise.<boolean>}   
   */
  static async DeleteUserPhoneByID(data)
  {
    return new Promise((resolve,reject)=>{
      try {
         UsersPhone.destroy({
          where:{
            ID:data.ID,
            Department_ID:data.Department_ID
          }
        }).then(()=>{
         ResferenceUserPhoneAndDEP.destroy({
            where:{
              UserPhoneID:data.ID,
              DepID:data.Department_ID
            }
          })
        }).then(()=>{
          resolve(true)
        })
      } catch (error) {
          reject(error)
      }
    })
  }
  
   
   /**
   * 修改用户信息
   * @param data
   * @returns {Promise.<boolean>}
   */
  static async UpdateUserPhonebyID (data) {
      return new Promise((resolve,reject)=>{
        try{      
          UsersPhone.update(data,{where:{ID:data.ID}}).then(res=>{//先修改主表
            console.log(res);
            return res
          }).then(res=>{
            if(res)
            {
              console.log(data)
              ResferenceUserPhoneAndDEP.update({DepID:data.Department_ID},{//再修改关联表
                where:{
                  UserPhoneID:data.ID
                }
              })
            }
          })
          resolve()
        }catch(error)
        {
          reject(error)
        }
      })
  }
}

module.exports = UsersPhoneModel
