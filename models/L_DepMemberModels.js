const db = require('../config/db')
const gov = db.gov
const DepMember = gov.import('../schema/LIM_Department_Members.js')


class DepMemberModel {

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
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async GetDepmemberByAdminID (s) {
    console.log('model'+s)
    const Depmemberinfo = await DepMember.findAndCountAll({
      attributes: ['AdminId','DepartmentId','Permission_key','EnableViewer','EnableEditer'],
      where:{
        AdminId:s
      },
      order:[
      ['AdminId', 'DESC'],],
     
    })
    return Depmemberinfo
  }
  /**
   * 创建用户
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async create (s) {
    await DepMember.create({
      'AdminId': s.ID,
      'DepartmentId': s.DepID,
      'Permission_key': s.Permission_key,
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

module.exports = DepMemberModel
