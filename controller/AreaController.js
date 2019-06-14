const RolesModel = require('../models/L_RolesModels')

const PermissionModel = require('../models/L_PermissionModels')
const DepModel = require('../models/L_DepModels')
const AreaModel = require('../models/L_AreaModels')



// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class AreaController {
  

     /**
     * 查询某个角色的权限列表
     * @param {Roleid} ctx 角色ID
     */
    static async GetPermissionbyRoleID(ctx)
    {
       
        const res=ctx.request.query
        const ID=res.ID
        console.log(ID)
      
        let arr=[] 
      
        let _PermissionsArr=await PermissionModel.SelectByRoleID(ID) 
     
      
        _PermissionsArr.forEach(v => {
       
            // console.log(v)
            if(v.IsView)
            {
                arr.push(v.PermissionKey)
            }
        });
                ctx.body={
                    result:arr
                }
           
    }
    /**
     * 给角色添加权限列表
     * @param {data} ctx 
     */
    static async UpdataRolesPremissionbyID(ctx)
    {     
        const res=ctx.request.body
        const ID=res.ID
        const keys=res.PremissionValue.join("|")
      //  let list=keys.toString()
        let data={}
        data.roleid=ID
        data.PremissionValue=keys
        const result=await RolesModel.updateRolesPermission(data)
        console.log(result)
        if(result)
        {
            ctx.body={
                code:1,
                message:'添加权限成功'
            }
        }
      
    }

/**删除角色
 *@param{ctx} 
 */
static async DeleterolesByID(ctx)
{
  
    // const data=ctx.request.query
    console.log(ctx.request.query)
    const data =ctx.request.query
    const flag=await RolesModel.delRoles(data.id)
    
    console.log('控制器：')
    console.log(flag)
    
    if(flag==1)
    {
        ctx.body={
            code:1,
            message:'删除角色成功'
        }
    }
    else
    {
        ctx.body={
            code:-1,
            message:'删除角色失败'

        }
    }
}

/**
 * 查询所有角色
 * @param {*} ctx 
 */
static async findAllroles(ctx)
{
  //  console.log(ctx.request.query)
      const res=ctx.request.query
   //   console.log(res)
      const pageNo=res.pageNo
    //  console.log(pageNo)
      const pageSize=res.pageSize
      const offset=(pageNo-1) * pageSize
     // console.log(typeof(offset))
     const limit=pageSize * 1
     // console.log(typeof(limit))
 
 const roleslist=await RolesModel.findRoles({ offset:offset,limit: limit }) 


 
//  roleslist.rows.forEach(async v => {  
   
//      let res=await PermissionModel.SelectByRoleID(v.roleid)
//      v.permissioninfo=res
   
//     });
  
    

 //{ offset: 0, limit: 10 }, 跳过10 条数据并获取其后的 10 条数据（实例）
//  const PermissionInformation=await PermissionModel.SelectByRoleID()
//  console.log(roleslist.rows[0].dataValues)
console.log(roleslist.rows)
    const result={
        pageNo:pageNo*1,
        pageSize:pageSize*1,
        data:roleslist.rows,    
        totalCount:roleslist.count,
        totalPage:parseInt(roleslist.count/pageSize)
       } 
    ctx.body={
       result:result
    }

}

    /**
     * 增加角色
     * @param ctx 
     * @returns {true}
     */
    static async createRoles(ctx)
    {
        const flag = await RolesModel.dbasync();
        console.log(flag)
        const data=ctx.request.query
        console.log(data)
           const roleinfo=await RolesModel.findroleByRoleName(data.rolevalue)
    //    const flag = RolesModel.dbasync();
       if(flag)
       {
           if(roleinfo)
           {
            ctx.body={
                        code:-1,
                        message:'该角色名或标识已经存在'                        
                    }   
               console.log('角色已经存在')
           }
           else
           {
               const addRolesStatus= await RolesModel.createRoles(data)
               console.log('可以创建角色')
               if(addRolesStatus)
               {
               ctx.body={
                   code:1,
                   message:'角色建立成功'
               }
            }
            else
            {
                ctx.body={
                    code:-1,
                    message:'角色建立失败'
                }
            }
           }
       }
       else
       {
           console.log('表还没有创建！')
       }
 
    }


 
}

module.exports = AreaController

