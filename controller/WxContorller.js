class UserPhoneController {
  static async GettokenCode(ctx)
  {
    const data=ctx.request.query
    ctx.body={
        data
    }  
  }
}

module.exports = UserPhoneController