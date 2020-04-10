const MeetingModels = require('../models/L_MeetingModels')

// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class MeetingController {
    static async selectmeetSubUsers(ctx)
    {
        const data=ctx.request.query;
        let result=await MeetingModels.selectmeetSubUsers(data)
        ctx.body={
            result
        }
    }
    static async removeSubmeetingUser(ctx)
    {
        const data =ctx.request.query
        console.log(data)
        let result=await MeetingModels.removeSubmeetingUser(data)
        ctx.body={
            result
        }
    }
    static async addmeetingSubjectUsers(ctx){
        const data =ctx.request.body
        console.log(data)
        if(JSON.stringify(data)=='{}')
        {
            ctx.body={
                code:-1,
                msg:'参数错误'
            }
        }
        else
        {
       let result=await MeetingModels.MeetingUsersCreate(data)       
       if(result)
       {
        ctx.body={
            code:1,
            result
        }
       }
        
     }

    }
    static async createMeetingSubject(ctx){
       // MeetingSubjectCreate
       const data =ctx.request.body
       console.log(data)
       if(JSON.stringify(data)=='{}')
       {
           ctx.body={
               code:-1,
               msg:'参数错误'
           }
       }
       else
       {
      let result=await MeetingModels.MeetingSubjectCreate(data)
      let ID= result.meetingID
         ctx.body={
             result
         }
       }
    }
    static async createMeet(ctx)
    {
        const data =ctx.request.body
        console.log(data)
        if(JSON.stringify(data)=='{}')
        {
            ctx.body={
                code:-1,
                msg:'参数错误'
            }
        }
        else
        {
       let result=await  MeetingModels.MeetingCreate(data)
       let ID= result.meetingID
          ctx.body={
              result
          }
        }
    }

    static async getMeetingByDepID(ctx)
    {
        const res=ctx.request.query 
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize     
        const limit=pageSize * 1
        // const UserPhonelist=await userPhoneModel.GetallUserPhoneByPermissionKey({key:_key,offset:offset,limit: limit }) 
        const meetingList=await MeetingModels.selectMeetListByDepID({meetingConvenDepID:res.DepID,offset:offset,limit: limit }) 
                
        //    console.log(UserPhonelist.rows)
      
        const result={
            pageNo:pageNo*1,
            pageSize:pageSize*1,
            data:meetingList.rows,
            totalCount:meetingList.count,
            totalPage:parseInt(meetingList.count/pageSize)
        }
        if(!meetingList)
        {
            ctx.body={
                code:-1,
                msg:'未查询到会议记录'
            }
        }
        else
        {
            ctx.body={
                code:1,
                result:result
            }
        }
        // ctx.body={
        //     code:1,
        //     result:result
        // }
// ----------------

        // const data=ctx.request.query
        // let result=await MeetingModels.selectMeetListByDepID(data)
        
    }

    static async getMeetingByID(ctx)
    {   
        const data=ctx.request.query
        // return new Promise (async(resolve,reject)=>{
        //     try {

        //     }
        // })
        let result=await MeetingModels.selectMeetingbyMeetingID(data);
        console.log(result)
        if(!result)
        {
            ctx.body={
                code:-1,
                msg:'未查询到会议记录'
            }
        }
        else
        {
            ctx.body={
                result
            }
        }
      
    }
    //AddDepAccounts(data)updateDepAccounts
    // static async AddDepAccounts(ctx)
    // {
    //     let data= ctx.request.body
       
    //    let result=await DepsmsAccountModel.AddDepAccounts(data);
    //    ctx.body={
    //        result
    //    }
    // } 
    // static async updateDepAccounts(ctx)
    // {
    //     let data= ctx.request.body
    //     let result=await DepsmsAccountModel.updateDepAccounts(data);
    //     ctx.body={
    //         result
    //     }
    // } 
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

module.exports = MeetingController

