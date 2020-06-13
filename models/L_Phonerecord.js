const db = require('../config/db')
const gov = db.gov
const Phonerecord = gov.import('../schema/LIM_Phonerecord.js')


class PhonerecordModel {
  /**
   * @param create
   */
   static async createPhoneRecored(record)
   {
     console.log(record)
     if(!record.PhoneNum)
     {
       return false
     }
     const result=await Phonerecord.create(record)
     if(result.ID)
     {
       return true
     }
   }

   /**
    * @param select by depID
    */
   static async getRecoredListByDepID(data)
   {
     const result=await Phonerecord.findAndCount({
       where:{
         DepID:data.DepID
       },
       order:[
        ['ID', 'DESC'],],  
     })
     return result
   }
  /**
   * 查询token信息
   * @param token  姓名
   * @returns {Promise.<*>}
   */
  // static async getTokenByToken (token) {
  //   const Usertoken = await usertoken.findOne({
  //     where: {
  //       token
  //     }
  //   })
  //   return Usertoken
  // }

  // /**
  //  * 创建用户
  //  * @param token
  //  * @returns {Promise.<boolean>}
  //  */
  // static async createToken (r) {
  //   await usertoken.create({
  //     'Adminid': r.Adminid,
  //     'token': r.token,
  //     'expire': r.expire
  //   })
  //   return true
  // }
}

module.exports = PhonerecordModel
