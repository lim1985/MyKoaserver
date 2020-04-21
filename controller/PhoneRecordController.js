const PhonerecordModel = require('../models/L_Phonerecord')


class PhoneRecordController {
  static async addPhoneRecord(ctx)
  {
    const data=ctx.request.body
    console.log(data)
    if(data)
    {
      const res=await PhonerecordModel.createPhoneRecored(data)
      if(res)
      {
        ctx.body={
          code:1,
          res
      }  
      }
      else
      {
        ctx.body={
          code:-1,          
      }   
      }
    }
    
  }
  static async GetRecoredListByDepID(ctx)
  {
      const data=ctx.request.query
      console.log(data)
      if(data)
      {
        const res=await PhonerecordModel.getRecoredListByDepID(data)
        if(res)
        {
          ctx.body={
              code:1,
              res
          }  
        }
        else
        {
          ctx.body={
            code:-1,          
         }   
        }
      }
  }
  
}

module.exports = PhoneRecordController