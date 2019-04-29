const userPhoneModel = require('../models/L_UsersPhone')

class UserPhoneController {



    /**
     * 
     * @param {*} ctx 
     */
    static async GetAllUserPhoneList(ctx)
    {
        const res=ctx.request.query
       
        const _key=res.key
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize     
        const limit=pageSize * 1
        const UserPhonelist=await userPhoneModel.GetallUserPhone({key:_key,offset:offset,limit: limit }) 

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
    const res=await userPhoneModel.InertUserPhones(data)
    console.log(res)
    if(!res)
    {
        ctx.body={
            code:-1,
            result:res
        }
    }
    else
    {
        ctx.body={
            code:1,
            result:res
        }
    }

}

}

module.exports = UserPhoneController