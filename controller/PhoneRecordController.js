const PhonerecordModel = require('../models/L_Phonerecord')
const userPhoneModel = require('../models/L_UsersPhone')

class PhoneRecordController {
  static async addPhoneRecord(ctx)
  {
    const data=ctx.request.body
    console.log(data)
    if(data)
    {
      const result=await userPhoneModel.NewfindUserByTelorPhoneNum({tel:data.PhoneNum}) 
      console.log(result)
      let PhoneInfo={}
      // if(result)
      // {
      // PhoneInfo.UserName=result.UserName||'陌生来电'
      // PhoneInfo.UJob=result.UJOB||''
      // PhoneInfo.DepName=result['ResferecDep.Abbreviation']||''
      // }
      
      if(!result)
      {
      PhoneInfo.UserName='陌生电话'
      PhoneInfo.UJob=''
      PhoneInfo.DepName=''
      // PhoneInfo.PhoneNum=data.PhoneNum   
      // PhoneInfo.status=data.status
      // PhoneInfo.Intime=data.Intime
      // PhoneInfo.recordUrl=data.recordUrl          
      // PhoneInfo.DepID=data.DepID       
      }
      else
      {
        PhoneInfo.UserName=result.UserName
        PhoneInfo.UJob=result.UJOB
        PhoneInfo.DepName=result['ResferecDep.Abbreviation']
      }
      console.log(Object.assign(data,PhoneInfo))
      // else
      // {

      // }
      const res=await PhonerecordModel.createPhoneRecored(Object.assign(data,PhoneInfo))
      if(res)
        {
          ctx.body={
            code:1,
            res
        }  
        }
    }
    else
    {
      ctx.body={
          code:-1,
          msg:'参数错误'
      }
    }
   
      
    // if(data)
    // {
    //   const res=await PhonerecordModel.createPhoneRecored(data)
    //   if(res)
    //   {
    //     ctx.body={
    //       code:1,
    //       res
    //   }  
    //   }
    //   else
    //   {
    //     ctx.body={
    //       code:-1,          
    //   }   
    //   }
    // }
    
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