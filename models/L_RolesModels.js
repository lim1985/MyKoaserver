const db = require('../config/db')
// const Sequelize = require('sequelize');
const gov = db.gov
const Roles = gov.import('../schema/LIM_Roles.js')
const Area = gov.import('../schema/LIM_Area.js')
const Permission = gov.import('../schema/LIM_Permission.js')
const Reference_RolesPermission = gov.import('../schema/LIM_Reference_RolesPermission.js')
const Reference_RolesArea = gov.import('../schema/LIM_Reference_RolesArea.js')
const DEP = gov.import('../schema/LIM_Department.js')
const Category = gov.import('../schema/LIM_Category.js')

// const Tarea = gov.import('../schema/T_Area.js')

// var Category = require('../schema/LIM_Category.js');
const Reference_RolesDeps = gov.import('../schema/LIM_Reference_RolesDeps.js')
Area.belongsToMany(Roles, {as:'R', through: Reference_RolesArea,sourceKey:'ID', foreignKey: 'A_ID' })
Roles.belongsToMany(Area, {as:'Area', through: Reference_RolesArea ,sourceKey:'roleid', foreignKey: 'R_ID'})

Roles.belongsToMany(DEP, {as:'Dep', through: Reference_RolesDeps,sourceKey:'roleid', foreignKey: 'Role_ID' })
DEP.belongsToMany(Roles, {as:'Roles', through: Reference_RolesDeps ,sourceKey:'DepartmentId', foreignKey: 'Dep_ID'})

// Roles.belongsToMany(Permission, {  through: Reference_RolesPermission,sourceKey:'roleid', foreignKey: 'RoleID' })
// Permission.belongsToMany(Roles, {  through: Reference_RolesPermission ,sourceKey:'ID', foreignKey: 'PID'})
Area.hasMany(Permission,{foreignKey:'AreaID',sourceKey:'ID',as:'Permission'});//area和Permission 表 1对多
Permission.hasMany(DEP,{foreignKey:'PID',sourceKey:'ID',as:'Deps'});//area和Permission 表 1对多
DEP.hasMany(Category,{foreignKey:'DepID',sourceKey:'DepartmentId',as:'Nodes'});//area和Permission 表 1对多

// Area.hasMany(Admin,{foreignKey:'AdminID',sourceKey:'AdminID',as:'AD'});//Area和admin 表 1对多
// Roles.belongsToMany(Area, { as: 'Area', through: Reference_RolesArea,sourceKey:'ID', foreignKey: 'A_ID' })
// Area.belongsToMany(Roles, { as: 'Role',through: Reference_RolesArea ,sourceKey:'roleid', foreignKey: 'R_ID'})





// Area.hasOne(Permission,{foreignKey: 'areakey',sourceKey: 'areakey'});
// Permission.belongsTo(Area, {foreignKey: 'areakey',targetKey: 'areakey'});

// SysUser.hasOne(MonitorSetting,{foreignKey: 'uId',sourceKey: 'id'});
// MonitorSetting.belongsTo(SysUser, {foreignKey: 'uId',targetKey: 'id'});
// Deps.belongsToMany(UserPhone, {  as: 'Users', through: DEPUsers,sourceKey:'DepartmentId', foreignKey: 'DepID' })
// UserPhone.belongsToMany(Deps, {  as: 'Deps',through: DEPUsers ,sourceKey:'ID', foreignKey: 'UserPhoneID'})

// Category.sync({ alter: true }).then(r=>{
//   console.log(`0000000000000`)
//   console.log(r)
// });

// RoleID:{
// Perkey:{

// Admin.belongsToMany(LIM_Roles, {  as: 'Roles', through: LIM_Reference_AdminRoles,sourceKey:'AdminID', foreignKey: 'UUID' })
// LIM_Roles.belongsToMany(Admin, {  as: 'Admin',through: LIM_Reference_AdminRoles ,sourceKey:'ID', foreignKey: 'roleid'})


class RolesModel {

  static async InsertIntoCategory()
  {
    const res=await DEP.findAll({      
      attributes:['DepartmentId'],
    })
        let _arr=[]
        res.map(item=>{
          _arr.push({'CategoryName':'通讯录','DepID':item.DepartmentId},{'CategoryName':'自定义通讯录','DepID':item.DepartmentId})
          // return {'CategoryName':'通讯录','DepID':item.DepartmentId},{'CategoryName':'自定义通讯录','DepID':item.DepartmentId}
        })  
    let ress=   Category.bulkCreate(_arr,{        
          // ignoreDuplicates : true      
       }).then(res=>{
         return res
       })
    
    return ress 
  }
  static async newGetAllPermissionByRoleID(s)
  {
    const res= await Roles.findAll({
      attributes:['roleid',
      'rolekey',
      'rolevalue',
      'static',
      'addtime',
      'roledescription',     
      // Sequelize.col('Area.areaname'),//内容     
    ],
        where:{
          roleid:s.roleid
        },      
        include:[
          {
          model:Area,
          as:'Area',
            include:[{
              model:Permission,
              as:'Permission',
              // where:{
              //   RoleID:s.roleid
              // },
              include:[{
                model:DEP,
                as:'Deps',    
                include:[{
                  model:Category,
                  as:'Nodes'
                }]           
              }]
            }]
             
            // where:{
            //   R_ID:s.roleid,
            //   status:1
            // }
            // attributes:['R_ID'],
            // where: {completed: true}
     
          // include:[{            
          //     model:Permission,
            
          //     where:{
          //       RoleID:s.roleid
          //     }
          // }]
          // attributes:[
          //   Sequelize.col('LIM_Reference_RolesArea.R_ID')            
          // ]
          // include:[{
          //   model:Permission,
          //   as:'Permission',
            // include:[{
            //   model:DEP,
            //   as:'Deps',
            //   include:[{
            //     model:Category,
            //     as:'Nodes'

            //   }]
            // }]
          // }]
        }],
     
        //   through: {            
        //     attributes:['R_ID'],
        //     where: {completed: true}
        // }  
        // include:[
        //   {
        //     model:Permission,
        //     as:'Permission',    
        //     include:[{
        //       model:Area
        //     }]       
        //   }
        // ],
        // through: {            
          
        // }  
      //  where:{
      //    AdminID:s.AdminID
      //  },
      //  include:[{
      //    model:LIM_Roles,
      //    as:'Roles',
      //    where:{
      //      roleid:s.RoleID
      //    } ,         
      //    include:[{
      //        model:Permission
      //    }]
      //  }]
    })
  //  const deps=await RolesModel.InsertIntoCategory()
           
  //  let data={
  //    res:res,
  //    deps:deps
  //  }
    return res
  }

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
