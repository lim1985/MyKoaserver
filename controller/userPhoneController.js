const userPhoneModel = require('../models/L_UsersPhone')
const DepModel = require('../models/L_DepModels')
//
class UserPhoneController {


    static async GetAllByDepID(ctx)
    {
     const res=ctx.request.query
     const _depid=res.DepID  
     const pageNo=res.pageNo       
     const pageSize=res.pageSize
     const offset=(pageNo-1) * pageSize     
     const limit=pageSize * 1
     const UserPhonelist=await userPhoneModel.GetPhoneUserByDepID({depid:_depid,offset:offset,limit: limit }) 
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
    console.log(res)
    const _depid=res.DepID
    const _key=res.key
    const _status=res.status
    const pageNo=res.pageNo       
    const pageSize=res.pageSize
    const offset=(pageNo-1) * pageSize     
    const limit=pageSize * 1
    const UserPhonelist=await userPhoneModel.GetPhoneUserByDepIDAndPermissionKey({status:_status,depid:_depid,key:_key,offset:offset,limit: limit }) 
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
                console.log(UserPhonelist.rows[x].Department_ID);
                let _Deplist=await DepModel.findOne_DepartmentByDepartmentID(UserPhonelist.rows[x].Department_ID)
                UserPhonelist.rows[x].dataValues.DepName=_Deplist.dataValues.DepartmentName
            }          
           console.log(UserPhonelist.rows)
      
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
        console.log(data)
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
          console.log(data)  
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
              
        }
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
    // console.log(result)
    // ctx.body={
    //     res:result
    // }
    // const res=await userPhoneModel.InertUserPhones(data)
    // console.log(res)
  

}

}

module.exports = UserPhoneController