const db = require('../config/db')
const gov = db.gov
const Roles = gov.import('../schema/LIM_Roles.js')

class RolesModel {
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
 * 添加角色
 * 
 */
static async dbasync()
{
  
  const flag= Roles.sync({force: false})
        console.log(typeof(flag))
 if (flag)
 {return true}
 else
 {return false}
//  await Roles.sync({force: false})
//  return true
//   Roles.sync({force: false}).then(res=>{
//    return true
//  }) 
}
/**
 * 
 * @param {ctx} rolevalue 查找角色by角色标识
 */
static async findroleByRoleName (rolevalue) {
  const roleInfo = await Roles.findOne({
    where: {
      rolevalue
    }
  })
  return roleInfo
}
/**
 * 
 * @param {ctx} roleid 查找角色by角色ID
 */
static async findroleByRoleid (roleid) {
  const roleInfo = await Roles.findOne({
    where: {
      roleid
    }
  })
  return roleInfo
}


  /**
   * 新建角色
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async createRoles (data) {
    await Roles.create({
      'rolekey':data.rolekey,
      'rolevalue':data.rolevalue,
      'roledescription':data.roledescription

    })
    return true
  }
   /**
   * 修改角色
   * @param role
   * @returns {Promise.<boolean>}
   */
  static async updateRoles (role) {
    await Roles.create({
      'RoleValue': role.RoleValue,
      'RoleDescription': role.Description
    })
    return true
  }
     /**
   * 给角色添加控制权限
   * @param role
   * @returns {Promise.<boolean>}
   */
  static async updateRolesPermission (data) {
    return  new Promise((resove,reject)=>{
      try {
        Roles.update(data,{where:{roleid:data.roleid}}).then(res=>{
          resove(res)
        }).catch(err=>{
          reject(err)
        })
      } catch (error) {
        reject(error)
        
      }
    }
    )
  }
   /**
   * 删除角色
   * @param role
   * @returns {Promise.<boolean>}
   */
  static async delRoles (role) {
    return  new Promise((resove,reject)=>{
      try {     
        Roles.destroy({where:{roleid:role}}).then(res=>
          {
            console.log(res)
            resove(res)
          }).catch(function(reject)
          {
            console.log(reject)
            return reject()
          })
      } catch (error) {
        reject(error)
      }
    })
  //  const flag=false
  //   await Roles.destroy({where:{
  //     roleid:role
  //   }})//where是指定查询条件
  //       .then(res=>{
  //         flag=true
  //        return flag
  //       })//删除成功的回调
  //       .catch(e =>{
  //        return flag
  //       });
  
  }
    /**
   * 查询所有角色
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async findRoles(ctx) {
  const roleslist=  await Roles.findAndCountAll(
    ctx,
    //{ offset: 0, limit: 10 },
     {
      order:Roles.addtime
     }
    )
    return roleslist
  }
}

module.exports = RolesModel
