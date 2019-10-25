const Router = require('koa-router')
const UserController = require('../controller/userController')
const RolesController = require('../controller/rolesController')
const AdminRolesController = require('../controller/AdminRoleController')
const PermissionController = require('../controller/PermissionController')
const DepartmentController = require('../controller/DepController')
const UserPhonelistController = require('../controller/userPhoneController')
const ReferenceUserController = require('../controller/ReferenceUserController')
const CustomGroupController = require('../controller/CustomGroupController')
const SmsRouter = require('../controller/sendsmsAction')
const WxRouter = require('../controller/WxContorller')





// const ListController = require('../controllers/list')
const router = new Router({
  prefix: '/api'
})

router
//微信相关路由
  .get('/GetCode', WxRouter.GettokenCode) // 注册
//短信验证登陆方法
  .get('/GetVerificatCode',SmsRouter.GetVerificatCode)
//admin
  // .post('/login', UserController.myLogin)  // 登录
  .post('/createUser', UserController.createUser) // 注册
  .get('/userInfo', UserController.GetUserName) // 获取用户信息
  .get('/login', UserController.myLogin) 
  .get('/userlist',UserController.GetallAdminlist)//获取所有用户
  .post('/ActionUpdataAdmin',UserController.UpdataAdminRolesByID)//修改用户权限

  //roles
  .get('/rolesAdd', RolesController.createRoles) 
  .get('/roleslist', RolesController.findAllroles) 
  .get('/rolesdel', RolesController.DeleterolesByID) 
  .post('/rolesAddPermission',RolesController.UpdataRolesPremissionbyID)
  .get('/getPermissionbyroleID',RolesController.GetPermissionbyRoleID) 
  .get('/getAllPermissionbyRoleID',RolesController.newGetPermissionAndDepList) 

  
  //adminroles
  .post('/adminroladd',AdminRolesController.addAdminRoles)
  .get('/admininfo',AdminRolesController.GetAdminRolesPermission)
  .get('/GetrolesbyAdminID',AdminRolesController.GetroleslistbyAdminID)
  .get('/GetAllRolesDepIDPermission',AdminRolesController.GetAdminRolesPermissionDepID)
  .get('/GetDyNamicRoutesByAdminID',AdminRolesController.GetDynamicRoutesByAdminID)
  
    //PermissionController
  .get('/PermissionAdd',PermissionController.AddPermission)
  .get('/PermissionList',PermissionController.findAllPermission)
  .get('/PermissionUpdata',PermissionController.UpdatePermission)
  .get('/PermissionDel',PermissionController.DeletePermissionByID)
  .get('/Permissionbykey',PermissionController.findPermissionBykey)
  .get('/AreaPermissionbyAdminID',PermissionController.GetAreaAllPermissbyAdminID)
  .post('/UpdataPermissionInformation',PermissionController.UpdataPermissionInformation)
  .get('/GetallPermission',PermissionController.newPermissionInformationbyRoleID)

  
  //DepartmentController
  .get('/DepartmentGet',DepartmentController.GetDepartmentByKey)//搜索dep信息by Permission_Key
  .get('/DepartmentGetByID',DepartmentController.GetDepartmentByID)//搜索dep信息by Permission_Key
  //.get('/DepartmentGetbydepName',DepartmentController.select_DepartmentByDEPName)//搜索dep信息by DepartmentName
  .post('/AddParment',DepartmentController.AddDepartment)
  .post('/UpdateDEPartment',DepartmentController.PostUpdateDepByDEPID)
  .post('/DeleteDEPartment',DepartmentController.PostDelDepByDEPID)
  .get('/DepartmentQueryALL',DepartmentController.QueryFindCountAllDEP)
  .get('/selectAlldepartmentBykey',DepartmentController.selectAll_DepartmentByPermission_Key)
  .get('/SelectDepslistsbyLike',DepartmentController.SelectDepslistsbyLike)
  
 
  //phoneUser通讯录接口
  .post('/asyncValidateTel',UserPhonelistController.ValidateTel)
  .post('/UpdatePhoneUser',UserPhonelistController.UpdateUserPhoneinformation)
  .post('/AddPhoneUser',UserPhonelistController.AdduserPhones)
  .post('/GetUserByNameAndDepID',UserPhonelistController.GetUserByNameAndDepID)
  .post('/SortUserPhoneList',UserPhonelistController.sortUserPhoneList)



  
  //批量导入通讯录用户
  .post('/importUsersList',UserPhonelistController.importUsersListfromExcle)

  .get('/AllPhoneUserByPermissionkey',UserPhonelistController.GetAllUserPhoneListByPermissionKey)
  .get('/GetDepIDAndPermissionKey',UserPhonelistController.GetByDepIDAndPermissionKey)
  .post('/PostDepIDAndPermissionKey',UserPhonelistController.PostByDepIDAndPermissionKey)  
  .get('/GetAllPhoneuser',UserPhonelistController.GetAllPhoneuser)
  .get('/GetAllByDepID',UserPhonelistController.GetAllByDepID)
  .get('/DeleteUser',UserPhonelistController.DeleteUsers)
  .get('/GetuserInformationbyTelNum',UserPhonelistController.GetuserInformationbyTelNum)
  .get('/GetuserInformationbyname',UserPhonelistController.GetuserInformationbyUsername)
  .get('/GetUserInformationByUserNameLIke',UserPhonelistController.GetUserInformationByUserNameLIke)


  
//获取路由表
  .get('/getRouteByAdmin',UserController.GetRouteByAdminID)
  .get('/getAllPermissAndDeplist',UserController.GetPermissionAndDeplist)
  .get('/getAllDepTreeList',UserController.GetDepTreeList)
  .get('/GetAllPermissionInformationByRolesID',PermissionController.SelectPermissionInformationByRoleID)
//引用表
  .get('/ReferenceAdd',ReferenceUserController.Add)
  .get('/ReferenceDelete',ReferenceUserController.Delete)
  .get('/IsReference',ReferenceUserController.IsReference)  
//customgroup
  .get('/createGroup',CustomGroupController.CreateGroup)
  .get('/GetGroup',CustomGroupController.GetcustomGroupByDepID)
  .get('/GetAllDepUser',CustomGroupController.GetAllAreaDepUserbyAdminID)
  .post('/adduserTogroup',CustomGroupController.AddUsersToGroup)
  .get('/InGroupUsersID',CustomGroupController.GetUserByGroupID)//读取组里的用户
  .get('/FindAllUserByGroupID',CustomGroupController.FindAllUsersByGroupID)
  .get('/DeleteGroupUser',CustomGroupController.DeleteUserByUID)
  .get('/DeleteGroup',CustomGroupController.DeleteGroupByGroupID)

  
//   .get('/myuserInfo', UserController.myUserInfoGet) // 获取用户信息
//   .get('/user/getTodoList', ListController.getTodoList) // 获取list
//   .post('/user/todoList', ListController.createTodoList)  // 创建list
//   .post('/user/DestroyTodoList', ListController.destroyTodoList)  // 删除list
//   .post('/user/updateTodoList', ListController.updateTodoList)  // 更新list

module.exports = router


// class myclass{

//     static abc(ctx)
//     {
//         console.log(ctx)
      
//     }
//     static abc2(ctx)
//     {
//         console.log(ctx)
//     }
// }
// module.exports= myclass