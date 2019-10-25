const userPhoneModel = require('../models/L_UsersPhone')
const DepModel = require('../models/L_DepModels')
const referenceUserModel = require('../models/L_ReferenceUserModel')
//
class UserPhoneController {


    static async sortUserPhoneList(ctx)
    {
        const data=ctx.request.body;
        const Count=data.length;
        // console.log(count)     
        let result=async()=>{
            return new Promise((resolve)=>{
              let _count=data.length;
              let count=data.length;
              let all=0
              data.forEach(item=>{
                  console.log(item);
                userPhoneModel.SortUserByDepID(item).then(res=>{ 
                    // console.log(res)                  
                  
                     if(res[0]==1)
                     {
                        _count--
                        all++
                     }  
                    console.log(all+'/'+count)
                    console.log(_count)
                     if(_count==0 && all==count)
                     {
                        console.log('success')
                        resolve('success') 
                     }                                                 
                })
                  
              })   
                
            })
        }
        // data.forEach(async item => {
        //  userPhoneModel.SortUserByDepID(item).then(res=>{        
        //     if(res==1)
        //     {
        //       count--
        //       if(count==0)
        //       {
        //         status.code=0            
        //       }
        //     }          
        //  })           
        // });
        // const result=await userPhoneModel.SortUserByDepID(data)
        let res=await result();
        ctx.body={
            res
        }
        // console.log(count);
    }

    static async DeleteUsers(ctx)
    {
        const data=ctx.request.query
        const res=await userPhoneModel.DeleteUserPhoneByID(data)
        if(res)
        {
            ctx.body={
                code:1,
                msg:'删除联系人成功'
            }
        }
        else
        {
            ctx.body={
                code:-1,
                msg:'删除失败，请联系管理员'
            }
        }
        console.log(res)
    }

