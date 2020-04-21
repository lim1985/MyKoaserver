const db = require('../config/db')
const gov = db.gov
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')
const ResferenceUserPhoneAndDEP = gov.import('../schema/LIM_ResferenceAndDep.js')
const Sequelize = require('sequelize');
// const Area = gov.import('../schema/LIM_Area')
const Op = Sequelize.Op
const Deps = gov.import('../schema/LIM_Department')
// const ReferenceDEPUserPhones = gov.import('../schema/LIM_ResferenceAndDep.js')
Deps.belongsToMany(UsersPhone, {through: ResferenceUserPhoneAndDEP, as:'ResferecDep',sourceKey:'DepartmentId', foreignKey: 'DepID'})
//,order:[ ['OrderID', 'DESC'],]
UsersPhone.belongsToMany(Deps, {through: ResferenceUserPhoneAndDEP, as:'ResferecDep' ,sourceKey:'ID', foreignKey: 'UserPhoneID'})
//Area.hasMany(Permission,{foreignKey:'areakey',sourceKey:'areakey',as:'Permission'});//area和Permission 表 1对多
// UsersPhone.hasMany(ResferenceUserPhoneAndDEP,{foreignKey:'UserPhoneID',sourceKey:'ID'});//area和Permission 表 1对多

// UsersPhone.hasOne(ResferenceUserPhoneAndDEP)

// gov.sync().then(function(result){
//   console.log('部门和列表成员同步完成')
//   //   // 同步了'Role'、'UserRole'、'UserRole'三个模型
//   })

class UsersPhoneModel {
 static async ChageUsersToQita(data){

      return new Promise(async(resolve,resject)=>{
         if(data)
         {
          //  let isExict=UsersPhone.findAll(data).then(res=>{
          //    return res
          //  })
            let isExict=await UsersPhone.findAndCountAll({
               where:{
                 ID:data.ID,
                 Department_ID:163,
                 Permission_Key:'QT'
               }
            })
            console.log(isExict)
            if(isExict.count==0)
            {
               UsersPhone.update({Department_ID:163,Permission_Key:'QT',ID:data.ID},{
               where:{
               ID:data.ID
             }
           }).then(res=>{
             if(res)
             {
              ResferenceUserPhoneAndDEP.update({DepID:163}, {
                where: {
                  UserPhoneID: data.ID,
                  status:-1
                }
              }).then(isOK=>{
                resolve(isOK)
              })
             }
           })
         }
         else
         {
           resolve(
             {
               code:-1,
               msg:'不可删除该栏目中的联系人'
             }
           )
         }
          //  resolve(isExict)      
         }
         else
         {
           resject()
         }
      })
 }


