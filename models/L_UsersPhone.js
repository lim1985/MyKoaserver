const db = require('../config/db')
const gov = db.gov
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

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
        const PhoneUserList=await UsersPhone.findAndCountAll(
          {
            where:{
              Permission_Key:s.key,
              Department_ID:s.depid,
              status:s.status
            },
            order:[
              ['OrderID', 'DESC'],],
          }
        )
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
      'Email':''
      
    })
    return true
  }

   /**
   * 修改用户信息
   * @param data
   * @returns {Promise.<boolean>}
   */
  static async UpdateUserPhonebyID (data) {
      return new Promise((resolve,reject)=>{
        try{
          UsersPhone.update(data,{where:{ID:data.ID}}).then(res=>{
            resolve(res)
          })
        }catch(error)
        {
          reject(error)
        }
      })
  }
}

module.exports = UsersPhoneModel