    static async GetAllByDepID(ctx)
    {
     const res=ctx.request.query
     const _depid=res.DepID  
     const pageNo=res.pageNo       
     const pageSize=res.pageSize
     const offset=(pageNo-1) * pageSize     
     const limit=pageSize * 1
     const UserPhonelist=await userPhoneModel.GetAllPhoneUserReferencUserByDepID({depid:_depid,offset:offset,limit: limit }) 
     console.log(UserPhonelist)
     const result={
         pageNo:pageNo*1,
         pageSize:pageSize*1,
         data:UserPhonelist.rows,
         totalCount:UserPhonelist.count,
         totalPage:parseInt(UserPhonelist.count/pageSize)
     }
     ctx.body={
         code:1,
         result:result
     }
    }
    // allUserPhone
    static async GetAllPhoneuser(ctx)
    {
     const res=ctx.request.query
    
     const pageNo=res.pageNo       
     const pageSize=res.pageSize
     const offset=(pageNo-1) * pageSize     
     const limit=pageSize * 1
     const UserPhonelist=await userPhoneModel.allUserPhone({offset:offset,limit: limit }) 
     const result={
         pageNo:pageNo*1,
         pageSize:pageSize*1,
         data:UserPhonelist.rows,
         totalCount:UserPhonelist.count,
         totalPage:parseInt(UserPhonelist.count/pageSize)
     }
     ctx.body={
         code:1,
         result:result
     }
    }
    // GetPhoneUserByDepIDAndPermissionKey
   static async GetByDepIDAndPermissionKey(ctx)
   {
        const res=ctx.request.query
        // const data =ctx.request.body
        // console.log(data)
        const _depid=res.DepID
        const _key=res.key
        const _status=res.status
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize     
        const limit=pageSize * 1
        const UserPhonelist=await userPhoneModel.GetPhoneUserByDepIDAndPermissionKey({status:_status,DepID:_depid,key:_key,offset:offset,limit: limit }) 
        const result={
            pageNo:pageNo*1,
            pageSize:pageSize*1,
            data:UserPhonelist.rows,
            totalCount:UserPhonelist.count,
            totalPage:parseInt(UserPhonelist.count/pageSize)
        }
        ctx.body={
            code:1,
            result:result
        }
   }
   static async PostByDepIDAndPermissionKey(ctx)
   {
        const res=ctx.request.body     
        console.log(res)
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize     
        const limit=pageSize * 1  
        const params=res.param
        let _phoneUserList=[]
        let _arr=[]  
        let count=0
        let tempArr=[]
        for(let x in params)
        {
            // status:_status,depid:_depid,key:_key,
            // let result=await userPhoneModel.GetPhoneUserByDepIDAndPermissionKey({DepID:params[x].DepID,key:params[x].key,offset:offset,limit: limit,status:params[x].status})   
            let res2=await userPhoneModel.GetUserPhoneByDepID({DepID:params[x].DepID,key:params[x].key,offset:offset,limit: limit,status:params[x].status})
            // tempArr.push(result);
            tempArr.push(res2);
            count=count+res2.count
            if(res2.count>0)
            {
                _arr.push(res2.rows)
            }                
        }
    console.log(count)    
    _arr.forEach(v => {
        for(let x in v)
        {
            _phoneUserList.push(v[x])
        }        
    });
    
      const result={
        tempArr,
        pageNo:pageNo*1,
        pageSize:pageSize*1,
        data:_phoneUserList,
        totalCount:count,
        totalPage:parseInt(count/pageSize)
    }   
  
    ctx.body={
        code:1,
        result:result
    }
   }
    /**
     * 
     * @param {*} ctx 
     */
    static async GetAllUserPhoneListByPermissionKey(ctx)
    {
        const res=ctx.request.query       
        const _key=res.key
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize     
        const limit=pageSize * 1
        const UserPhonelist=await userPhoneModel.GetallUserPhoneByPermissionKey({key:_key,offset:offset,limit: limit }) 
          
            for(let x in UserPhonelist.rows)
            {
                // console.log(UserPhonelist.rows[x].Department_ID);
                let _Deplist=await DepModel.findOne_DepartmentByDepartmentID(UserPhonelist.rows[x].Department_ID)
                UserPhonelist.rows[x].dataValues.DepName=_Deplist.dataValues.DepartmentName
            }          
        //    console.log(UserPhonelist.rows)
      
        const result={
            pageNo:pageNo*1,
            pageSize:pageSize*1,
            data:UserPhonelist.rows,
            totalCount:UserPhonelist.count,
            totalPage:parseInt(UserPhonelist.count/pageSize)
        }
        ctx.body={
            code:1,
            result:result
        }
    }
 /**
  * 新建用户通讯录方法
  * 参数post接收对象
  * @param ctx
  * @returns {Promise.<void>}
  * 
  */
    static async ValidateTel(ctx)
    {
        const data=ctx.request.body  
        // console.log(data)
        const userinformation=await userPhoneModel.findUserInformationByID(data)
        const result=await userPhoneModel.findUserByPhoneNum(data) 
        if(data.ID=="-1")//先判断传进来的参数 ID 是不是 -1
        {
            if(!result) //是-1 再判断是否存在用户信息，不存在执行返回code：1
            {
                ctx.body={
                    code:1                                    
                   }
            }
            else
            {
               ctx.body={ //否则就是存在相同数据，返回-3
                code:-3,
                result:result
                }
            }
        } 
        else //传进来的数据不是-1那么就是传进来了用户ID信息
        {
                if(data.tel==userinformation.dataValues.H_cellphone || data.tel==userinformation.dataValues.cellphone) //在判断传进来的手机号和用户ID查出来的手机号是不是相同
            {
                ctx.body={//如果相同的话说明用户是在执行update操作而不是新增。然后返回 正常状态1
                    code:1                                    
                    }
            }else if(!result)//再判断传进来的手机号在系统里是否存在，如果不存在就返回 正常状态1
            {
                ctx.body={
                    code:1                                    
                   }
            }  
             else//否则说明传进来的手机号存在于系统内，所以返回异常状态-3
            {
               ctx.body={
                code:-3,
                result:result
                }
            }
        }      
    }
    /**
     * 
     * @param {data} ctx 
     * 
     */
    static async UpdateUserPhoneinformation(ctx)
    {
        const data =ctx.request.body
        //   console.log(data)  
        //   { ID: 50,
        //     status: 7,
        //     GroupID: null,
        //     Email: '80168611@qq.com',
        //     UserName: '戴小军',
        //     Permission_Key: 'QW',
        //     Department_ID: 152,
        //     UJOB: '临聘人员',
        //     Tel: '0739-5388888',
        //     H_Tel: '0739-5388888',
        //     cellphone: '15243990016',
        //     H_cellphone: '15243990017',
        //     QQ: '80168611',
        //     avatar: null,
        //     inTime: '1558687938',
        //     Sex: 1,
        //     BirthDay: null,
        //     Type: null,
        //     OrderID: null },
        // { ID: 50,
        //     UserName: '戴小军',
        //     Sex: '1',
        //     BirthDay: null,
        //     status: '7',
        //     DepKeylist: [ 'QRD', 153 ],
        //     UJOB: '临聘人员',
        //     Tel: '0739-5388888',
        //     cellphone: '15243990016',
        //     H_Tel: '0739-5388888',
        //     H_cellphone: '15243990017',
        //     QQ: '80168611',
        //     Email: '80168611@qq.com' }

        const _data={
                ID:data.ID,
                UserName:data.UserName,
                Sex:data.Sex,
                BirthDay:data.BirthDay,
                status:data.status,
                Permission_Key:data.DepKeylist[0],
                Department_ID:data.DepKeylist[1],
                UJOB:data.UJOB,           
                Tel:data.Tel,
                cellphone:data.cellphone,
                H_Tel:data.H_Tel,
                H_cellphone:data.H_cellphone,
                QQ:data.QQ,
                Email:data.Email,
                Py_Index:data.Py_Index              
        }
        // s.DepID,
        // s.UserPhoneID
        let params={
            DepID:_data.Department_ID,
            UserPhoneID:_data.ID
        }
        const isExist= await referenceUserModel.FindReferencesUserByDepIDUserPhoneID(params)//该单位关联表里是否存在该人员信息  
        const isNowDep=await userPhoneModel.findUserInformationByID({ID:_data.ID})
        console.log(isNowDep)
     if(!isExist || _data.Department_ID==isNowDep.dataValues.Department_ID)
     {
        const result=await userPhoneModel.UpdateUserPhonebyID(_data)
        if(result)
        {
            ctx.body={
                code:1,
                action:'Update',
                res:result
            }
        }
        else
        {
            ctx.body={
                code:-1,
                action:'Update',
                res:result
            }
        }
     }
     else
     {
         ctx.body={
             code:-4,
             msg:'该单位已经存在联系人,操作失败'
         }
     }        
    }
/**
 * 新建用户通讯录方法
 * 参数post接收对象
  * @param ctx
  * @returns {Promise.<void>}
 * 
 */
static async AdduserPhones(ctx)
{
    const  data=ctx.request.body  
    console.log(data)
    const result=await userPhoneModel.findUserByPhoneNum(data)     
     if(!result)
     {
      const add=await userPhoneModel.InertUserPhones(data)
      if(!add)
    {
        ctx.body={
            code:-2,
            result:add
        }
    }
    else
    {
        ctx.body={
            code:1,
            result:add
        }
    }
   }else
   {
        ctx.body={
        code:-3,
        status:"error",        
        result:result
    }
   }
}
 static async GetuserInformationbyTelNum(ctx)
 {
     const data=ctx.request.query
     console.log(data)
     let pages=JSON.parse(data.parameter);  
     const pageNo=pages.pageNo       
     const pageSize=pages.pageSize
     const offset=(pageNo-1) * pageSize     
     const limit=pageSize * 1
     let obj=new Object();
     obj.tel=data.data;
     obj.offset=offset;
     obj.limit=limit
     const result=await userPhoneModel.findUserByPhoneNum(obj)  
     console.log(result);
     if(!result)
     {
         ctx.body={
             code:-1
         }         
     }  
     else
     {
        const res={
            pageNo:pageNo*1,
            pageSize:pageSize*1,
            data:[result],
            totalCount:1,
            totalPage:1
        }
        ctx.body={
            code:1,
            isNum:true,
            res:res
          }
     }
        
 }
 static async GetUserInformationByUserNameLIke(ctx)
 {
    const data=ctx.request.query     
    console.log(data.parameter )
    let pages
    let pageNo
    let pageSize
    if(data.parameter)
    {
        pages=JSON.parse(data.parameter);  
        pageNo=pages.pageNo       
        pageSize=pages.pageSize
    }
    pageNo=1;
    pageSize=10;   
    const offset=(pageNo-1) * pageSize     
    const limit=pageSize * 1   
    let result  
    let obj=new Object();
    obj.username=data.data;
    obj.offset=offset;
    obj.limit=limit
     if(data.DepID)
     {
         obj.DepID=data.DepID
         result=await userPhoneModel.findUserByusernameAndDepIDlike(obj)
         console.log(result)
     } 
     else
     {
         result=await userPhoneModel.findUserByusernamelike(obj)  
     }

       
     if(result.count==0)
     {
         ctx.body={
             code:-1
         }         
     }  
     else
     {


        // pageNo:pageNo*1,
        // pageSize:pageSize*1,
        // data:_phoneUserList,
        // totalCount:count,
        // totalPage:parseInt(count/pageSize)

        const res={
            pageNo:pageNo*1,
            pageSize:pageSize*1,
            data:result.rows,
            totalCount:result.count,
            totalPage:parseInt(result.count/pageSize)
        }
        console.log(res);
        ctx.body={
            code:1,
            res:res
          }
     }  
 }
 static async GetuserInformationbyUsername(ctx)
 {
     const data=ctx.request.query
     let obj=new Object();
     obj.username=data.data;
     const result=await userPhoneModel.findUserByusername(obj)  
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
            res:result
          }
     }    
 }
 static async GetUserByNameAndDepID(ctx)
 {
    const data=ctx.request.body    
    const res=await userPhoneModel.findUsersByPhoneAndDepID(data)
    
     ctx.body={
         res
     }
    // const res=await userPhoneModel.importUsersListfromExcle(data)  
    //userPhoneModel.importUsersListfromExcle
 }
 static async importUsersListfromExcle(ctx)
 {
    const data=ctx.request.body    
    let res = await userPhoneModel.importUsersListfromExcle(data)
     ctx.body={
         res
     }
 }

 
}

module.exports = UserPhoneController