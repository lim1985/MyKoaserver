const db = require('../config/db')
const gov = db.gov
const ReferenceUserPhones = gov.import('../schema/LIM_ReferenceUserPhones.js')//停用
const ReferenceDEPUserPhones = gov.import('../schema/LIM_ResferenceAndDep.js')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
// const DEP = gov.import('../schema/LIM_Department.js')
// DEP.belongsTo(Perinformation, { foreignKey: 'DepartmentId', targetKey: 'DepID', as: 'DepInformation' });
class ReferenceUserModel {

   /**
   * 查询一个用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async FindReferencesUserByDepIDUserPhoneID (s) {
    const ReferenceInfo = await ReferenceDEPUserPhones.findOne({

      attributes:['DepID','UserPhoneID'],
      where: {
        DepID:s.DepID,
        UserPhoneID:s.UserPhoneID
      }
    })
    return ReferenceInfo
  }

  /**
   * 
   * @param {DepID,UserPhoneID} s 
  */
  static async Delete(s)
  {
    const res = await ReferenceDEPUserPhones.destroy({
      where :{
        DepID:s.Department_ID,
        UserPhoneID:s.ID,
        status:6
      }
    }).then(r=>{
      console.log(r)
      return r
     
    }).catch(err=>{

      console.log(err)
      return err
    })
   return res
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
