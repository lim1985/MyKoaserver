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
  
 static groupifyWithArray(arr) {
    let ret = {};
    // 先把父节点与子节点分开
    let parents = [];
    let subs = [];
    arr.forEach(function (item){
        let key = item.Permission_key;
        if (item.IsParent) {
            ret[key] = item;
            item.children = [];
            parents.push(item);
        } else {
            subs.push(item);
        }
    });
    // 遍历子，放到相应的父节点中
    subs.forEach(function (item){
        let key = item.Permission_key;
        let parent = ret[key];
        if (parent) {
            parent.children.push(item);
        }
    });

    return parents;
}
static groupifyWithArrayAndQC(arr) {
    let ret = {};
    let qsub = {};
    // 先把父节点与子节点分开
    let parents = [];
    let subs = [];
    arr.forEach(function (item){
        let key = item.Permission_key;
        if (item.IsParent) {
            if (ret[key]) {
                return;
            }
            ret[key] = item;
            item.children = [];
            parents.push(item);
        } else {
            subs.push(item);
        }
    });
    // 遍历子，放到相应的父节点中
    subs.forEach(function (item){
        let key = item.Permission_key;
        let parent = ret[key];
        if (parent) {
            let subKey = item["Perinformation.Deps.DepartmentId"];
            if(qsub[subKey]) {
                return;
            }
            qsub[subKey] = true;
            parent.children.push(item);
        }
    });

    return parents;
}
 static async GetDynamicRoutesByAdminID(ctx)
 {
   
    const iid=ctx.request.query.AdminID
    const userinfo=await userModel.findUserByAminID(iid)
    console.log(userinfo);
    let asyncroutes={}
    let  DyNamicRoutes= {
        path: '/',
        name: 'index',
        component: 'BasicLayout',
        meta: { title: '首页' },
        redirect: '/views',
        children:[ {
            path: '/views',
            redirect: '/views/DepTreelist',
            name: 'Deptongxunlu',    
            meta: { title: '大祥区通讯录', icon: 'dashboard' },
            component: 'PageView',
            children:[
              {
                name: 'DepList',   
                path: '/views/DepTreelist',
                component:'TreeList',
                // component: () => import('@/views/other/TreeList'),
                meta: { title: '部门列表' }
              },
            ]  
          },             
         ] 
    }
    if(!userinfo.RolesID)//如果没有权限，就返回不带权限的默认路由表
    {
        ctx.body={
            DyNamicRoutes
        }
        return 
    }
    let roles=userinfo.RolesID.split("|")
    console.log(roles);
    let _routes=await PermissionModel.GetDynamicRoutes(roles)//根据不同权限返回管理节点栏目
    let _arr=[]
    let Permission_Key
    let _Arrchilds=[]    
    _Arrchilds= RolesController.groupifyWithArrayAndQC(_routes)//进行分组去重
    _Arrchilds.forEach(v=>{
        let _routesObj=new Object();
        let _subroutes=[]
        if(v.IsParent)
        {
            _routesObj={
                path:'/list/'+v.Permission_key,
                name:v.Permission_key,
                // redirect: {name:'Phonelist_'+v.Permission_key},
                component: 'PageView',
                meta: { title: v.Permission_name, icon: 'dashboard', permission: [ v.Permission_key ] },                
            } 
            if(v.children)
            {
                v.children.forEach(sub=>{
                let _subroutesObj={}
                if(v.children.length>1)//有子元素的情况下
                {                 
              
                     _subroutesObj={
                        path:'/list/'+sub['Perinformation.Deps.UploadDir'],
                        component:'RouteView',
                        name: sub['Perinformation.Deps.UploadDir'],
                        redirect: {name:'Phonelist_'+sub['Perinformation.Deps.UploadDir']},
                        meta: { title: sub['Perinformation.Deps.DepartmentName'], permission: [ sub['Perinformation.Deps.UploadDir'] ] },
                        children:[
                            {                 
                            path: '/list/UserPhonelist/'+sub['Perinformation.Deps.DepartmentId'],
                            name: 'Phonelist_'+ sub['Perinformation.Deps.UploadDir'],
                            component:'TableList',
                            meta: { icon: 'solution' ,title: '通信录', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            },
                            {
                            path: '/list/CustomGroup/'+sub['Perinformation.Deps.DepartmentId'],          
                            name: 'CustomGroup_'+ sub['Perinformation.Deps.UploadDir'],
                            component:'Cusomgroup',
                            meta: { icon: 'team' ,title: '自定义组', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            },
                            {
                            path: '/list/smsrecord/'+sub['Perinformation.Deps.DepartmentId'],          
                            name: 'Smsrecord_'+ sub['Perinformation.Deps.UploadDir'],
                            component:'smsrecord',
                            meta: { icon: 'mail' , title: '短信信箱', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            } ,
                            {
                                path: '/list/phonerecord_/'+sub['Perinformation.Deps.DepartmentId'],          
                                name: 'phonerecord_'+ sub['Perinformation.Deps.UploadDir'],
                                component:'phonerecord',
                                meta: { icon: 'phone' , title: '电话记录', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            }                          
                        ]
                    }
                        if(sub['Perinformation.Deps.DepartmentId']==84)//乡镇系统的栏目节点
                        {
                            let yqdata=
                            {
                                path: '/list/meeting/'+sub['Perinformation.Deps.DepartmentId'],          
                                name: 'meeting_'+ sub['Perinformation.Deps.UploadDir'],
                                component:'meeting',
                                meta: { title: '会议管理', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            }
                            _subroutesObj.children.push(yqdata)
                        }
                         if(sub.Permission_key=='QXZ_XT')//乡镇系统的栏目节点
                        {
                            let yqdata=
                            {
                                path: '/list/yqdata/'+sub['Perinformation.Deps.DepartmentId'],          
                                name: 'yqdata_'+ sub['Perinformation.Deps.UploadDir'],
                                component:'yqdata',
                                meta: { title: '人员数据审核', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            }
                            _subroutesObj.children.push(yqdata)
                        }
                    _subroutes.push(_subroutesObj)     
                }
                
                            // {
                            //     path: '/list/yqdata/'+sub['Perinformation.Deps.DepartmentId'],          
                            //     name: 'yqdata_'+ sub['Perinformation.Deps.UploadDir'],
                            //     component:'yqdata',
                            //     meta: { title: '人员数据', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            // } 
               
                else
                {
                    // cmccSendSms: () => import('@/views/list/modules/sendSMS/cmccSendSms.vue'),
                    // DepartmentManager: () => import('@/views/list/Department.vue'),
                    // UploadUserlist: () => import('@/views/list/UploadUserlist.vue'),
                    // UserList: () => import('@/views/list/UserList.vue'),
                    // RoleList: () => import('@/views/list/RoleList.vue'),
                    // PermissionList: () => import('@/views/list/PermissionList.vue'),
                 
                    if(sub.Permission_key=='Admin' && sub.DepID==159)
                    {
                        _subroutes= [
                            {      
                                path: '/Search/GlobalSearch',
                                name: 'GlobalSearch',
                                component: 'GlobalSearch',
                                meta: { title: '全局搜索' , permission: [ 'Admin' ] }
                          },
                            {      
                                  path: '/CMCCSend/send',
                                  name: 'CMCCSend',
                                  component: 'cmccSendSms',
                                  meta: { title: '移动发短信' , permission: [ 'Admin' ] }
                            },
                            {
                              path: '/Department/manager',
                              name: 'Department',
                              component: 'DepartmentManager',
                              meta: { title: '部门管理', permission: [ 'Admin' ] }
                            },
                            {
                              path: '/list/uploadUserlist',
                              name: 'UploadUserlist',
                              component: 'UploadUserlist',
                              meta: { title: '联系人批量导入', permission: [ 'Admin' ] }
                            },
                            // {
                            //   path: '/list/old-permission',
                            //   name: 'old-permission',
                            //   component: () => import('@/views/list/oldPermissionList'),
                            //   meta: { title: '原版权限管理', permission: [ 'Admin' ] }
                            // },
                            {
                              path: '/list/user-list',
                              name: 'UserList',
                              component: 'UserList',
                              meta: { title: '管理员管理', permission: [ 'Admin' ] }
                            },
                            {
                              path: '/list/role-list',
                              name: 'RoleList',
                              component: 'RoleList',
                              meta: { title: '角色管理', permission: [ 'Admin' ] }
                            },
                            {
                              path: '/list/permission-list',
                              name: 'PermissionList',
                              component: 'PermissionList',
                              meta: { title: '部门类别管理', permission: [ 'Admin' ] }
                            },
                            {
                              path: '/list/jiucuo',
                              name: 'jiucuo',
                              component: 'jiucuoList',
                              meta: { title: '纠错信息管理', permission: [ 'Admin' ] }
                             },
                          ]
                          return 
                    }

                    _subroutes= [
                        {
                          path: '/list/UserPhonelist/'+sub['Perinformation.Deps.DepartmentId'],          
                          name: 'Phonelist_'+ sub['Perinformation.Deps.UploadDir'] ,
                          // component: () => import('@/views/list/UserPhonelist'),
                          component:'TableList',
                          meta: { icon: 'solution',title: '通信录', permission: [  sub['Perinformation.Deps.UploadDir']  ] }
                        },
                        {
                          path: '/list/CustomGroup/'+sub['Perinformation.Deps.DepartmentId'],          
                          name: 'CustomGroup_'+sub['Perinformation.Deps.UploadDir'],                          
                          component:'Cusomgroup',
                          // component: () => import('@/views/other/customgroup'),
                          meta: {icon: 'team' , title: '自定义组', permission: [   sub['Perinformation.Deps.UploadDir']] }
                        },
                        {
                        path: '/list/smsrecord/'+sub['Perinformation.Deps.DepartmentId'],          
                        name: 'Smsrecord_'+ sub['Perinformation.Deps.UploadDir'],
                        component:'smsrecord',
                        meta: {icon: 'mail' , title: '短信信箱', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                        },
                        {
                            path: '/list/phonerecord_/'+sub['Perinformation.Deps.DepartmentId'],          
                            name: 'phonerecord_'+ sub['Perinformation.Deps.UploadDir'],
                            component:'phonerecord',
                            meta: { icon: 'phone' , title: '电话记录', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                        }                       
                      ]
                        if(sub.Permission_key=='QXZ_XT')//乡镇系统的栏目节点
                        {
                            let yqdata=
                            {
                                path: '/list/yqdata/'+sub['Perinformation.Deps.DepartmentId'],          
                                name: 'yqdata_'+ sub['Perinformation.Deps.UploadDir'],
                                component:'yqdata',
                                meta: { title: '人员数据', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            }
                            _subroutes.push(yqdata)
                        }
                        if(sub['Perinformation.Deps.DepartmentId']==84)//乡镇系统的栏目节点
                        {
                            let meeting=
                            {
                                path: '/list/meeting/'+sub['Perinformation.Deps.DepartmentId'],          
                                name: 'meeting_'+ sub['Perinformation.Deps.UploadDir'],
                                component:'meeting',
                                meta: { title: '会议管理', permission: [  sub['Perinformation.Deps.UploadDir'] ] }
                            }
                            _subroutes.push(meeting)
                        }
                }
                   
          })
            }
            _routesObj.children=_subroutes
            // if(v.children)
            // {
            //     v.children.forEach(sub => {
            //         let _subChildren=new Object();
            //     _subChildren={
            //         path: '/list/UserPhonelist/'+sub.DepID,       
            //         name: 'Phonelist_'+',
            //         //         name: 'Phonelist_QW',
            //         //         // component: () => import('@/views/list/UserPhonelist'),
            //         //         component:TableList,
            //         //         meta: { title: '通信录', permission: [ 'QW' ] }
            //     }
            //     });
            // }
            // name: 'QW',   
            // //     redirect: {name:'Phonelist_QW'},
            // //     component: PageView,
            // //     meta: { title: '区委', icon: 'dashboard', permission: [ 'QW','edit' ] },
            _arr.push(_routesObj)
            DyNamicRoutes.children.push(_routesObj)
        }
    })
    ctx.body={
        _arr,
        DyNamicRoutes,
        _routes,
        _Arrchilds,
     
        // result,
        // Asyncroutes2
    }

//     let _arr=[]
//     let Permission_Key
//     let _Arrchilds=[]
//    for(let x in res)
//    {
//      let _obj=new Object();

//      if(res[x].IsView)
//      {        
//         let _meta=new Object();
//        _obj.Permission_key=res[x].Permission_key
//        _obj.path='/list/'+res[x].Permission_key
//        _obj.name=res[x].Permission_key         
//        _obj.Permission_name=res[x].Permission_name
//        _obj.component='PageView',
//        _meta.title=res[x].Permission_name
//        _meta.icon='dashboard'
//        _meta.permission=res[x].Permission_key
//        _obj.meta=_meta
//        Permission_Key=res[x].Permission_key         
//        if(res[x].Permission_key === Permission_Key && res[x].DepID)
//        {
     
//           let _child=new Object();
//           _child.component='RouteView'
//           _child.path='/list/'+res[x]['Perinformation.Deps.UploadDir']
//           _child.name=res[x]['Perinformation.Deps.UploadDir']
//           _child.redirect={
//             name:'Phonelist_'+res[x]['Perinformation.Deps.UploadDir']
//           }
//           _child.meta={
//             title:res[x]['Perinformation.Deps.DepartmentName'],
//             permission:[res[x]['Perinformation.Deps.UploadDir']]
//           }
//           _child.children=[
//             {
//                 path:'/list/UserPhonelist/'+res[x].DepID,
//                 name:'Phonelist_'+res[x]['Perinformation.Deps.UploadDir'],
//                 component:'TableList',
//                 meta: { title: '通信录', permission: [ res[x]['Perinformation.Deps.UploadDir']] }
//             },
//             {
//               path:'/list/CustomGroup/'+res[x].DepID,
//               name:'CustomGroup_'+res[x]['Perinformation.Deps.UploadDir'],
//               component:'Cusomgroup',
//               meta: { title: '自定义组', permission: [ res[x]['Perinformation.Deps.UploadDir'],] }
//           }]
//           _Arrchilds.push(_child)
//        }
//        _obj.children=_Arrchilds
//       //meta: { title: '区教科、卫生计生系统', icon: 'dashboard', permission: [ 'QJS_WSXT' ] },

//      }
    
//     //  for(let y in _obj)
//     //  {
//     //   if(PermissionModel.deepCompare(res[x],_obj[y]))
//     //   {
//        _arr.push(_obj)
//     //   }
//     //  }      
//    }









    // for(let x in _routes)
    // { 
    //      let obj=new Object();
    //      let arr=[]
    //      let childrenObj=new Object();
    //      if(!_routes[x].IsParent && _routes[x].DepID && _routes[x].IsView)
    //      {
    //       obj.component= 'RouteView',
    //       obj.path= '/list/'+_routes[x].PermissionKey,
    //       obj.name= _routes[x].PermissionKey,
    //       obj.redirect= {name:'Phonelist_'+_routes[x].PermissionKey},
    //       obj.meta= { title: _routes[x].Permission_name, permission: [ 'QWXZB' ] }
    //       childrenObj.path='/list/UserPhonelist/'+_routes[x].DepID
    //       childrenObj.name='Phonelist_'+_routes[x].PermissionKey
    //       childrenObj.component='TableList',
    //       childrenObj.meta= { title: '通信录', permission: [ _routes[x].PermissionKey ] }
    //       arr.push(childrenObj)
    //       obj.children=arr;
    //      }
    //      if(obj!={})
    //      {
    //          DyNamicRoutes.children.push(obj)
    //      }
        
    //      result.push(obj);
    //  }
        //  {
        //     path: '/list/QJS_WSXT',
        //     name: 'QJS_WSXT',
        //     component: PageView,
        //     meta: { title: '区教科、卫生计生系统', icon: 'dashboard', permission: [ 'QJS_WSXT' ] },
        //     children: [
        //       {
        //         component: RouteView,
        //         path: '/list/JYJ',
        //         name: 'JYJ',
        //         redirect: {name:'Phonelist_JYJ'},
        //         meta: { title: '教育局', permission: [ 'JYJ' ] },
        //         children:[
        //           {
                  
        //             path: '/list/UserPhonelist/141',
        //             name: 'Phonelist_JYJ',
        //             component: () => import('@/views/list/UserPhonelist'),
        //             meta: { title: '通信录', permission: [ 'JYJ' ] }
        //           }
        //         ]
        //       },  
        //     }
        //  if(_routes[x].DepID)
        //  {           
        //      childrenObj.path='/list/UserPhonelist/'+_routes[x].DepID
        //      childrenObj.name='Phonelist_'+_routes[x].PermissionKey
        //      childrenObj.component='TableList',
        //      childrenObj.meta= { title: '通信录', permission: [ _routes[x].PermissionKey ] }
        //      arr.push(childrenObj)
            
        //  }
        // if(_routes[x].IsParent)
        // {
        //   obj.component= 'RouteView',
        //   obj.path= '/list/'+_routes[x].PermissionKey,
        //   obj.name= _routes[x].PermissionKey,
        //   obj.redirect= {name:'Phonelist_'+_routes[x].PermissionKey},
        //   obj.meta= { title: _routes[x].Permission_name, permission: [ 'QWXZB' ] }
        //   obj.children=arr;
        // }

        // path: '/list/UserPhonelist/103',
        //             name: 'Phonelist_QWXZB',
        //             component:'TableList',
        //             meta: { title: '通信录', permission: [ 'QWXZB' ] }
     
            // for(let x in Asyncroutes2)
            // {
            //     let obj=new Object();
            //     let s
            //     if(Asyncroutes2[x].IsView && Asyncroutes2[x].IsParent)
            //     {
            //      s= await PermissionModel.findIDByPermissionName(Asyncroutes2[x].PermissionKey)
            //      if(s)
            //      {
            //         obj.key=s.Permission_name 
            //         //  console.log(s.Permission_name)
            //      }
            //     }
                
            //     result.push(obj)
               
            // }
    // let _permissionlist=RolesController.deteleObject(Asyncroutes2,'IsView',true); 
    // for(let x in _permissionlist)
    // {
    //     if(Asyncroutes2[x].IsParent && !Asyncroutes2[x].DepID)
    //     {
    //           asyncroutes={
    //             path:'/list/'+Asyncroutes2[x].PermissionKey,
    //             name: Asyncroutes2[x].PermissionKey,
    //             component: 'PageView',
    //             meta: { title: Asyncroutes2[x].PermissionKey, icon: 'dashboard', permission: [ Asyncroutes2[x].PermissionKey ] },              
    //         }        
    //     }
       
    //         DyNamicRoutes.children.push(asyncroutes);
    //         console.log('9999999999')
       
    // }
    // Asyncroutes2.forEach(v => {
    //     if(v.IsParent && !v.DepID)
    //     {
            // asyncroutes={
            //     path:'/list/'+v.PermissionKey,
            //     name: v.PermissionKey,
            //     component: 'PageView',
            //     meta: { title: v.PermissionKey, icon: 'dashboard', permission: [ v.PermissionKey ] },              
            // }
            // if(v.DepID)
            // {
            //     asyncroutes.children=[
            //         {
            //                     component: 'RouteView',
            //                     path: '/list/QWXZB',
            //                     name: 'QWXZB',
            //                     redirect: {name:'Phonelist_QWXZB'},
            //                     meta: { title: '区委宣传部', permission: [ 'QWXZB' ] },
            //                     children:[
            //                       {
                                 
            //                         path: '/list/UserPhonelist/103',
            //                         name: 'Phonelist_QWXZB',
            //                         component:'TableList',
            //                         meta: { title: '通信录', permission: [ 'QWXZB' ] }
            //                       }
            //                     ]
            //                   },  
            //     ]
            // }
    //     }
    // });
    // let _permissionlist=RolesController.deteleObject(Asyncroutes2,'IsView',true); 
    // "PermissionKey": "QZFXT",
    // "IsParent": false,
    // "IsView": true,
    // "IsEdit": false,
    // "DepID": 109
            // let _arr=[]
            // Asyncroutes2.forEach(v=>{
            //     let obj={};
            //     if(v.IsView)
            //     {
                   
            //         obj.IsView=v.IsView
            //         obj.PermissionKey=v.PermissionKey
            //         obj.IsParent=v.IsParent
            //         obj.IsEdit=v.IsEdit
            //         obj.DepID=v.DepID
            //     }
            //     _arr.push(obj)
            // })

    //   var result = [];
    //     var obj = {};
    //     for(var i =0; i<Asyncroutes2.length; i++){
    //      if(!obj[Asyncroutes2[i].key]){
    //        result.push(Asyncroutes2[i]);
    //        obj[Asyncroutes2[i].key] = true;
    //      }
    //     }
    // for (let i in roles)
    // {   
    //     let _PermissionsArr=await PermissionModel.SelectByRoleID(roles[i]) 
    //     console.log(_PermissionsArr)

    // }
    // let asyncroutes=   {
    //     path: '/list/QXCXT',
    //     name: 'QXCXT',
    //     // QWXZB	区委宣传部
    //     // WHLYGDTYJ	文化旅游广电体育局
    //     // component:TableList,
    //     // component:Cusomgroup,
    //     component: 'PageView',
    //     meta: { title: '宣传系统', icon: 'dashboard', permission: [ 'QXCXT' ] },
    //     children: [
    //       {
    //         component: 'RouteView',
    //         path: '/list/QWXZB',
    //         name: 'QWXZB',
    //         redirect: {name:'Phonelist_QWXZB'},
    //         meta: { title: '区委宣传部', permission: [ 'QWXZB' ] },
    //         children:[
    //           {
             
    //             path: '/list/UserPhonelist/103',
    //             name: 'Phonelist_QWXZB',
    //             component:'TableList',
    //             meta: { title: '通信录', permission: [ 'QWXZB' ] }
    //           }
    //         ]
    //       },  
    //       {
    //         component: 'RouteView',
    //         path: '/list/WHLYGDTYJ',
    //         name: 'WHLYGDTYJ',
    //         redirect: {name:'Phonelist_WHLYGDTYJ'},
    //         meta: { title: '文化旅游广电体育局', permission: [ 'WHLYGDTYJ' ] },
    //         children:[
    //           {          
    //             path: '/list/UserPhonelist/104',
    //             name: 'Phonelist_WHLYGDTYJ',
    //             component:'TableList',
    //             meta: { title: '通信录', permission: [ 'WHLYGDTYJ' ] }
    //           }
    //         ]
    //       }, 
    //     ]
    //   }
    
          
   
    // const userinfo=await userModel.findUserByAminID(iid)
    // const roles= userinfo.dataValues.RolesID.split('|')
 }
/**
 * 
 * @param {adminID} ctx 
 * return {Promise}
 */
static async GetAdminRolesPermissionDepID(ctx)//根据AdminID 获取权限的API
{
    const iid=ctx.request.query.AdminID
    const permissions=[]
    
    const PermissionList=[]
    const SendsmsList=[]
    let userinfo=await userModel.findUserByAminID(iid)
    if(!userinfo.RolesID)
    {
        userinfo.RolesID={
            avatar:'/avatar2.jpg',
            SendsmsList:SendsmsList
           
        }
     
     
        ctx.body={
            code:1,
            msg:'该用户没有设置权限',
            result:userinfo,
           
        }
        return 
    }
    const roles= userinfo.dataValues.RolesID.split('|')   
    const _arr=[]   
    for (let i in roles)
    {   
        let _PermissionsArr=await PermissionModel.SelectByRoleID(roles[i]) 
                    console.log(`000---000---000`)
                    console.log(_PermissionsArr)
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
                            // obj.label=_permissArr.Permission_name
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
                    if(s.IsSendSms)  
                    {                   
                        SendsmsList.push(s.DepartmentId)                      
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
            creatorId: "admin",
            SendsmsList:Array.from(new Set(SendsmsList)) 
  
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
        // console.log(roles)
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

