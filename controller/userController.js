const userModel = require('../models/userModels')
const jwt = require('jsonwebtoken')
const secret = require('../config/secret.json')
const bcrypt = require('bcryptjs')
const RolesModel = require('../models/L_RolesModels')
const PermissionModel = require('../models/L_PermissionModels')
const DepModel = require('../models/L_DepModels')
const DepMemberModel = require('../models/L_DepMemberModels')

class UserController {

  /**
   * 登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async myLogin (ctx)
  {
          //  const data=ctx.request.body 
          const data=ctx.request.query;
          console.log(data);
          // if(data.captcha!=ctx.session.vv)
          // {
          //   ctx.body={
          //     code:-1
          //   }
          // }
          // else
          if(data.phone && data.certificateNum)
          {
           const Admin=await userModel.findAdminByIDcard(data);
           console.log(Admin);
           if(Admin.Isadmin)
           {
            //可以登录了清除session
             const userToken = {
               name: Admin.res.AdminName,
               AdminID: Admin.res.AdminID
             }
             const token = jwt.sign(userToken, secret.sign, {expiresIn: '24h'})  // 签发token
           //  console.log(token)
           ctx.body={
               username:Admin.res.AdminName,
               token:token,
               message:'登陆成功',
               code:1,
               userinfo:Admin.res                           
             }
           }
           else
           {
             ctx.body={
               message:'该用户不是管理员，如需申请请喝系统管理员联系。'
             }
           }
          
            // ctx.body={
            //   code:1,
            //   msg:'可以的手机号正常'
            // }
          }
          else if(data.mobile)        
          {
            if(data.captcha!=ctx.cookies.get('vv'))
            {
              //如果验证码错误返回 验证码失效字样
              ctx.body={
                message:'验证码失效',
                code:-1
              }
            }
            else
            {//验证码有效并且正确就进入登陆流程
            const Admin=await userModel.findAdminByPhone(data);
              if(Admin.Isadmin)
              {
              
                 ctx.session.vv=""//可以登录了清除session
                const userToken = {
                  name: Admin.res.AdminName,
                  AdminID: Admin.res.AdminID
                }
                const token = jwt.sign(userToken, secret.sign, {expiresIn: '24h'})  // 签发token
              //  console.log(token)
              // ctx.session.token=token;
              ctx.body={
                  username:Admin.res.AdminName,
                  token:token,
                  message:'登陆成功',
                  code:1,
                  userinfo:Admin.res,                              
                }
              }
            }
            
          }
           else if(data.username)
          {
        const user = await userModel.findUserByName(data.username) 
        console.log(user);
         if (user)
         {
             if (data.password===user.dataValues.AdminPassword)
             {
                const userToken = {
                    name: user.AdminName,
                    AdminID: user.AdminID
                  }
                  const token = jwt.sign(userToken, secret.sign, {expiresIn: '2h'})  // 签发token
                //  console.log(token)
                ctx.body={
                    username:user.AdminName,
                    token:token,
                    message:'登陆成功',
                    code:1,
                    userinfo:user,
                    user
                   
                }
             }
             else
             {
                ctx.body={
                    message:'登陆失败，用户名密码错误',
                    code:-1
                }
                 console.log('登陆失败')
             }
         }
         else
         {
             ctx.body={
                message:'该用户名不存在',
                code:-1
             }
             console.log('该用户名不存在')
         }
        //  console.log(user)
        //  ctx.body=user.dataValues
      }

  }
  static async GetallAdminlist(ctx)
  {
     //  console.log(ctx.request.query)
     const res=ctx.request.query
     //   console.log(res)
        const pageNo=res.pageNo
      //  console.log(pageNo)
        const pageSize=res.pageSize
         const offset=(pageNo-1) * pageSize
       // console.log(typeof(offset))
    const limit=pageSize * 1
    const Adminlist=await userModel.GetallAdmin({offset:offset,limit: limit })
    const result={
      pageNo:pageNo*1,
      pageSize:pageSize*1,
      data:Adminlist.rows,
      totalCount:Adminlist.count,
      totalPage:parseInt(Adminlist.count/pageSize)
                  }
                  ctx.body={
                    result:result
                 }
             
   
  }
  static async postLogin (ctx) {
    const data = ctx.request.body
    const user = await userModel.findUserByName(data.name)  // 查询用户
    // 判断用户是否存在
    if (user) {
      // 判断前端传递的用户密码是否与数据库密码一致
      if (bcrypt.compareSync(data.password, user.password)) {
        // 用户token
        const userToken = {
          name: user.name,
          id: user.id
        }
        const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'})  // 签发token
        ctx.body = {
          message: '成功',
          bean: {
            token
          },
          code: 1
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户名或密码错误'
        }
      }
    } else {
      ctx.body = {
        code: -1,
        message: '用户名不存在'
      }
    }
  }

  /**
   * 创建用户
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createUser (ctx) {
    const user = ctx.request.body
    if (user.password && user.name) {
      const existUser = await userModel.findUserByName(user.name)
      if (existUser) {
        ctx.body = {
          code: -1,
          message: '用户名已经存在'
        }
      } else {
        // 密码加密
        const salt = bcrypt.genSaltSync()
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        await userModel.createUser(user)
        const newUser = await userModel.findUserByName(user.name)

        // 签发token
        const userToken = {
          name: newUser.name,
          id: newUser.id
        }
        const token = jwt.sign(userToken, secret.sign, {expiresIn: '1h'})

        ctx.body = {
          code: 1,
          message: '创建成功',
          bean: {
            token
          }
        }
      }
    } else {
      ctx.body = {
        code: -1,
        message: '参数错误'
      }
    }
  }
  /**
   * 
   * @param {ID} ctx 
   * @return true or false{Promise.<void>}
   * 
   */
  static async UpdataAdminRolesByID(ctx)
      {
      //  console.log(ctx.request.body)
        let param=ctx.request.body
       console.log(param)
       const res=await userModel.UpdataAdminRolesbyID(param)
       console.log(res)
          if(res==1)
          {
            ctx.body={
              code:1,
              message:'修改成功'
            }
          }
            else
            {
              ctx.body={
                    code:-1,
                    message:'修改失败'
              }
            }
      }
      static async GetDepTreeList(ctx)
      {
         
           let Permissionarr=[]
           const res=ctx.request.query      
           const pageNo=res.pageNo       
           const pageSize=res.pageSize
           const offset=(pageNo-1) * pageSize   
           const limit=pageSize * 1
           const infor=[];
           const deps=[];
           const Permissionlist=await PermissionModel.findPermissIsshow({status:1, offset:offset,limit: limit })        
           for(let x in Permissionlist.rows)
           {
            // console.log(Permissionlist.rows[x].Permission_key)    
            const obj=new Object();               
            const _DepArr=[]  
            // console.log(r[i])
             const Permissioninfo=await PermissionModel.findIDByPermissionName(Permissionlist.rows[x].Permission_key)  
           infor.push(Permissioninfo);
             const DEPlist=await DepModel.selectAll_DepartmentByPermission_Key(Permissioninfo.dataValues.Permission_key,Permissioninfo.dataValues.OrderID)
            deps.push(DEPlist);
             DEPlist.rows.forEach(v => {
               console.log(v)
                const objDep=new Object() 
                objDep.DepartmentName=v.DepartmentName
                objDep.key=v.DepartmentId
                obj.icon=""
                objDep.Permission_Key=v.Permission_Key
                objDep.UploadDir=v.UploadDir
                objDep.title=v.Abbreviation
                objDep.Priority=v.Priority                
                  // console.log(v.DepartmentName)
                  _DepArr.push(objDep)               
              });
            // console.log(Permissioninfo)
            // console.log(_DepArr)
          
              obj.key=Permissioninfo.dataValues.Permission_key
              obj.icon=""
              obj.ddd="1111"
              obj.description=Permissioninfo.dataValues.description
              obj.title=Permissioninfo.dataValues.Permission_name
              obj.OrderID=Permissioninfo.dataValues.OrderID
              obj.children=_DepArr
              Permissionarr.push(obj)  
           }         
           ctx.body={
             result:Permissionarr,
             infor,
             deps,
             Permissionlist
           }
      }
    
      
      static async GetPermissionAndDeplist(ctx)
      {
         
           let Permissionarr=[]
           const res=ctx.request.query      
           const pageNo=res.pageNo       
           const pageSize=res.pageSize
           const offset=(pageNo-1) * pageSize   
           const limit=pageSize * 1
           const Permissionlist=await PermissionModel.findPermiss({status:1, offset:offset,limit: limit }) 
        
          //  console.log(Pesrmissionlist.rows);       
           for(let x in Permissionlist.rows)
           {
            // console.log(Permissionlist.rows[x].Permission_key)    
            const obj=new Object();               
            const _DepArr=[]  
            // console.log(r[i])
             const Permissioninfo=await PermissionModel.findIDByPermissionName(Permissionlist.rows[x].Permission_key)  
             console.log(Permissioninfo)  
           
             const DEPlist=await DepModel.selectAll_DepartmentByPermission_Key(Permissioninfo.dataValues.Permission_key,Permissioninfo.dataValues.OrderID)
         
             DEPlist.rows.forEach(v => {
              //  console.log(v)
                const objDep=new Object() 
                objDep.DepartmentName=v.DepartmentName
                objDep.DepartmentId=v.DepartmentId
                objDep.Permission_Key=v.Permission_Key
                objDep.UploadDir=v.UploadDir
                objDep.Abbreviation=v.Abbreviation
                objDep.Priority=v.Priority                
                  // console.log(v.DepartmentName)
                  _DepArr.push(objDep)               
              });
            // console.log(Permissioninfo)
            // console.log(_DepArr)
            obj.Permission_key=Permissioninfo.dataValues.Permission_key
            obj.description=Permissioninfo.dataValues.description
            obj.Permission_name=Permissioninfo.dataValues.Permission_name
            obj.OrderID=Permissioninfo.dataValues.OrderID
            obj.children=_DepArr
            Permissionarr.push(obj)
           }         
           ctx.body={
             result:Permissionarr
        
           }
      }

