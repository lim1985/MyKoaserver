const PersonInfomationModel = require('../models/L_PersonInfomation')

// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class PersonInfomationController {
  
    static async selectByJd_Id(ctx)
    {
        const res=ctx.request.query
        const jdid=res.jdid  
        const pageNo=res.pageNo       
        const pageSize=res.pageSize
        const offset=(pageNo-1) * pageSize   
        const limit=pageSize * 1
         let PersonList = await PersonInfomationModel.selectByJD_Id({jdid:jdid,offset:offset,limit: limit })
        
         console.log(PersonList)
        const result={
        pageNo:parseInt(pageNo)*1,
        pageSize:parseInt(pageSize)*1,
        data:PersonList.rows,
        totalCount:PersonList.count,
        totalPage:parseInt(PersonList.count/pageSize)
    }
    if(result.totalCount==0)
    {
        ctx.body={
            code:-1,
            msg:'暂未人员数据'
        }
        return 
    }
      ctx.body={
        code:1,
        result:result,
        PersonList
        
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

module.exports = PersonInfomationController

