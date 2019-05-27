const AdminRolesModel = require('../models/L_AdminRoles')
const userModel = require('../models/userModels')
const RolesModel = require('../models/L_RolesModels')
const PermissionModel = require('../models/L_PermissionModels')
const DepModel = require('../models/L_DepModels')
// const jwt = require('jsonwebtoken')
// const secret = require('../config/secret.json')
// const bcrypt = require('bcryptjs')

class RolesController {
  
 static async GetroleslistbyAdminID(ctx)
 {
    const iid=ctx.request.query.AdminID
    const userinfo=await userModel.findUserByAminID(iid)
    // console.log(userinfo)
    if(!userinfo)
    {
        ctx.body={
                    code:-1
                }
    }
    else
    {
        const roles= userinfo.dataValues.RolesID.split('|')
        console.log(roles)
        ctx.body={
            code:1,
            roles:roles
        }
   }
 }
/**
 * 
 * @param {adminID} ctx 
 * return {Promise}
 */
static async GetAdminRolesPermissionDepID(ctx)
{
    const iid=ctx.request.query.AdminID
    const permissions=[]
      let PermissList={}
    const PermissionList=[]
    const userinfo=await userModel.findUserByAminID(iid)
    const roles= userinfo.dataValues.RolesID.split('|')
    const _arr=[]   
    for (let i in roles)
    {   
        let _PermissionsArr=await PermissionModel.SelectByRoleID(roles[i]) 
              
                    for(let x in _PermissionsArr)
                    {
                         let obj=new Object();
                         obj.DepID=_PermissionsArr[x].DepID,
                         obj.IsEdit=_PermissionsArr[x].IsEdit,
                         obj.IsParent=_PermissionsArr[x].IsParent,
                         obj.IsView=_PermissionsArr[x].IsView,
                         obj.RoleID=_PermissionsArr[x].RoleID,
                         obj.value=_PermissionsArr[x].PermissionKey
                         obj.label=_PermissionsArr[x].Permission_name                       
                        if(_PermissionsArr[x].IsParent)
                        {
                            let _depArr=await DepModel.selectAll_DepartmentByPermission_Key(_PermissionsArr[x].PermissionKey,_PermissionsArr[x].RoleID)                              
                            obj.actionOptions=_depArr.rows
                        }                    
                            let _permissArr=await  PermissionModel.findIDByPermissionName(_PermissionsArr[x].PermissionKey)
                            let _DepList= await DepModel.select_DepartmentByUploadDir(_PermissionsArr[x].PermissionKey)
                            obj.label=_permissArr.Permission_name
                            if(_permissArr)
                            {
                                obj.label=_permissArr.Permission_name
                            } else if (_DepList)
                            {
                                obj.label=_DepList.DepartmentName  
                            }
                        _arr.push(obj)    
                    }  
    }
   
     _arr.forEach(v => {
        // PermissionList.push(v)
            if(v.IsView && v.IsParent)
            {
                PermissionList.push(v.value)  
                v.actionOptions.forEach(s=>{   
                    if(s.IsView)
                    {
                        PermissionList.push(s.UploadDir)
                    }      
                })                            
            }     
        });
        var r = PermissionList.filter(function(e,index,self){//数组去重
            return self.indexOf(e) === index;
         });
          
         for(let x in r)
         {
             let _obj=new Object();
             let PermissList= await PermissionModel.findIDByPermissionName(r[x].toString())
             let DepList= await DepModel.select_DepartmentByUploadDir(r[x].toString())
                if(PermissList)
                {
                    _obj.roleId=roles[0],
                    _obj.permissionId=PermissList.Permission_key,
                    _obj.permissionName=PermissList.Permission_name,
                    _obj.actions='[{\"action\":\"add\",\"defaultCheck\":false,\"describe\":\"新增\"},{\"action\":\"query\",\"defaultCheck\":false,\"describe\":\"查询\"},{\"action\":\"get\",\"defaultCheck\":false,\"describe\":\"详情\"},{\"action\":\"update\",\"defaultCheck\":false,\"describe\":\"修改\"},{\"action\":\"delete\",\"defaultCheck\":false,\"describe\":\"删除\"}]',
                    _obj.actionEntitySet=[{
                        "action": "add",
                        "describe": "新增",
                        "defaultCheck": false
                    },
                    {
                        "action": "query",
                        "describe": "查询",
                        "defaultCheck": false
                    }]
                    permissions.push(_obj)   
                } else if(DepList)
                {
                    _obj.roleId=roles[0],
                    _obj.permissionId=DepList.UploadDir,
                    _obj.permissionName=DepList.DepartmentName,
                    _obj.actions='[{\"action\":\"add\",\"defaultCheck\":false,\"describe\":\"新增\"},{\"action\":\"query\",\"defaultCheck\":false,\"describe\":\"查询\"},{\"action\":\"get\",\"defaultCheck\":false,\"describe\":\"详情\"},{\"action\":\"update\",\"defaultCheck\":false,\"describe\":\"修改\"},{\"action\":\"delete\",\"defaultCheck\":false,\"describe\":\"删除\"}]',
                    _obj.actionEntitySet=[{
                        "action": "add",
                        "describe": "新增",
                        "defaultCheck": false
                    },
                    {
                        "action": "query",
                        "describe": "查询",
                        "defaultCheck": false
                    }]
                    permissions.push(_obj)  
                }     
         }
         const roleslist={}
         for (let x in roles)
         {
             const _temproles=await RolesModel.findroleByRoleid(roles[x])
             roleslist.id=_temproles.dataValues.roleid
             roleslist.name=_temproles.dataValues.rolevalue
             roleslist.describe=_temproles.dataValues.roledescription
             roleslist.status=_temproles.dataValues.static
             roleslist.creatorId=_temproles.dataValues.rolekey
             roleslist.createTime=_temproles.dataValues.addtime
             roleslist.permissionList=r
             roleslist.permissions=permissions            
         }
         let user={
            id:userinfo.dataValues.AdminID,
            name:userinfo.dataValues.AdminName,
            username:userinfo.dataValues.UserName,
            password:'',
            avatar: "/avatar2.jpg",
            status: userinfo.dataValues.IsLock? 1:0,
            telephone: "",
            lastLoginIp:userinfo.dataValues.LastLoginIP,
            lastLoginTime:userinfo.dataValues.LastLoginTime,
            LastLogoutTime:userinfo.dataValues.LastLogoutTime,
            merchantCode:userinfo.dataValues.Hash,
            deleted: 0,
            roleId: userinfo.dataValues.UserName,
            role:roleslist,
            createTime: 1497160610259,
            creatorId: "admin"
  
        }
 

    ctx.body={
        message:'',
        result:user,
        status: 200,
        timestamp: 1534844188679
    } 
}