  static async SortUserByDepID(data)//根据用户部门ID 进行排序
  {
    return new Promise((resolve,resject)=>{
      if(!data)
      {
        let result={
          code:-1          
        }
        resolve(result);
      }
      else
      {
       ResferenceUserPhoneAndDEP.update(data, {
         where: {
           ID: data.ID
         }
       }).then(res=>{       
        resolve(res)
       })
      }
    })
    
      
  }
   /**
   * 查询一个用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
//   static async findUserByAminID (AdminID) {
//     const userInfo = await Admin.findOne({
//       where: {
//         AdminID
//       }
//     })
//     return userInfo
//   }
/**
 * 查询部门用户按部门ID查找,加入被引用的用户
 * @param {depid} s 
 * @returns {Promise.<*>}
 */
static async GetAllPhoneUserReferencUserByDepID(s)
{

 let sql=`SELECT   LIM_ResferenceAndDep.status AS Rstatus, LIM_UsersPhone.ID, LIM_UsersPhone.UserName, LIM_UsersPhone.Tel, 
 LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, 
 LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, 
 LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, 
 LIM_UsersPhone.inTime, LIM_UsersPhone.status AS Ustatus, LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, 
 LIM_UsersPhone.Py_Index, LIM_Department_1.DepartmentName, 
 LIM_Department_1.Permission_Key AS Permissionkey, LIM_ResferenceAndDep.ID AS ResID
 FROM      LIM_UsersPhone INNER JOIN
 LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
 LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
 LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
WHERE   (LIM_Department.DepartmentId = ${s.depid})
ORDER BY Ustatus desc, LIM_ResferenceAndDep.OrderID DESC OFFSET ${s.offset} ROW FETCH NEXT ${s.limit} rows only` 
//offset limit:



//  `SELECT  LIM_ResferenceAndDep.status AS Rstatus, LIM_UsersPhone.ID, LIM_UsersPhone.UserName, LIM_UsersPhone.Tel, 
//  LIM_UsersPhone.H_Tel, LIM_UsersPhone.cellphone, LIM_UsersPhone.H_cellphone, LIM_UsersPhone.QQ, 
//  LIM_UsersPhone.avatar, LIM_UsersPhone.BirthDay, LIM_UsersPhone.Type, LIM_UsersPhone.OrderID, 
//  LIM_UsersPhone.Sex, LIM_UsersPhone.GroupID, LIM_UsersPhone.Department_ID, LIM_UsersPhone.Permission_Key, 
//  LIM_UsersPhone.inTime, LIM_UsersPhone.status AS Ustatus, LIM_UsersPhone.UJOB, LIM_UsersPhone.Email, 
//  LIM_UsersPhone.Py_Index, LIM_Department_1.DepartmentName, 
//  LIM_Department_1.Permission_Key AS Permissionkey
// FROM      LIM_UsersPhone INNER JOIN
//  LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
//  LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
//  LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
// WHERE   (LIM_Department.DepartmentId = ${s.depid})`
let count =`SELECT  count(*) AS [count]
FROM      LIM_UsersPhone INNER JOIN
                LIM_ResferenceAndDep ON LIM_UsersPhone.ID = LIM_ResferenceAndDep.UserPhoneID INNER JOIN
                LIM_Department ON LIM_ResferenceAndDep.DepID = LIM_Department.DepartmentId INNER JOIN
                LIM_Department AS LIM_Department_1 ON LIM_UsersPhone.Department_ID = LIM_Department_1.DepartmentId
WHERE   (LIM_Department.DepartmentId =${s.depid})`
return new Promise(async(resolve)=>{
  let res={}
  res.rows=await gov.query(sql,{type: gov.QueryTypes.SELECT})
  let c=await gov.query(count,{type: gov.QueryTypes.SELECT})
  res.count=c[0].count
  resolve(res)
}).then(r=>{
  console.log('返回数据成功！')

  console.log(r)
  return r
  
})
  

  // let count=` SELECT count([LIM_Department].[DepartmentId]) AS [count] FROM [LIM_Department] AS [LIM_Department]`
  //   let sql=`SELECT   LIM_Permission.ID, LIM_Permission.RoleID, LIM_Permission.Permission_Key, LIM_Permission.Permission_name, 
  //   LIM_Permission.description, LIM_Permission.optioncode, LIM_Permission.OrderID, LIM_Department.DepartmentId, 
  //   LIM_Department.DepartmentName, LIM_Department.Abbreviation, LIM_Department.UploadDir, 
  //   LIM_Department.ParentDepartmentId, LIM_Department.Priority FROM LIM_Department LEFT OUTER JOIN LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_Key ORDER BY LIM_Department.DepartmentId desc`
  //   return new Promise(async(resolve,reject)=>{
  //       let res={}
  //          res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT})
  //       let c=await gov.query(count,{type : gov.QueryTypes.SELECT})
  //       console.log(c[0].count)
  //          res.count=c[0].count
  //       console.log(res)
  //   resolve(res)
  // })
      //  const PhoneUserReferencUserList=await UsersPhone.findAndCountAll(
      //    {
      //      where:{          
      //        Department_ID:s.depid
      //      },
      //      order:[
      //        ['OrderID', 'DESC'],],
      //    }
      //  )
      //  return PhoneUserReferencUserList
}

/**
 * 查询部门用户按部门查找
 * @param {depid} s 
 * @returns {Promise.<*>}
 */
static async GetPhoneUserByDepID(s)
{
       const PhoneUserList=await UsersPhone.findAndCountAll(
         {
           where:{          
             Department_ID:s.depid
           },
           order:[
             ['OrderID', 'DESC'],],
         }
       )
       return PhoneUserList
}
 
static async GetUserPhoneByDepID(s)
{
    let sql=`SELECT [LIM_Department].[Abbreviation], [LIM_Department].[DepartmentId], [LIM_Department].[Permission_Key], [LIM_Department].[Priority],
    [LIM_Department].[UploadDir], [Users].[Email], [Users].[QQ],
   [Users].[status], [Users].[UserName], [Users].[UJOB], [Users].[Tel], [Users].[OrderID], [Users].[ID], [Users].[cellphone],
    [Users->LIM_ResferenceAndDep].[ID] AS [Users.LIM_ResferenceAndDep.ID], [Users->LIM_ResferenceAndDep].[OrderID] AS
     [Users.LIM_ResferenceAndDep.OrderID], [Users->LIM_ResferenceAndDep].[DepID] AS [Users.LIM_ResferenceAndDep.DepID],
      [Users->LIM_ResferenceAndDep].[status] AS [Users.LIM_ResferenceAndDep.status], [Users->LIM_ResferenceAndDep].
      [UserPhoneID] AS [Users.LIM_ResferenceAndDep.UserPhoneID] FROM [LIM_Department] AS [LIM_Department] INNER JOIN 
      ( [LIM_ResferenceAndDep] AS [Users->LIM_ResferenceAndDep] INNER JOIN [LIM_UsersPhone] AS [Users] ON [Users].[ID] =
       [Users->LIM_ResferenceAndDep].[UserPhoneID]) ON [LIM_Department].[DepartmentId] = [Users->LIM_ResferenceAndDep].
     [DepID] AND [Users].[status] = 9 WHERE [LIM_Department].[DepartmentId] = ${s.DepID}
   ORDER BY [Users.LIM_ResferenceAndDep.OrderID] DESC`
  
    let count=`SELECT  count(*) AS [count] FROM [LIM_Department] AS [LIM_Department] INNER JOIN 
     ( [LIM_ResferenceAndDep] AS [Users->LIM_ResferenceAndDep] INNER JOIN [LIM_UsersPhone] AS [Users] ON [Users].[ID] =
      [Users->LIM_ResferenceAndDep].[UserPhoneID]) ON [LIM_Department].[DepartmentId] = [Users->LIM_ResferenceAndDep].
    [DepID] AND [Users].[status] = 9 WHERE [LIM_Department].[DepartmentId] = ${s.DepID}`
 
   return new Promise(async(resolve)=>{
    let res={}
    res.rows=await gov.query(sql,{type: gov.QueryTypes.SELECT})
    let c=await gov.query(count,{type: gov.QueryTypes.SELECT})
    res.count=c[0].count
    resolve(res)
  }).then(r=>{
    console.log('返回数据成功！')
  
    console.log(r)
    return r
    
  })
}

/**由于排序无法实现，暂停使用该方法
 * 查询部门用户
 * @param {key ,depid} s 
 * @returns {Promise.<*>}
 */
 static async GetPhoneUserByDepIDAndPermissionKey(s)
 { 
  
        const PhoneUserList=await Deps.findAndCountAll({
          as:'deps',
          // order:[
          //     [{model: UsersPhone,as:'Users'},{model: ResferenceUserPhoneAndDEP,as:'ResferecDep'}, 'OrderID', 'DESC']
          // ],
          // order: 'Users->Depres].[OrderID]'
          //   // Will escape title and validate DESC against a list of valid direction parameters
          //   ['Users->LIM_ResferenceAndDep', 'OrderID', 'DESC'],
          //   // [{model: ResferenceUserPhoneAndDEP, as: 'resDep'}, 'OrderID', 'DESC'],
          // ['Users','deps','OrderID', 'Desc'],
          // [UsersPhone.associations.ResferenceUserPhoneAndDEP,  'OrderID', 'DESC'],
          //  [{model: UsersPhone,as:'Users'},{model: ResferenceUserPhoneAndDEP,as:'resdep'}, 'OrderID', 'DESC']//,{model: ResferenceUserPhoneAndDEP}
          //  [{model: ResferenceUserPhoneAndDEP},  'OrderID', 'DESC']
            //  [Deps.associations.UsersPhone, 'OrderID', 'DESC'],
          // [Deps.associations.ResferenceUserPhoneAndDEP, 'OrderID', 'DESC'],
      
         
          //可以用
          attributes:['Abbreviation',
                      'DepartmentId',
                      'Permission_Key',
                      'Priority',
                      'UploadDir',
                      Sequelize.col('Users.Email'),//内容
                      Sequelize.col('Users.QQ'),//内容
                      Sequelize.col('Users.status'),//内容
                      Sequelize.col('Users.UserName'),//内容
                      Sequelize.col('Users.UJOB'),//内容
                      Sequelize.col('Users.Tel'),//内容
                      Sequelize.col('Users.OrderID'),//内容
                      Sequelize.col('Users.ID'),//内容
                      Sequelize.col('Users.cellphone'),//内容                      
                    ],
          where:{
            DepartmentId:s.DepID
          },          
         
          include:[{
            model:UsersPhone, 
            // through: {
            //   attributes: [],
          
            // }, 
            as:'Users',
            where:{
              status:9
            },          
            attributes:[],          
          }
         ], 
           raw:true  
        })
        return PhoneUserList    
        //可以用end   
 }
 /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async NewfindUserByTelorPhoneNum (s) {
    const userInfo = await UsersPhone.findOne({      
      as:'Users',
       raw: true,
      attributes:[
            'Email',
            'QQ',
            'status',
            'UserName',
            'UJOB',
            'Tel',
            'OrderID',
            'ID',
            'cellphone',
            'H_Tel',
            // Sequelize.col('ResferecDep.Abbreviation'),//内容
            // Sequelize.col('ResferecDep.Abbreviation'),//内容                       
    ],
      where: {
        [Op.or]: [
           { H_Tel : s.tel },
           { Tel : s.tel },
           { cellphone : s.tel },
           { H_cellphone: s.tel }
        ],      
     },
     include:[
      {      
        model:Deps,
        as:'ResferecDep',
        through: {
          where:{
            status:-1
          },
          attributes:[]        
        }, 
    attributes:[
       'Abbreviation',
       'DepartmentName'
    ], 
   }
    ]
    })
    return userInfo
  }
  /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserByPhoneNum (s) {
    const userInfo = await UsersPhone.findOne({      
      as:'Users',
      raw: true,
      attributes:[
            'Email',
            'QQ',
            'status',
            'UserName',
            'UJOB',
            'Tel',
            'OrderID',
            'ID',
            'cellphone',
            // Sequelize.col('ResferecDep.Abbreviation'),//内容                       
    ],
      where: {
        [Op.or]: [
           { cellphone : s.tel },
           { H_cellphone: s.tel }
        ],      
     },
     include:[
      {
        model:Deps,
        as:'ResferecDep',
       through: {
              
    }, 
    attributes:[
      'Abbreviation'
    ], 
      }
    ]
    })
    return userInfo
  }
   /**
   * 查询用户信息
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async findUserByusername (s) {
    const userInfo = await UsersPhone.findOne({
      where:         
           {
              UserName : s.username 
            },
    })
    return userInfo
  }
   /**
   * 查询用户信息
   * @param name  模糊姓名
   * @returns {Promise.<*>}
   */
  static async findUserByusernamelike (s) {
    const userInfo = await UsersPhone.findAndCountAll({    
      as:'Users',
      raw: true,
  
      attributes:[     // 'Abbreviation',
                      // 'DepartmentId',
                      // 'Permission_Key',
                      // 'Priority',
                      // 'UploadDir',
                      'Email',
                      'QQ',
                      'Sex',
                      'status',
                      'UserName',
                      'UJOB',
                      'Tel',
                      'OrderID',
                      'ID',
                      'cellphone',
                       Sequelize.col('ResferecDep.Abbreviation'),//内容
                      // Sequelize.col('ResferecDep.DepartmentId'),//内容
                       Sequelize.col('ResferecDep.Permission_Key'),//内容
                      // Sequelize.col('ResferecDep.Priority'),//内容
                      // Sequelize.col('ResferecDep.UploadDir'),//内容                                      
                    ],
      where:         
           {
              // UserName : s.username 
              UserName: {
                // 模糊查询
                [Op.like]:'%' +s.username  + '%'
              }
            },
            include:[
              {
                model:Deps,
                as:'ResferecDep',
                  through: {
                  where:{
                    status:-1
                  }          
                }, 
              attributes:[], 
              }
            ],
          
          
    })
    return userInfo
  }
   /**
   * 查询用户信息
   * @param name  模糊姓名
   * @returns {Promise.<*>}
   */
  static async findUserByusernameAndDepIDlike (s) {
    const userInfo = await UsersPhone.findAndCountAll({    
      as:'Users',
      raw: true,   
      attributes:[
                      // 'Abbreviation',
                      // 'DepartmentId',
                      // 'Permission_Key',
                      // 'Priority',
                      // 'UploadDir',
                      'Email',
                      'QQ',
                      'Sex',
                      'status',
                      'UserName',
                      'UJOB',
                      'Tel',
                      'OrderID',
                      'ID',
                      'cellphone',
                       Sequelize.col('ResferecDep.Abbreviation'),//内容
                      // Sequelize.col('ResferecDep.DepartmentId'),//内容
                       Sequelize.col('ResferecDep.Permission_Key'),//内容
                      // Sequelize.col('ResferecDep.Priority'),//内容
                      // Sequelize.col('ResferecDep.UploadDir'),//内容                                      
                    ],
      where:         
           {
              // UserName : s.username 
              UserName: {
                // 模糊查询
                [Op.like]:'%' +s.username  + '%',           
              },
              Department_ID:s.DepID
            },
            include:[
              {
                model:Deps,
                as:'ResferecDep',
                  through: {
                  where:{
                    status:-1
                  }          
                }, 
              attributes:[], 
              }
            ]
    })
    return userInfo
  }
    /**
   * 查询用户信息
   * @param name  用户ID
   * @returns {Promise.<*>}
   */
  static async findUserInformationByID (s) {
    const userInfo = await UsersPhone.findOne({
      where: {
          ID:s.ID
     },
    })
    return userInfo
  }
  /**
   * 查询用户信息
   * @param DepID  部门ID
   * @returns {Promise.<*>}
   */
  static async findUsersByPhoneAndDepID (s) {
      let resCount=s.length;
      let _Err=[] 
  
      return new Promise((resolve)=>{
          s.forEach(async v=>{
            UsersPhone.findOne({
                      where:{
                        Department_ID:v.Department_ID,
                        cellphone:v.cellphone
                      }
            }).then(res=>{ 
                  _Err.push(res)
                  resCount--  
                  if(resCount==0)
                    {
                     resolve(_Err);
                    }                                          
              })
          })
      })
   
    //  return new Promise((resolve)=>{
    //     s.forEach(async v => {          
    //      const userlist= await UsersPhone.findOne({
    //         where:{
    //           Department_ID:v.Department_ID,
    //           cellphone:v.cellphone
    //         }
    //       })
    //       resolve(userlist);
    //     });
       
    //  })
     
    // const userInfo = await UsersPhone.findOne({
    //   where: {
    //     Department_ID:s.Department_ID
    //  },
    // })
    // return userInfo
  }
   /**
   * 查询用户信息
   * @param cellphone  联系人电话号码
   * @returns {Promise.<*>}
   */
  static async findUserInformationBycellphone (s) {
    return new Promise((resolve)=>{
      s.forEach(async v => {          
       const userlist= await UsersPhone.findOne({
          where:{
            cellphone:v.cellphone
          }
        })
        resolve(userlist);
      });
     
   })
    // const userInfo = await UsersPhone.findOne({
    //   where: {
    //     cellphone:s.cellphone
    //  },
    // })
    // return userInfo
  }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async allUserPhone () {
    
    const UsersPhonelist = await UsersPhone.findAndCountAll(
      {     
        order:[
        ['ID', 'DESC'],],       
      }
          //{ offset: 0, limit: 10 },
     )
    return UsersPhonelist
  }
 /**
   * 获得所有用户列表
   * @param name  姓名
   * @returns {Promise.<*>}
   */
  static async GetallUserPhoneByPermissionKey (s) {
    console.log(`key的值是`)
    console.log(s.key)
    const UsersPhonelist = await UsersPhone.findAndCountAll(
      {
        where:{
          Permission_Key:s.key
        },
        order:[
        ['ID', 'DESC'],],
       
      })
          //{ offset: 0, limit: 10 },     
    return UsersPhonelist
  }
  /**
   * 信件通信录用户信息
   * @param user
   * @returns {Promise.<boolean>}
   */
  static async InertUserPhones (s) {
    var timestamp = Math.round(new Date().getTime()/1000).toString();
    // let mydata=new Date(parseInt(1554110850) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');  
    // console.log(mydata)
    await UsersPhone.create({
      'UserName': s.UserName,
      'Department_ID': s.DepKeylist[1],
      'Permission_Key':s.DepKeylist[0],
      'UJOB': s.UJOB,
      'Tel': s.tel,
      'H_Tel': s.htel,
      'cellphone': s.cellphone,
      'H_cellphone': s.hc,
      'QQ': s.qq,
      'avatar': s.avatar,
      'inTime':timestamp,
      'BirthDay': s.bhd,
      'Type': s.type,
      'OrderID': s.orderid,
      'Sex': s.Sex,
      'status': s.status,
      'Email':'',
      'Py_Index':s.Py_Index,
      'beizhu':s.beizhu   
    }).then(res=>{    
        let s={
          ID:res.ID,
          DepID:res.Department_ID         
        }
      return s    
    }).then(res=>{
      ResferenceUserPhoneAndDEP.create({
       'UserPhoneID':res.ID,
       'DepID':res.DepID,
       'status':-1,
       'OrderID':99
      })      
    })
    return true
  }
  /**
   * 根据用户ID 删除主表用户，并且删除关联表里的数据
   * @params data
   * @return {Promise.<boolean>}   
   */
  static async DeleteUserPhoneByID(data)
  {
    return new Promise((resolve,reject)=>{
      try {
         UsersPhone.destroy({
          where:{
            ID:data.ID,
            Department_ID:data.Department_ID
          }
        }).then(()=>{
         ResferenceUserPhoneAndDEP.destroy({
            where:{
              UserPhoneID:data.ID,
              DepID:data.Department_ID
            }
          })
        }).then(()=>{
          resolve(true)
        })
      } catch (error) {
          reject(error)
      }
    })
  }
  static async import_InertUserPhones(data){
    var timestamp = Math.round(new Date().getTime()/1000).toString();
    // {UserPhoneID:_this.ReferenceUserId,DepID:_this.mdl[1]}
     let IsRefere=data.RefereStatus
     if(IsRefere==-1)
     {
      await UsersPhone.create({
        'UserName': data.UserName,
        'Department_ID': data.Department_ID,
        'Permission_Key':data.Permission_Key,
        'UJOB': data.UJOB,    
        'cellphone': data.cellphone,     
        'inTime':timestamp,     
        'Sex': data.Sex,
        'status': data.status,     
        'Py_Index':data.Py_Index,       
      }).then(res=>{    
          let s={
            ID:res.ID,
            DepID:res.Department_ID              
          }
        return s    
      }).then(res=>{
        ResferenceUserPhoneAndDEP.create({
         'UserPhoneID':res.ID,
         'DepID':res.DepID,
         'status':data.RefereStatus
        })      
      })
     }
     else
     {
      ResferenceUserPhoneAndDEP.create({
        'UserPhoneID':data.ID,
        'DepID': data.Department_ID,
        'status':data.RefereStatus
       }) 
     }

    
    return true
  }

