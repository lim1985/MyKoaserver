const db = require('../config/db')
const gov = db.gov
const DEP = gov.import('../schema/LIM_Department.js')
const UsersPhone = gov.import('../schema/LIM_UsersPhone.js')
const Perinformation = gov.import('../schema/LIM_PermissionInformation.js')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
DEP.belongsTo(Perinformation, { foreignKey: 'DepartmentId', targetKey: 'DepID', as: 'DepInformation' });
class DepartmentModel {


 /**
  * like 模糊查找部门 
  * @param string
  * @return {Promise.<Array>}
  * 
  */
    static async getListByDepNameLike(data)
    {
    return new Promise((resolve,reject)=>{
      try {
        DEP.findAll({
          raw: true,
          limit: 10,
           order: [
               ['Priority', 'DESC']
           ],  // 排序
           where: {
             // name: 'cheny', // 精确查询
             [Op.and]:{
              status:1
             },
             [Op.or]:[
              {  
                 DepartmentName: {
                // 模糊查询
                [Op.like]:'%' +data + '%'
              }
            },
            {  
               Abbreviation: {
              // 模糊查询
              [Op.like]:'%' +data + '%'
            }
          }
             ],          
           },
          //  attributes:['id','name'] // 控制查询字段
         }).then(res=>{
           resolve(res)
         })
      } catch (error) {
        reject(error)
      }
    })      
    }


   /**
   * 删除部门
   * @param role
   * @returns {Promise.<boolean>}
   */
  static async PostDel (data) {
    return  new Promise((resolve,reject)=>{
        try {
        //   UsersPhone.findAndCount({where:{DepartmentId:data.DepartmentId}})
        //   .then(Users=>{
        //           console.log(Users)
        //           resolve(Users)
        //   })
        // } 
        UsersPhone.findAndCount({
          where:{
            Department_ID:data.DepartmentId
          }
        }).then(Users=>{
          console.log(Users)
          if(Users.count>=1)//部门下存在联系人
          {
            resolve(-2)
          }
          else
          {

         DEP.destroy({where:{DepartmentId:data.DepartmentId}}).then(res=>{//先删除部门表里的
            return res 
          }).then(IsDelDep=>{
            if(IsDelDep)
            {
              Perinformation.findAll({
                      where:{
                        DepID:data.DepartmentId
                      }
              })
              .then(infos=>{
                if(JSON.stringify(infos)=='[]')
                  {
                      resolve(true)
                  }
                  else
                  {
                    Perinformation.destroy({
                              where:{
                                DepID:data.DepartmentId
                              }
                            })
                      .then(IsDelInfo=>{
                          if(IsDelInfo>=1)
                          {
                            resolve(true)
                          }
                      })
                  }
              })
            }
          })
          }
        })
        } 
        catch (error) {
          reject(error)
        }
  })
}
        // DEP.destroy({where:{DepartmentId:data.DepartmentId}}).then(res=>
        //   {
        //    return res          
        //   }).then(IsDelDep=>{
        //     console.log(IsDelDep)
        //     if(IsDelDep)
        //     {
        //     Perinformation.findAll({
        //       where:{
        //         DepID:data.DepartmentId
        //       }
        //     }).then(infos=>{
        //       if(JSON.stringify(infos)=='[]')
        //       {
        //         resolve(true)
        //       }
        //       else
        //       {
        //        Perinformation.destroy({
        //         where:{
        //           DepID:data.DepartmentId
        //         }
        //       }).then(DelInfo=>{
        //         if(DelInfo==1)
        //         {
        //           resolve(true)
        //         }
                
        //         console.log(DelInfo);
        //       })
        //       }
       
        //     })
          
        //       // Perinformation.destroy({
        //       //   where:{
        //       //     DepID:data.DepartmentId
        //       //   }
        //       // }).then(IsDelInfo=>{
        //       //   console.log(IsDelInfo);
        //       //   return IsDelInfo
        //       //   // resolve(IsDelInfo);
        //       // })
        //     }
        //   })
          // .catch(function(reject)
          // {
          //   console.log(reject)
          //   return reject()
          // })
  


