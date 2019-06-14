const db = require('../config/db')
const gov = db.gov
const Area = gov.import('../schema/LIM_AreaName.js')



class AreaModel {
   /**
 * 创建角色权限表
 * 
 */
static async dbasync()
{
  
}
 /**
   * 给管理员添加权限
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async createAdminRoles (ctx) {
    await AdminRole.create({
      'RoleID': ctx.RoleID,
      'AdminID': ctx.AdminID
    })
    return true
  }

 

}
module.exports = AreaModel