  /**
   * 
   * @param {data} data 
   * 批量插入联系人
   * 从excle表导入的数据
   */
  static async importUsersListfromExcle(data)  {       
  
    return new Promise((resolve,reject)=>{
          try {
            let dataCount=data.length
            let _arr=[]
            data.forEach(v => {
              UsersPhoneModel.import_InertUserPhones(v).then(res=>{
                dataCount--
                _arr.push(res)
                if(dataCount==0)
                {
                  resolve(_arr);
                }
              })
         });

            // UsersPhone.bulkCreate(data).then(res=>{
            //  return res   
            // }).then(r=>{     
            //   let res={
            //     data,
            //     r
            //   }         
            //   resolve(res);
            // })                
          } catch (error) {
              reject(error);
          }
    })
  }
   
   /**
   * 修改用户信息
   * @param data
   * @returns {Promise.<boolean>}
   */
  static async UpdateUserPhonebyID (data) {
      return new Promise((resolve,reject)=>{
        try{      
          UsersPhone.update(data,{where:{ID:data.ID}}).then(res=>{//先修改主表
            console.log(res);
            return res
          }).then(res=>{
            if(res)
            {
              console.log(data)
              ResferenceUserPhoneAndDEP.update({DepID:data.Department_ID},{//再修改关联表
                where:{
                  UserPhoneID:data.ID,
                  status:-1
                }
              })
            }
          })
          resolve()
        }catch(error)
        {
          reject(error)
        }
      })
  }
}

module.exports = UsersPhoneModel