   static async GetRouteByAdminID(ctx)
      {
        let id=ctx.request.query.AdminID
        console.log(id)
        const User=await userModel.findUserByAminID(id)
        console.log(User)
        let s=''
        let _temp=''
        let _PermissArr    
      
        const roleid=User.dataValues.RolesID
        let _arr=roleid.split("|")
        console.log(_arr)
        let Permissionarr=[]
          for(let x in _arr)
          {           
          
           let res=await  RolesModel.findroleByRoleid(_arr[x]) 
       
          
           _temp=res.dataValues.PremissionValue
          //  console.log(_temp)
           s+=_temp+'|'
          //  console.log(res.dataValues.PremissionValue)
          }
          _PermissArr= s.split("|")
          console.log(`----------`)
           console.log(_PermissArr)
          var r = _PermissArr.filter(function(element,index,self){//数组去重         
            return self.indexOf(element) === index && element //去无效属性
         })   
         console.log(r)      
         console.log(`----------`)
        const DepMember=await DepMemberModel.GetDepmemberByAdminID(id)    
        console.log(DepMember.rows)  
         for(let i in r)
         {
          const obj=new Object();
          obj.AdminID=id
          // console.log(r[i])
           const Permissioninfo=await PermissionModel.findIDByPermissionName(r[i]) 
           console.log(Permissioninfo)   
          // console.log(Permissioninfo)   
          // const Deplist=await DepModel.selectAll_DepartmentByPermission_Key(Permissioninfo.dataValues.Permission_key)
          obj.Permission_key=Permissioninfo.dataValues.Permission_key
          obj.Permission_name=Permissioninfo.dataValues.Permission_name
          let _arr=[]
             DepMember.rows.forEach(async v => {                   
            if(v.Permission_key==Permissioninfo.dataValues.Permission_key &&!v.DepartmentId)
            {          
              obj.EnableViewer=v.EnableViewer
              obj.EnableEditer=v.EnableEditer      
              // let depinfo=await DepModel.findOne_DepartmentByDepartmentID(v.DepartmentId)              
            }else if(v.Permission_key==Permissioninfo.dataValues.Permission_key &&v.DepartmentId)
            {
            
              let depinfo=await DepModel.findOne_DepartmentByDepartmentID(v.DepartmentId)
              depinfo.dataValues.EnableViewer=v.EnableViewer
              depinfo.dataValues.EnableEditer=v.EnableEditer   
              console.log(depinfo)
              _arr.push(depinfo)
              obj.children=_arr
            }
          })
          Permissionarr.push(obj)
        }
        ctx.body={
                  result:Permissionarr
              }          
      }

  /**
   * 获取用户信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async GetUserName (ctx) {
      
    //console.log(ctx)
  
     let id=ctx.request.query.AdminID
    // const user = ctx.user
    // const newUser = await userModel.findUserByAminID(id)
  
    const User=await userModel.findUserByAminID(id)
    console.log(User.dataValues)

    const userInfo={
      SendsmsList:[],
      name:User.dataValues.AdminName,
      id:User.dataValues.AdminID,      
      rolesid:User.dataValues.RolesID,
      token:'null'
    }
      if(User)
      {
        ctx.body={
          result:userInfo,
          code:1,
          message:'查询成功'
        }
      }
      else
      {
        ctx.body={
          code: -1,
          message: '获取用户信息失败'
        }
      }
    
    //console.log(ctx.request)
    // if (user) {
    //   ctx.body = {
    //     code: 1,
    //     message: '成功',
    //     user
    //   }
    // } else {
    //   ctx.body = {
    //     code: -1,
    //     message: '获取用户信息失败'
    //   }
    // }

  }
}

module.exports = UserController

