const db = require('../config/db')
const gov = db.gov
const Admin = gov.import('../schema/PE_Admin.js')
const AdminLogin = gov.import('../schema/LIM_Admin_Login.js')

Admin.hasOne(AdminLogin,{ foreignKey: 'AdminID' })

// const LIM_Roles = gov.import('../schema/LIM_Roles.js')
// const LIM_Reference_AdminRoles = gov.import('../schema/LIM_Reference_AdminRoles.js')
// const Area = gov.import('../schema/LIM_Area')
// const Permission = gov.import('../schema/LIM_Permission')
// Admin.belongsToMany(LIM_Roles, {  as: 'Roles', through: LIM_Reference_AdminRoles,sourceKey:'AdminID', foreignKey: 'UUID' })
// LIM_Roles.belongsToMany(Admin, {  as: 'Admin',through: LIM_Reference_AdminRoles ,sourceKey:'ID', foreignKey: 'roleid'})
// LIM_Roles.hasMany(Area,{sourceKey:'roleid',foreignKey:'RoleID'})

// Deps.belongsToMany(UsersPhone, {through: ResferenceUserPhoneAndDEP,sourceKey:'DepartmentId', foreignKey: 'DepID' })
// UsersPhone.belongsToMany(Deps, {through: ResferenceUserPhoneAndDEP ,sourceKey:'ID', foreignKey: 'UserPhoneID'})

// Deps.belongsToMany(UserPhone, {  as: 'Users', through: DEPUsers,sourceKey:'DepartmentId', foreignKey: 'DepID' })
// UserPhone.belongsToMany(Deps, {  as: 'Deps',through: DEPUsers ,sourceKey:'ID', foreignKey: 'UserPhoneID'})


class AdminModel {
  static async findAdminByIDcard(userinfo)
  {
     return new Promise ((resolve,resject)=>{
       Admin.findOne({
         include:[
           {
             model:AdminLogin, 
             where:{
              IDCard:userinfo.certificateNum
             }
           }
         ]
       }).then(res=>{
         !res?resolve({
           Isadmin:false,
           res
         }):resolve({
           Isadmin:true,
           res
         })
            
       })
      
     })
  }
   static async findAdminByPhone(phone)
   {
      return new Promise ((resolve,resject)=>{
        Admin.findOne({
          include:[
            {
              model:AdminLogin, 
              where:{
                Phone:phone.mobile
              }
            }
          ]
        }).then(res=>{
          !res?resolve({
            Isadmin:false,
            res
          }):resolve({
            Isadmin:true,
            res
          })
          // if(res)
          // {
          //   resolve(true)
          // }         
        })
       
      })
   }
   /**
    * 
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
