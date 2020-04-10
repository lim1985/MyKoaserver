const DepsmsAccountModel = require('../models/L_DepModels')

// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class SMSAccountController {
    //AddDepAccounts(data)updateDepAccounts
    static async AddDepAccounts(ctx)
    {
        let data= ctx.request.body
       
       let result=await DepsmsAccountModel.AddDepAccounts(data);
       ctx.body={
           result
       }
    } 
    static async updateDepAccounts(ctx)
    {
        let data= ctx.request.body
        let result=await DepsmsAccountModel.updateDepAccounts(data);
        ctx.body={
            result
        }
    } 
    // jdid:"70"
    // pageNo:"1"
    // pageSize:"10"
    // const res=ctx.request.query
    // const _depid=res.DepID  
    // const pageNo=res.pageNo       
    // const pageSize=res.pageSize
    // const offset=(pageNo-1) * pageSize     
    // const limit=pageSize * 1
    // const UserPhonelist=await userPhoneModel.GetAllPhoneUserReferencUserByDepID({depid:_depid,offset:offset,limit: limit }) 
    // console.log(UserPhonelist)
    // const result={
    //     pageNo:pageNo*1,
    //     pageSize:pageSize*1,
    //     data:UserPhonelist.rows,
    //     totalCount:UserPhonelist.count,
    //     totalPage:parseInt(UserPhonelist.count/pageSize)
    // }
    // ctx.body={
    //     code:1,
    //     result:result
    // }
 
}

module.exports = SMSAccountController

