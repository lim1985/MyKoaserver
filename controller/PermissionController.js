const PermissionModel = require('../models/L_PermissionModels')
const DepModel = require('../models/L_DepModels')
const rolesModel = require('../models/L_RolesModels')
// const Perinformation = gov.import('../schema/LIM_PermissionInformation.js')

// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class PermissionController {
static async GetAreaAllPermissbyAdminID(ctx)
{
    const data=ctx.request.query;

    const result=await PermissionModel.GetAreaPermissionAllbyAdminID(data)
    
     ctx.body={
         result
     }
}

// 测试api开始
            static async newPermissionInformationbyRoleID(ctx)
            {
                let data=ctx.request.query
                console.log(data)
                let ID=data.ID    
                let res=await PermissionModel.newselectPermissionByroleid(ID);
                ctx.body={
                    res
                   
                }
            }
//测试api结束
static async SelectPermissionInformationByRoleID(ctx)
{
    let data=ctx.request.query
    console.log(data)
    let ID=data.ID        
    let arr=[]   
    let _PermissionsArr=await PermissionModel.SelectByRoleID(ID) 
            // console.log(_PermissionsArr)
                for(let x in _PermissionsArr)
                {
                     let obj=new Object();
                     obj.DepID=_PermissionsArr[x].DepID,
                     obj.IsEdit=_PermissionsArr[x].IsEdit,
                     obj.IsParent=_PermissionsArr[x].IsParent,
                     obj.IsView=_PermissionsArr[x].IsView,
                     obj.RoleID=_PermissionsArr[x].RoleID,
                     obj.value=_PermissionsArr[x].PermissionKey
                     obj.label=_PermissionsArr[x].Permission_name                   
                    if(_PermissionsArr[x].IsParent)
                    {
                        let _depArr=await DepModel.selectAll_DepartmentByPermission_Key(_PermissionsArr[x].PermissionKey,_PermissionsArr[x].RoleID)    
                        console.log(_depArr.rows)
                        obj.actionOptions=_depArr.rows
                    }                   
                        let _permissArr=await  PermissionModel.findIDByPermissionName(_PermissionsArr[x].PermissionKey)
                        if(_permissArr)
                        {
                            obj.label=_permissArr.Permission_name
                        }                        
                    arr.push(obj)

                }
    console.log(arr)
    ctx.body={
        _PermissionsArr,
        res:arr,
        ore:_PermissionsArr
    }
  

}
  
static async UpdataPermissionInformation(ctx)
{    

    // console.log(ctx.query.body)
    // ctx.body={
    //     res:ctx.query.body
    // }
  
    let data=ctx.request.body
    // console.log('服务器收到的')
    // console.log(data)
    let res=await  PermissionModel.UpdataPermissionInFormationByRoleID(data)  
   
  ctx.body={
        res:res
  }

}
  
/**删除权限
 *@param{ctx} 
 */
static async DeletePermissionByID(ctx){
  
    // const data=ctx.request.query
    console.log(ctx.request.query)
    const data =ctx.request.query
    const flag=await PermissionModel.delPermission(data)  
    let rolelist=await rolesModel.findRoles();  
    
    // const                    PermissionModel.DelPerinformation()
    
    console.log('控制器：')
    console.log(flag)    
    if(flag==1)
    { 
        //             where:{
        //               IsParent:1,
        //               RoleID:data[x].roleid,
        //               PermissionKey:data[x].key
        //                  }
        let _arr=[]
        for(let x in rolelist.rows)
        {
             let _obj=new Object();
                 _obj.roleid=rolelist.rows[x].roleid;
                 _obj.key=data.key;
                 _obj.IsParent=1;
                 _arr.push(_obj)
        }
        const result=await PermissionModel.DelPerinformation(_arr)
        ctx.body={
            code:1,
            message:'删除权限成功',
            result
        }
    }
    else
    {
        ctx.body={
            code:-1,
            message:'删除权限失败'
        }
    }
}

static async findPermissionBykey(ctx)
{
    const res=ctx.request.query
    console.log(res.key)
    const Permissioninfo=await PermissionModel.findIDByPermissionName(res.key)
    // console.log(Permissioninfo)
                if(!Permissioninfo)
                {
                    ctx.body={
                        code:-1,
                        result:res.key
                    }
                }
                else
                {
                    ctx.body={
                        code:1,
                        result:Permissioninfo
                }    
                }
}
/**
 * 查询所有权限
 * @param {*} ctx 
 */
