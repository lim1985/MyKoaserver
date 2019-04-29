const db = require('../config/db')
const gov = db.gov
const Admin = gov.import('../schema/PE_Admin.js')


class AdminModel {

   /**
   * 查询一个用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserByAminID (AdminID) {
    const userInfo = await Admin.findOne({
      where: {
        AdminID
      }
    })
    return userInfo
  }
  /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserByName (AdminName) {
    const userInfo = await Admin.findOne({
      where: {
        AdminName
      }
    })
    return userInfo
  }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async GetallAdmin (ctx) {
    const Adminlist = await Admin.findAndCountAll(ctx,
          //{ offset: 0, limit: 10 },
       {
        order:Admin.AdminName
       })
    return Adminlist
  }
  /**
   * 创建用户
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async createUser (user) {
    await Admin.create({
      'name': user.name,
      'password': user.password
    })
    return true
  }
   /**
   * 修改用户角色
   * @param data
   * @returns {Promise.<boolean>}
   */
  static async UpdataAdminRolesbyID (data) {
      return new Promise((resolve,reject)=>{
        try{
          Admin.update(data,{where:{AdminID:data.ID}}).then(res=>{
            resolve(res)
          })
        }catch(error)
        {
          reject(error)
        }
      })
  }



}

module.exports = AdminModel
