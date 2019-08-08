const db = require('../config/db')
const gov = db.gov
const Permission = gov.import('../schema/LIM_Permission.js')
const Perinformation = gov.import('../schema/LIM_PermissionInformation.js')
const Area = gov.import('../schema/LIM_Area')
const AdminUser = gov.import('../schema/PE_Admin')
const Deps = gov.import('../schema/LIM_Department')
const roles = gov.import('../schema/LIM_Roles')
const Sequelize = require('sequelize');
Permission.hasMany(Perinformation,{foreignKey:'PermissionKey',sourceKey:'Permission_key',as:'Perinformation'})
// Camera.hasMany(Car,{
//   foreignKey:'cameraId',sourceKey:'id', as: 'Cars'
// })
// Area.hasMany(AdminUser,{foreignKey:'AdminID',sourceKey:'AdminID'})
// AdminUser.belongsTo(Area,{foreignKey:'AdminID',sourceKey:'AdminID'})
Area.hasMany(Permission,{foreignKey:'areakey',sourceKey:'areakey',as:'Permissions'})
Permission.hasMany(Deps,{foreignKey:'Permission_Key',sourceKey:'Permission_key',as:'DEPS'})
// Deps.hasOne(Perinformation,{foreignKey:'DepID',targetKey:'DepartmentId'})
// gov.sync().then(function(result){
//   console.log('区域和角色 一对多，权限和部门一对多')
//   //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
//   })
// MonitorSetting.belongsTo(SysUser, {foreignKey: 'uId',targetKey: 'id'});
// Perinformation.hasOne(Deps,{foreignKey:'DepartmentId',sourceKey:'DepID'})
// Perinformation.hasMany(Deps,{foreignKey:'DepartmentId',sourceKey:'DepID'})
//  Deps.belongsTo(Permission,{foreignKey:'Permission_key',sourceKey:'Permission_Key'})
class PermissionModel {
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




static async GetAreaPermissionAllbyAdminID(s){
 const result=await Area.findAll({
    where:{
      AdminID:s.AdminID
    },
    include: [{
      model:Permission,
      as:'Permissions',
      include:[{
        model:Deps,
        as:'DEPS'
        // include:[{
        //   model:Perinformation
        // }]
      }]
    }]
  });
  return result
}


static async dbasync()
{
  
  const flag= Permission.sync({force: false})
     
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
 * @param {ctx} param 
 */
static async findIDByPermissionName (key) {

  return  new Promise((resolve,reject)=>{
    try {     
      Permission.findOne({
        where: {
            Permission_key:key
        }
      }).then(res=>{
        resolve(res)

      }).catch(function(reject)
        {
          console.log(reject)
          return reject()
        })
    } catch (error) {
      reject(error)
    }
  })
 

}

  /**
   * 新添加权限
   * @param userdata
   * @returns {Promise.<boolean>}
   */
  static async createPermission (data) {
  let res=  await Permission.create({
      'Permission_name': data.Permissionvalue,
      'description': data.description,
      'Permission_key':data.Permissionskey,
      'OrderID':data.OrderID,
      'areakey':data.areakey

    }).then(r=>{
      return r

    })
    return res
  }
   /**
   * 修改角色
   * @param role
   * @returns {Promise.<boolean>}
   */
  static async updatePermission(data)
  {
    return  new Promise((resove,reject)=>{
        try {     
            Permission.update(data,{where:{ID:data.ID}}).then(res=>
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
  }
  //测试的api
  static async newselectPermissionByroleid(data)
  {
        let roleid=data
        return new Promise((resolve)=>{
          try {
            Permission.findAndCount({             
              attributes:[
                'ID',
                'OrderID',
                 Sequelize.col('Perinformation.RoleID'),
                 Sequelize.col('Perinformation.PermissionKey'),
                 Sequelize.col('Perinformation.IsParent'),
                 Sequelize.col('Perinformation.IsView'),
                 Sequelize.col('Perinformation.IsEdit'),
                 Sequelize.col('Perinformation.DepID'),
            ],
              // where:{
              //   IsParent:1,
              //   RoleID:roleid
              // },
              include:[{
                where:{
                  IsParent:1,
                  RoleID:roleid
                },  
                  attributes:[],
                            
                  model:Perinformation,                 
                  as:'Perinformation',
                  required: false   
              }],              
                order:[
                  ['OrderID', 'DESC'],],
                  raw:true              
            })
            // Permission.findAll({
            //    order:[
            //       ['OrderID', 'DESC'],],
            //       attributes:['Permission_key'],
            //       include:[{
            //        model:Perinformation
            //       }],
            // Perinformation.findAll({
            //  attributes:['PermissionKey'],
            //   include:[{
            //     model:Permission,
            //     // attributes:['RoleID','PermissionKey','IsParent','IsView','IsEdit','DepID'],
            //     attributes:[],
            //     order:[
            //         ['OrderID', 'DESC'],],
            //     required: true,
            //   }],
            //   where:{
            //     RoleID:roleid,
            //     IsParent:1   
            //   },
                // include:[{
                //   model:Perinformation,
                //   where:{
                //     attributes:['RoleID','PermissionKey','IsParent','IsView','IsEdit','DepID'],
                //     RoleID:roleid,
                //     IsParent:1   
                //   },
                //   required:true
                // }],               
                // order:[
                //   ['OrderID', 'DESC'],],
             // })
              .then(res=>{

                console.log(res);
                resolve(res);
              })            
          } catch (error) {
            
          }
        })
  }
  //测试的api
/**
 * 根据传进来的roleid 获取 详细权限信息
 * @param {*} data 
 */
static async SelectByRoleID(data)
{
    let roleid=data
  
    return new Promise((resolve,reject)=>{
      try { 
            //Permission
            // let include=[{
            //   //,{foreignKey:'Permission_key',sourceKey:'PermissionKey'}
            //   association:Permission.belongsTo(Perinformation,{foreignKey:'PermissionKey',sourceKey:'Permission_key'}),
            //       order:[
            //       ['OrderID', 'DESC'],],
            //     // required: false              
            // }]
            Permission.findAll({             
              attributes:[
                'ID',
                 Sequelize.col('Perinformation.RoleID'),
                 Sequelize.col('Perinformation.PermissionKey'),
                 Sequelize.col('Perinformation.IsParent'),
                 Sequelize.col('Perinformation.IsView'),
                 Sequelize.col('Perinformation.IsEdit'),
                 Sequelize.col('Perinformation.DepID'),
            ],
              // where:{
              //   IsParent:1,
              //   RoleID:roleid
              // },
              include:[{
                where:{
                  IsParent:1,
                  RoleID:roleid
                },  
                  attributes:[],                            
                  model:Perinformation,                 
                  as:'Perinformation',
                  required: false   
              }],              
                order:[
                  ['OrderID', 'DESC'],],
                  raw:true              
            })
            .then(res=>{
              resolve(res)
            }).catch(function(reject)
            {           
              return reject()
            })
        } catch (error) {
      reject(error)
     }
    })
}


      static async AddPermissionInformationByRoleids(data)
      {       
        return new Promise((resolve,reject)=>{
              try {
                Perinformation.bulkCreate(data).then(res=>{
                  resolve(res)    
                })                
              } catch (error) {
                  reject(error);
              }
        })
      }

  /**
   * 判断是否存在roleid就修改，否则就insert    * 
   * @param {* } data 
   * 
   */
  static async UpdataPermissionInFormationByRoleID(data)
  {
      return new Promise((resolve,reject)=>{
        try {
            
            let ID=data.ID
            let _arr=data.PremissionValue             
            let _tempArr=[]     
        
            /////////////      
            _arr.forEach(v=> {    
              console.log(v.actionOptions)        
              //  console.log(v.actionOptions && v.actionOptions.length )
             if(v.actionOptions)
             {                            
               v.actionOptions.forEach(A=>{
                var childrenValue = {
                  RoleID:ID,
                  PermissionKey:A.Permission_Key,
                  IsParent: false,                
                  IsView:A.IsView,
                  IsEdit:A.IsEdit,
                  DepID:A.DepartmentId
              　};
              _tempArr.push(childrenValue)
               })
             }           
              var value = {
                RoleID:ID,
                PermissionKey:v.value,
                IsParent:true,
                IsView:v.IsView,
                IsEdit:v.IsEdit
            　};
              _tempArr.push(value)
         });
        ///////////
            // console.log(_tempArr)
                  // array.forEach(b => {                    
                  // });
                  // 根据传上来的ROLEID 搜索结果，获得总数，然后进行判断，如果count为0 说明该角色下并没有权限内容，即用批量插入功能写入
                  // 否则 先删除原有的该roleid的所有数据，再将新值插入到库
                  Perinformation.findAndCountAll({
                    attributes:['PermissionKey','RoleID'],
                    where: {
                      RoleID: ID                   
                    }
                  }).then( res=>{
                    let count=res.count                   
                    if(count<=0){
                     Perinformation.bulkCreate(_tempArr).then(res=>{
                      resolve(res)    
                     })                                    
                    }
                    else
                    {
                      // console.log(res.count)
                    Perinformation.destroy({limit:count,
                        where:{
                          RoleID: ID   
                        }
                      }).then(res=>{
                        if(res>1)
                        {
                          Perinformation.bulkCreate(_tempArr).then(res=>{
                            resolve(res)    
                           })     
                        }                    
                      })
                    }                   
                  })               
        } catch (error) {
          reject(error)
        }
      })
     
  }
//   static async updatePermission (data) {
//     await Permission.update(data,{
//       'Permission_name': data.Permissionvalue,
//       'Permission_key': data.Permissionskey,     
//       'description': data.description
//     },
//      where:{ID:data.ID}  )
//     return true
//   }
   /**
   * 删除角色
   * @param role
   * @returns {Promise.<boolean>}
   */
        static async delPermission (data) {
          return  new Promise((resove,reject)=>{
            try {     
              Permission.destroy({where:{ID:data.ID}}).then(res=>
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
        }

        static async DelPerinformation(data)
        {
          return new Promise((resolve,reject)=>{
            try {       
              console.log(data);
              for(let x in data)
              {
                Perinformation.destroy(
                  {
                    where:{
                      IsParent:data[x].IsParent,
                      RoleID:data[x].roleid,
                      PermissionKey:data[x].key                      
                    }
                  })
              }     
              resolve(data);       
            } catch (error) {
              reject(error);
            }

          })
        
         
          
        }
    /**
   * 查询所有角色
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async findPermiss(ctx) {
    let Permissionlist="";
    if(!ctx.status)
    {
      Permissionlist =  await Permission.findAndCountAll(  
        {    
         // where:{
         //   status:1
         // },
         order:Permission.addtime
        })
    }
    else
    {
      Permissionlist =  await Permission.findAndCountAll(  
        {    
         where:{
           status:ctx.status
         },
         order:Permission.addtime
        })
    }
  
    return Permissionlist
  }
}

module.exports = PermissionModel