static async findAllPermission(ctx)
{

    // const flag=await PermissionModel.dbasync()
    // console.log(flag)
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
  
 const Permissionlist=await PermissionModel.findPermiss({ offset:offset,limit: limit })   //{ offset: 0, limit: 10 }, 跳过10 条数据并获取其后的 10 条数据（实例）
 // console.log(roleslist)
  
    const result={
        pageNo:pageNo*1,
        pageSize:pageSize*1,
        data:Permissionlist.rows,
        totalCount:Permissionlist.count,
        totalPage:parseInt(Permissionlist.count/pageSize)
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
    static async createPermission(ctx)
    {
        const flag = await PermissionModel.dbasync();
        console.log(flag)
        const data=ctx.request.query
        console.log(data)
         const roleinfo=await PermissionModel.findIDByPermissionName(data)
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
    /**
     * 修改权限
     * @param {*} ctx 
     */
     static async UpdatePermission(ctx)
     {
      //console.log(ctx.request.query)
       const data=ctx.request.query
   
       const Isexits=await PermissionModel.findIDByPermissionName(data.Permissionskey)
     
      
        if(!Isexits || Isexits.status!=data.status)
        {       
            console.log(Isexits)
            console.log(Isexits.status)
            let _data={
                ID:data.ID,
                Permission_key:data.Permissionskey,
                Permission_name:data.PermissionName,
                description:data.description,
                OrderID:data.OrderID,
                areakey:data.Areakey,
                status:data.status
            }
            const result= await PermissionModel.updatePermission(_data)
            if(result)
            {
                ctx.body={
                    code:1,
                    message:'修改成功！'
                    }
            }
            else
            {
                ctx.body={
                    code:-1,
                    message:'修改失败！'
                    }
            }         
        }
        else
        {
            ctx.body={
                code:-1,
                msg:'类别标识重复，写入失败'
            }
        }    
     }
    /**
     * 新增权限
     * @param ctx
     * @return {ctx.body={ctx.body=code:1}}
     */
    static async AddPermission(ctx)
    {
      //  console.log(ctx.request.query)
        const flag = await PermissionModel.dbasync();
        const data=ctx.request.query
        //     console.log('11')
        console.log(data)
           if(!data.Permissionskey)
           {
               console.log('没有数据')
              return false
           }
           else
           {
        const result= await PermissionModel.findIDByPermissionName(data.Permissionskey)
        console.log(result)
            if(flag)
            {
                if(result)
                {
                  ctx.body={
                      code:-1,
                      message:'该权限标识已存在，请不要重复添加'
                  }
                }
                else
                {                                  
                    const addPermissionstatus=await PermissionModel.createPermission(data)
        // ID:57
        // OrderID:"10"
        // Permission_key:"SDSD"
        // Permission_name:"受到收到"
        // areakey:"sysdxqrmzf"
        // console.log(addPermissionstatus)
                            if(addPermissionstatus)
                            {
                                let rolelist=await rolesModel.findRoles();
                                let _arr=[];
                               
                                for(let x in rolelist.rows)
                                {
                                    let _obj=new Object();
                                    _obj.RoleID=rolelist.rows[x].roleid;
                                    _obj.PermissionKey=addPermissionstatus.Permission_key;
                                    _obj.IsParent=1;
                                    _obj.IsView=0;
                                    _obj.IsEdit=0;
                                    _obj.DepID=null;  
                                    _arr.push(_obj); 
                                                                   
                                }
                                let addres=await PermissionModel.AddPermissionInformationByRoleids(_arr);
                                ctx.body={
                                    code:1,
                                    message:'权限添加成功！',
                                    rolelist,
                                    addPermissionstatus,
                                    _arr,
                                    addres
                                }
                            }
                            else
                            {
                                ctx.body={
                                    code:-1,
                                    message:'权限添加失败'
                                }
                            }
                }
            }
            else
            {
                ctx.body={
                    code:-1,
                    message:'表还没有创建，请创建表'
                }
            }
      
    }
}
}

module.exports = PermissionController

