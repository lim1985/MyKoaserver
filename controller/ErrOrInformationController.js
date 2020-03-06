const ErrorInformationModel = require('../models/L_Errorinformation')

// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class ErrorInformationController {
  
    static async submitErrorInfo(ctx)
    {
        const res=ctx.request.query
        let result = await ErrorInformationModel.Add(res)
        
        ctx.body={
            result
        }
    } 
    static async SelectErrorInfo(ctx)
    {
        const res=ctx.request.query
        let result = await ErrorInformationModel.Select(res);
        ctx.body={
            result
        }
    }
    static async UpdateErrorInfo(ctx)
    {
        const res=ctx.request.query
        let result= await ErrorInformationModel.Update(res);
        ctx.body={
            result
        }
    }
}

module.exports = ErrorInformationController

