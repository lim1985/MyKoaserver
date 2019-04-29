const db = require('../config/db')
const gov = db.gov
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')


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
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
//   static async findUserByName (AdminName) {
//     const userInfo = await Admin.findOne({
//       where: {
//         AdminName
//       }
//     })
//     return userInfo
//   }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async GetallUserPhone (s) {
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
      
    })
    return true
  }
   /**
   * 修改用户角色
   * @param data
   * @returns {Promise.<boolean>}
   */
//   static async UpdataAdminRolesbyID (data) {
//       return new Promise((resolve,reject)=>{
//         try{
//           Admin.update(data,{where:{AdminID:data.ID}}).then(res=>{
//             resolve(res)
//           })
//         }catch(error)
//         {
//           reject(error)
//         }
//       })
//   }



}

module.exports = UsersPhoneModel
