const CustomGroupModel = require('../models/L_ReferenceGroupModel')

class CustomGroupModelController {


    static async sortCustomGroupUsers(ctx)
    {
        const data=ctx.request.body
        const _arrLength=data.length;
        const _data=data.data;
        let count=0
        console.log(data)
        console.log(_data)
        console.log(_arrLength)
       for(let x=0;x<=_arrLength-1;x++)
       {
        let i=await CustomGroupModel.CustomGroupUserSort(_data[x]);
   
         if(i==1)
         {
           console.log(i)
           count+=parseInt(i)
           console.log(count)
         }
       }
       
       if(count==_arrLength)
        {
            ctx.body={
                code:1,
                msg:'SortSuccess'
            }
        }
    }


    static async DeleteGroupByGroupID(ctx)
    {
        const data=ctx.request.query;
        console.log(data)
        const res=await CustomGroupModel.DeleteGroupByGroupID(data)
        if(res)
        {
            ctx.body={
                code:1,
                msg:'操作成功'
            }
        }
        console.log(res);
    }
    static async DeleteUserByUID(ctx)
    {
        const data=ctx.request.query
        const res=await CustomGroupModel.DeleteUserbyUID(data)
        if(res)
        {
            ctx.body={
                code:1,
                msg:'删除成功'                
            }
        }
    }
    static async FindAllUsersByGroupID(ctx)// 根据组ID 找到该组里面所有的联系人
    {
        const res=ctx.request.query;
        const pageNo=res.pageNo
        //  console.log(pageNo)
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize
        // console.log(typeof(offset))
        const limit=pageSize * 1
        let userlist
        console.log(res)
        if(res.UserName)
        {
            userlist=await CustomGroupModel.FindAllUsersByGroupIDAndLikeUserName({UserName:res.UserName,GroupID:res.GroupID, offset:offset,limit: limit })
        }
        else
        {
            userlist=await CustomGroupModel.FindAllUsersByGroupID({GroupID:res.GroupID, offset:offset,limit: limit })
        }        
        console.log(`-----------------------------------`)
        console.log(userlist)
        const result={
        pageNo:pageNo*1,
        pageSize:pageSize*1,
        data:userlist.rows,
        totalCount:userlist.count,
        totalPage:parseInt(userlist.count/pageSize)
         }
       ctx.body={
           code:1,
           result:result
       }
    }

    static async GetUserByGroupID(ctx)
    {   
        const data=ctx.request.query
        const res =await CustomGroupModel.GetUserByGroupID(data)
        if(res)
        {
            ctx.body={
                data:res
            }
        }
    }
    static async isexist(ctx)
    {
        let data=ctx.request.query;
        const isExist=await CustomGroupModel.GetUserByGroupIdAndUserId(data);
         if(JSON.stringify(isExist)=='[]')
        {
            ctx.body={
                code:-1
            }
        }
        else
        {
            ctx.body={
                code:1
            }
        }
    }
    static async NewaddUsersToGroup(ctx)
    {
        let data =ctx.request.body
        console.log(data.lenght)
        if(JSON.stringify(data)=='[]')
        {
            console.log(`数组为空`)
        }
        else
        {
                  const res=await CustomGroupModel.addUsersToGroup(data)
            console.log(res)
            if(res)
            {   
                ctx.body={
                    code:1,
                    data:res
                }   
            }
        }
        
        // if(data.lenght>0)
        // {
        //     const res=await CustomGroupModel.addUsersToGroup(data)
        //     console.log(res)
        //     if(res)
        //     {   
        //         ctx.body={
        //             code:1,
        //             data:res
        //         }   
        //     }
        // }

    }
    static async AddUsersToGroup(ctx)//将弃用
    {
        let data=ctx.request.body
       
        // const data=ctx.request.query
         console.log(data)
         if(data.UIDS.lenght>1)
         {
            const isinited=await CustomGroupModel.InitGroup(data);
            if(isinited)
            {     
   
               console.log(data);
            let _arr= data.UIDS.map(item=>{
                   return {GroupID:data.GroupID,UserPhoneID:item}
               })
               const res=await CustomGroupModel.addUsersToGroup(_arr)
               console.log(res)
               if(res)
               {   
                   ctx.body={
                       code:1,
                       data:res
                   }   
               }
                   
            } 
         }
         else
         { 
            //   let _arr= data.UIDS.map(item=>{
            // return {GroupID:data.GroupID,UID:item.UID}})
             let res= await CustomGroupModel.addUserToGroup(data);
             if(res)
             {   
                 ctx.body={
                     code:1,
                     data:res
                 }   
             }
         }
             
    }
   static async GetAllAreaDepUserbyAdminID(ctx)//根据AdminID里的areakey 获取所有的部门和部门下所有的通讯录人员
   {
       const data=ctx.request.query;
       const result=await CustomGroupModel.GetAllAeraDepUserbyAdminID(data)
       if(result)
       {
           ctx.body={
               data:result
           }
       }
       console.log(result)
   }
   static async GetcustomGroupByDepID(ctx)
   {
    const data=ctx.request.query
    console.log(data)
    // ctx.body={
    //    data
    // }
   const result =await CustomGroupModel.GetCustomGroupByDepID(data)
    console.log(result)
        ctx.body={
            data:result
        }  
   }

    static async CreateGroup(ctx)
    {
      let data=ctx.request.query;
      console.log(data)
      const  result=await CustomGroupModel.FindReferencesGroupName(data)
      console.log(result)
      if(result===null)
      {
        const res=CustomGroupModel.CreateCustomGroup(data)
        if(res)
        {
            ctx.body={
                code:1,
                msg:'组添加成功！'
            }
        }         
      }
      else
      {
          ctx.body={
              code:-1,
              msg:'组名称重复，请更改后再提交。'
          }
      }
    //   if(!result)
    //   {
    //     CustomGroupModel.CreateCustomGroup(data).then(res=>{
    //         console.log(res)
    //         if(res)
    //         {
    //             ctx.body={
    //                 code:1,
    //                 msg:'添加成功'
    //             }
    //         }
    //     })
    //   }
    //   else
    //   {
    //       ctx.body={
    //           code:-1,
    //           msg:'组名重复，请更改组名'
    //       }
    //   }
    
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

module.exports = CustomGroupModelController