 /**
   * 获取管理员角色和权限
   * @param admin
   * @returns {Promise.<boolean>}
   */
  static async GetAdminRolesPermission (ctx) {
  
        //console.log(ctx.request.query.AdminID)
        const iid=ctx.request.query.AdminID
        const permissions=[]
        const Permissvalue=''
        let PermissList={}
        //console.log(iid)
        const userinfo=await userModel.findUserByAminID(iid)
        const roles= userinfo.dataValues.RolesID.split('|')
        console.log(roles)
        let roleID=''
           // console.log(roles)
        // const result= await PermissionModel.findIDByPermissionName('QW')
        // console.log(result.dataValues)
            let s=''
            for (let i in roles)
            {               
             const arr=await RolesModel.findroleByRoleid(roles[i])               
             s=s+arr.dataValues.PremissionValue+'|'
             let role=arr.dataValues.rolekey    
             roleID=role      
            }           
            var _arr=s.split('|')
            for(let i in _arr)//数组去无值元素
            {
                if(_arr[i]==''||_arr[i]==undefined)
                {
                    _arr.splice(i,1);
                }
            }
            var r = _arr.filter(function(e,index,self){//数组去重
                   return self.indexOf(e) === index;
                });
              
                
            for(let x in r)
            {
                let result= await PermissionModel.findIDByPermissionName(r[x].toString())
              //  console.log(result.dataValues)
                 PermissList={
                    roleId:roleID,
                    permissionId:result.dataValues.Permission_key,
                    permissionName:result.dataValues.Permission_name,
                    actions:'[{\"action\":\"add\",\"defaultCheck\":false,\"describe\":\"新增\"},{\"action\":\"query\",\"defaultCheck\":false,\"describe\":\"查询\"},{\"action\":\"get\",\"defaultCheck\":false,\"describe\":\"详情\"},{\"action\":\"update\",\"defaultCheck\":false,\"describe\":\"修改\"},{\"action\":\"delete\",\"defaultCheck\":false,\"describe\":\"删除\"}]',
                    actionEntitySet:[{
                        "action": "add",
                        "describe": "新增",
                        "defaultCheck": false
                    },
                    {
                        "action": "query",
                        "describe": "查询",
                        "defaultCheck": false
                    },
                    {
                        "action": "get",
                        "describe": "详情",
                        "defaultCheck": false
                    },
                    {
                        "action": "update",
                        "describe": "修改",
                        "defaultCheck": false
                    },
                    {
                        "action": "delete",
                        "describe": "删除",
                        "defaultCheck": false
                    }
                ],
                actionList: null,
                dataAccess: null

                }            
                permissions.push(PermissList)    
               
            }
              
        const roleslist={}
        for (let x in roles)
        {
            const _temproles=await RolesModel.findroleByRoleid(roles[x])
            roleslist.id=_temproles.dataValues.roleid
            roleslist.name=_temproles.dataValues.rolevalue
            roleslist.describe=_temproles.dataValues.roledescription
            roleslist.status=_temproles.dataValues.static
            roleslist.creatorId=_temproles.dataValues.rolekey
            roleslist.createTime=_temproles.dataValues.addtime
            roleslist.permissionList=r
            roleslist.permissions=permissions
           
        }

      
     console.log(roleslist)
       console.log(userinfo.dataValues)
        // userinfo.dataValues.AdminPassword=''
      
        // userinfo.dataValues.role=roleslist
      let user={
          id:userinfo.dataValues.AdminID,
          name:userinfo.dataValues.AdminName,
          username:userinfo.dataValues.UserName,
          password:'',
          avatar: "/avatar2.jpg",
          status: userinfo.dataValues.IsLock? 1:0,
          telephone: "",
          lastLoginIp:userinfo.dataValues.LastLoginIP,
          lastLoginTime:userinfo.dataValues.LastLoginTime,
          LastLogoutTime:userinfo.dataValues.LastLogoutTime,
          merchantCode:userinfo.dataValues.Hash,
          deleted: 0,
          roleId: userinfo.dataValues.UserName,
          role:roleslist,
          createTime: 1497160610259,
          creatorId: "admin"

      }
       
     //  console.log(roles)
          
        ctx.body={
            message:'',
            result:user,
            status: 200,
            timestamp: 1534844188679
        }
      
  
}

    /**
     * 
     * @param ctx 
     * @returns {true}
     */
    static async addAdminRoles(ctx)
    {
        if (AdminRolesModel.dbasync())
        {
            const addRolesStatus= await AdminRolesModel.createAdminRoles(ctx.request.query)
       
            if (addRolesStatus)
            {
                ctx.body={
                    code:1,
                    message:'添加管理员权限成功！'
                }
            }
            else
            {   
                ctx.body={
                    code:-1,
                    message:'添加管理员权限失败！'
                }
            }
            const data =ctx.request.query           
            // const user = await RolesModel.findUserByName(data.username)           
            console.log(data)
        }    
    }


 
}

module.exports = RolesController

