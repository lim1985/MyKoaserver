const jwt = require('jsonwebtoken')
const secret = require('../config/secret.json')
const util = require('util')
const verify = util.promisify(jwt.verify)

/**
 * 判断token是否可用
 */
module.exports = function () {
  return async function (ctx, next) {
    try {
      const token = ctx.header.authorization
      console.log(token)
    // 获取jwt
      if(ctx.method=='OPTIONS')
      {
        ctx.response.status=200
      }else     
      if(token) {
        let payload
        try {
          console.log('打印token')
          console.log(token)
       
          payload = await verify(token.split(' ')[1], secret.sign)  // 解密payload，获取用户名和ID
          console.log(payload)
          ctx.body = {
            payload
          }
        } catch (err) {
          console.log('token verify fail: ', err)
        }
      }
      
      console.log(`token: ${token}`)

      await next()
     
    } catch (err) {
      if (err.status === 401) {
        ctx.body = {
          code: -1,
          message: '认证失败'
        }

      
      } else {
        err.status = 404
        ctx.body = '404'
        console.log('不服就是怼：', err)
      }
    }
  }
}