  static async PostUpdate(data)
  {
    return  new Promise((resove,reject)=>{
      try {     
        console.log(data);
        DEP.update(data,{where:{DepartmentId:data.DepartmentId}}).then(res=>
          {
            console.log(res);
          return res
          }).then(DepisUpdated=>{

            if(DepisUpdated)
            {
              Perinformation.update({PermissionKey:data.Permission_Key},{
                where:{
                  DepID:data.DepartmentId
                }
              })
              .then(isUpdate=>{
                if(isUpdate)
                {
                  resove(isUpdate)
                }           
              })
            }         
          })
          
          .catch(function(reject)
          {
            console.log(reject)
            return reject()
          })
      }
      
      catch (error) {
        reject(error)
      }
    })
  }
  /**
   * 
   * @param {* } ctx 
   */
  static async QueryFindCountAllDEP(ctx)
  {   
    let count=` SELECT count([LIM_Department].[DepartmentId]) AS [count] FROM [LIM_Department] AS [LIM_Department]`
    let sql=`SELECT LIM_Permission.ID, LIM_Permission.RoleID, LIM_Permission.Permission_key, LIM_Permission.Permission_name, 
    LIM_Permission.description, LIM_Permission.optioncode, LIM_Permission.OrderID, LIM_Department.DepartmentId, 
    LIM_Department.DepartmentName, LIM_Department.Abbreviation, LIM_Department.UploadDir, 
    LIM_Department.ParentDepartmentId, LIM_Department.Priority, LIM_Department.PID, LIM_Department.status
FROM      LIM_Department LEFT OUTER JOIN
    LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_key
ORDER BY LIM_Department.DepartmentId DESC`
    return new Promise(async(resolve,reject)=>{
        let res={}
           res.rows=await gov.query(sql,{type : gov.QueryTypes.SELECT})
        let c=await gov.query(count,{type : gov.QueryTypes.SELECT})
        console.log(c[0].count)
           res.count=c[0].count
        console.log(res)

      //  let sql=`SELECT   LIM_Permission.*, LIM_Department.DepartmentId, LIM_Department.DepartmentName FROM LIM_Department INNER JOIN
      //  LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_key`
      //  let res =await gov.query(sql, {type : gov.QueryTypes.SELECT})
      //  resolve(res)
      //  console.log(res)
   
    // console.log(data)
    resolve(res)
  })
}
        /**
       * 
       * @param {ctx} s 
       * @return Dep
       */
      static async select_DepartmentByUploadDir(s)
      {    
            const DepartmentInfo = await DEP.findOne({
              where: {
                UploadDir:s
              }
            })
            return DepartmentInfo  
      }
/**
 * 
 * @param {ctx} s 
 * @return Dep
 */
static async select_DepartmentByDEPName(s)
{    

      const DepartmentInfo = await DEP.findOne({
        where: {
          DepartmentName:s
        }
      })
      return DepartmentInfo
   
}
/**
 * 
 * @param {ctx} s 
 * @return Dep
 */

  static async select_DepartmentByKey(s)
  {    
 
        const DepartmentInfo = await DEP.findOne({
          where: {
            Permission_Key:s
          }
        })
        return DepartmentInfo
     
  }

  static async select_One_Depinformation(s)
  {
        return new Promise((resolve,reject)=>{
          try {
            Perinformation.findOne({
              attributes:['RoleID','PermissionKey','IsParent','IsView','IsEdit','DepID'],
              where:{
                DepID:s
              }
            }).then(res=>{

              resolve(res)
            })
          } catch (error) {
            reject(error)
          }
        })
  }
  /**
 * 
 * @param {ctx} s 
 * @return Dep
 */

static async selectAll_DepartmentByPermission_Key(s,roleid)
{    

  return  new Promise((resolve,reject)=>{
    try {     
      DEP.findAndCountAll({
        attributes: [
         Sequelize.col('DepInformation.IsParent'),
         Sequelize.col('DepInformation.IsView'),
         Sequelize.col('DepInformation.IsEdit'),        
        'Abbreviation' ,
        // ['DepartmentId','DepID'],
        // ['Permission_Key','Permissionkey'],
        'DepartmentId',
        'Permission_Key',
        'UploadDir'        
      ],

      order:[
        ['Priority','Desc']
      ],
        where: {
          Permission_Key:s,
          status:1
        },      
        include: [{
            model: Perinformation,
            as: 'DepInformation',
            attributes: [
             
              // Sequelize.col('DepInformation.IsParent'),
              // Sequelize.col('DepInformation.IsView'),
              // Sequelize.col('DepInformation.IsEdit'),
              // Sequelize.col('DepInformation.DepID'),
            ]  ,
            where: {
              RoleID: roleid
            },
            required: false        
        }],  
        raw:true  
      }).then(res=>{
        
        resolve(res)
      })
    } catch (error) {
      reject(error)
    }
  })

   
}
  /**
 * 
 * @param {ctx} s 
 * @return Dep
 */

static async findOne_DepartmentByDepartmentID(s)
{    

  return  new Promise((resolve,reject)=>{
    try {     
      DEP.findOne({
        where: {
          DepartmentId:s
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
   * 
   * 添加单位
   * @param s
   * @returns {Promise.<boolean>}
   */
  static async Add_Department (s) {
    
    await DEP.create({
      'DepartmentName': s.DepartmentName,
      'Permission_Key': s.Permission_Key,
      'UploadDir': s.UploadDir,
      'Abbreviation': s.Abbreviation,
      'ParentDepartmentId': s.ParentDepartmentId,
      'Priority': s.Priority,
      'Number': s.Number,   
      'PID': s.PID,
      'status': 1,     
    })
    return true
  }
}

module.exports = DepartmentModel