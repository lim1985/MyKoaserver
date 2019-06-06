const db = require('../config/db')
const gov = db.gov
const Permission = gov.import('../schema/LIM_Permission.js')
const Perinformation = gov.import('../schema/LIM_PermissionInformation.js')


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
    await Permission.create({
      'Permission_name': data.Permissionvalue,
      'description': data.description,
      'Permission_key':data.Permissionskey
    })
    return true
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
/**
 * 根据传进来的roleid 获取 详细权限信息
 * @param {*} data 
 */
static async SelectByRoleID(data)
{
    let roleid=data
  
    return new Promise((resolve,reject)=>
    {
      try { 
            Perinformation.findAll({
              attributes:['RoleID','PermissionKey','IsParent','IsView','IsEdit','DepID'],
              where:{
                RoleID:roleid,
                IsParent:1            
              }
            }).then(res=>{
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
            _arr.forEach(v=> {    
              console.log(v.actionOptions)        
              //  console.log(v.actionOptions && v.actionOptions.length )
             if(v.actionOptions.length>0)
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
            // console.log(_tempArr)
                  // array.forEach(b => {                    
                  // });
                  //根据传上来的ROLEID 搜索结果，获得总数，然后进行判断，如果count为0 说明该角色下并没有权限内容，即用批量插入功能写入
                  //否则 先删除原有的该roleid的所有数据，再将新值插入到库
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
                      console.log(res.count)
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
        Permission.destroy({where:{ID:data}}).then(res=>
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
    /**
   * 查询所有角色
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async findPermiss(ctx) {
  const Permissionlist=  await Permission.findAndCountAll(
    ctx,
    //{ offset: 0, limit: 10 },
     
     {    
      order:Permission.addtime
     }
    )
    return Permissionlist
  }
}

module.exports = PermissionModel
