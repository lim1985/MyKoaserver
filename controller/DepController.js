const DepModel = require('../models/L_DepModels')

class DepModelController {

   static async selectSmsAccounts(ctx)
   {
       const data=ctx.request.body
       console.log(data)
       const Accounts=await DepModel.selectDepAccounts(data.DepID);
       console.log(Accounts);
     if(Accounts.rows[0].ApID)
     {
        ctx.body={           
            code:1
        }
     }
     else
     {
        ctx.body={           
            code:0
        } 
     }
       
      
   }
   static async updateSmsCount(ctx)
   {
       const data=ctx.request.query

       let result=await DepModel.UpdateDepSmsCount(data);
       console.log(result)
       ctx.body={
           result
       }
   }

    static async selectDepSmsCount(ctx)
    {
        const data=ctx.request.body
        console.log(data)
        let arr=data
        console.log(arr);
    const depcount=await DepModel.Select_SmsCountByDepID(arr)
      ctx.body={
        depcount
      }
    }
    static async SelectDepslistsbyLike(ctx)
    {
        const data=ctx.request.query
        console.log(data)
        const deplist=await DepModel.getListByDepNameLike(data.DPName)
        console.log(deplist);
        if(deplist=='')
        {
          ctx.body={
              code:-1
          }         
        }
        else
        {
            const list=deplist.map(item=>{
                return {Depname:item.DepartmentName,DepID:item.DepartmentId,Per_Key:item.Permission_Key,DepKey:item.UploadDir,Per_ID:item.PID}
            })
            
            ctx.body={
                code:1,
                res:list      

            }  
            console.log(list);
        }    
    }

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
        console.log(res);
        if(res==-2)
        {
            ctx.body={
                res,
                code:-1,
                message:'该部门下存在联系人，请将联系人移除后再删除该部门！'
            }
            return     
        }
            if(!res)
            {
                ctx.body={
                    res,
                    code:-1,
                    message:'删除失败，请重试！'
                }                
            }
            else
            {
                ctx.body={
                    res,
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
        obj.DepartmentName=a.DepFullName
        obj.Permission_Key=a.Permissionkey
        obj.UploadDir=a.UploadDir
        obj.Abbreviation=a.Abbreviation
        obj.Priority=a.Priority
        obj.ParentDepartmentId=1
        obj.PID=a.PID
        obj.status=a.status
        obj.Number='NULL'
        obj.smsCount=a.smsCount
            console.log(obj);
        const depflag=await DepModel.select_DepartmentByDEPName(a.DepFullName)
       if(!depflag)
       {
        const result=await DepModel.Add_Department(obj)  
         if(result.DepartmentId)   
         {           
            await DepModel.Add_SmsDep({DepID:result.DepartmentId,SMSCount:obj.smsCount})
         }   
                    
        console.log(result);
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