const db = require('../config/db')
const gov = db.gov
const usertoken = gov.import('../schema/LIM_user_token.js')

class TokenModel {
  /**
   * 查询token信息
   * @param token  姓名
   * @returns {Promise.<*>}
   */
  static async getTokenByToken (token) {
    const Usertoken = await usertoken.findOne({
      where: {
        token
      }
    })
    return Usertoken
  }

  /**
   * 创建用户
   * @param token
   * @returns {Promise.<boolean>}
   */
  static async createToken (r) {
    await usertoken.create({
      'Adminid': r.Adminid,
      'token': r.token,
      'expire': r.expire
    })
    return true
  }
}

module.exports = TokenModel
