const db = require('../config/db')
const gov = db.gov
const AdminRole = gov.import('../schema/LIM_AdminRole.js')



class AdminRoleModel {
   /**
 * 创建角色权限表
 * 
 */
static async dbasync()
{
    AdminRole.sync({force: false}).then(function () {
    // 已创建数据表    
    console.log('已经创建表！')
    return true
    // return User.create({
    //   firstName: 'John',
    //   lastName: 'Hancock'
    // });
  }).catch(err)
  {
      console.log(err)
      return false
  };
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
module.exports = AdminRoleModel