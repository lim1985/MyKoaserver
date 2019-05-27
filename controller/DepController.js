const DepModel = require('../models/L_DepModels')

class DepModelController {


    static async selectAll_DepartmentByPermission_Key(ctx)
    {
        const res=ctx.request.query
        const DEPlist=await DepModel.selectAll_DepartmentByPermission_Key(res.s)
        console.log(`-----------------------------------`)
        // console.log(DEPlist.rows)
        const data=DEPlist.rows
        const _arr=[]
      for(let x in data)
      {  
          const obj={}
          obj.label=data[x].Abbreviation
          obj.value=data[x].DepartmentId+""
        _arr.push(obj)
      }
       
        console.log(_arr)
            //  data.push(obj)
            
        if(DEPlist.count==0)
        {
            ctx.body={
                code:-1
            }
        }
        else
        {
       ctx.body={
           code:1,
           result:_arr
        }
        }
    }
    static async PostDelDepByDEPID(ctx)
{    
        const data=ctx.request.body
        console.log(data)
        console.log(data.lenght)
        
        const res=await DepModel.PostDel(data)
            if(!res)
            {
                ctx.body={
                    code:-1,
                    message:'删除失败，请重试！'
                }                
            }
            else
            {
                ctx.body={
                    code:1,
                    message:'部门删除成功。'
                }
            }
}
static async PostUpdateDepByDEPID(ctx)
{    
        const data=ctx.request.body
        console.log(data)
        const res=await DepModel.PostUpdate(data)
            if(!res)
            {
                ctx.body={
                    code:-1,
                    message:'修改失败，请重试！'
                }                
            }
            else
            {
                ctx.body={
                    code:1,
                    message:'修改部门信息成功。'
                }
            }
}

static async QueryFindCountAllDEP(ctx)
{
    const res=ctx.request.query
   
    const pageNo=res.pageNo
    //  console.log(pageNo)
    const pageSize=res.pageSize
    const offset=(pageNo-1) * pageSize
    // console.log(typeof(offset))
    const limit=pageSize * 1
    const DEPlist=await DepModel.QueryFindCountAllDEP({ offset:offset,limit: limit })
    console.log(`-----------------------------------`)
    console.log(DEPlist)
    const result={
    pageNo:pageNo*1,
    pageSize:pageSize*1,
    data:DEPlist.rows,
    totalCount:DEPlist.count,
    totalPage:parseInt(DEPlist.count/pageSize)
                }
   ctx.body={
       code:1,
       result:result
   }
}



    /***
     * @param s=ctx.body from post
     */
    static async AddDepartment(ctx)
    { 
    //    'DepartmentName': s.DepartmentName,
    //   'Permission_Key': s.Permission_Key,
    //   'UploadDir': s.UploadDir,
    //   'Abbreviation': s.Abbreviation,
    //   'ParentDepartmentId': s.ParentDepartmentId,
    //   'Priority': s.Priority,
    //   'Number': s.Number, 
        //models=Add_Department
        console.log(ctx.request.body)

        let obj=new Object();
        const a=ctx.request.body
        obj.DepartmentName=a.DEPName
        obj.Permission_Key=a.depKey
        obj.UploadDir=a.UploadDir
        obj.Abbreviation=a.Abbreviation
        obj.Priority=a.Priority
        obj.ParentDepartmentId=1
        obj.Number='NULL'

        const depflag=await DepModel.select_DepartmentByDEPName(a.DEPName)
       if(!depflag)
       {
        const result=await DepModel.Add_Department(obj)
        ctx.body={
            code:1,
            res:obj,
            flag:result
        }
       }
       else
       {
        ctx.body={
            code:-1,
            message:'该部门名称已经存在，请不要重复添加'
           
        }
       }  
    }

    static  async GetDepartmentByID(ctx)
    {
        const data=ctx.request.query  
        console.log(data.ID)   
        const result=await DepModel.findOne_DepartmentByDepartmentID(data.ID)
        console.log(result);
        if(!result)
        {
            ctx.body={
                code:-1
            }
            
        }
        else
        {
        ctx.body={
            code:1,
            result:result
        }
      }
   }
    
    /**
     * 新增单位
     * @param ctx
     * @return {ctx.body={ctx.body=code:1}}
     */
    static async GetDepartmentByKey(ctx)
    {
      //  console.log(ctx.request.query)     
        const data=ctx.request.query             
        const result=await DepModel.select_DepartmentByKey(data.Permissionskey)
        console.log(result);
        if(!result)
        {
            ctx.body={
                code:-1
            }
            
        }
        else
        {
        ctx.body={
            code:1,
            result:result
        }
    }
        // DepModel.Add_Department

        // //     console.log('11')
        // // console.log(data)
        // const result= await PermissionModel.findIDByPermissionName(data.Permissionskey)
        // console.log(result)
        //     if(flag)
        //     {
        //         if(result)
        //         {
        //           ctx.body={
        //               code:-1,
        //               message:'该权限标识已存在，请不要重复添加'
        //           }
        //         }
        //         else
        //         {
        //             const addPermissionstatus=await PermissionModel.createPermission(data)
        //                     if(addPermissionstatus)
        //                     {
        //                         ctx.body={
        //                             code:1,
        //                             message:'权限添加成功！'
        //                         }
        //                     }
        //                     else
        //                     {
        //                         ctx.body={
        //                             code:-1,
        //                             message:'权限添加失败'
        //                         }
        //                     }
        //         }
        //     }
        //     else
        //     {
        //         ctx.body={
        //             code:-1,
        //             message:'表还没有创建，请创建表'
        //         }
        //     }
      
    }

}

module.exports = DepModelController