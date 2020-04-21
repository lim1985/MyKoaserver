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
const ErrorInformation = require('../controller/ErrOrInformationController')
const PersonInformation = require('../controller/PersonInformationController')
const SMSAccount = require('../controller/SMSAccountController')
const meetingController = require('../controller/meetingController')
const PhoneRecordController = require('../controller/PhoneRecordController')
// const ListController = require('../controllers/list')
const router = new Router({
  prefix: '/api'
})

router
//电话记录模块
 .post('/createPhoneRecord',PhoneRecordController.addPhoneRecord)
 .get('/GetRecordList',PhoneRecordController.GetRecoredListByDepID)

 
//会议管理系统
 .get('/selectmeetingByID',meetingController.getMeetingByID)//获取会议详细信息by meetingID
 .get('/selectmeetingByDepID',meetingController.getMeetingByDepID)//获取会议详细信息by meetingID
 .post('/createMeet',meetingController.createMeet)
 .post('/createMeetingSubject',meetingController.createMeetingSubject)
 .post('/createmeetingSubjectUsers',meetingController.addmeetingSubjectUsers) 
 .get('/removeSubmeetingUser',meetingController.removeSubmeetingUser) //删除议题里的联系人
 .get('/selectmeetSubUsers',meetingController.selectmeetSubUsers)
 
//登记人员信息管理接口
  .get('/selectByJdId', PersonInformation.selectByJd_Id) 
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
  .post('/selectDepSmsCount',DepartmentController.selectDepSmsCount)
  .get('/updateDepSmsCount',DepartmentController.updateSmsCount)
  //短信接口参数配置查询
  .post('/selectSmsAccounts',DepartmentController.selectSmsAccounts)
  //修改部门短信发送账号信息
  .post('/updateSmsAccounts',SMSAccount.updateDepAccounts) 
  //新增部门短信发送账号信息
  .post('/AddSmsAccounts',SMSAccount.AddDepAccounts)
 


  

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
  .get('/GetUserInfoByTelOrPhoneNum',UserPhonelistController.GetUserInfoByTelOrPhoneNum)//家庭/办公手机/座机查询接口

  
  .get('/GetuserInformationbyname',UserPhonelistController.GetuserInformationbyUsername)
  .get('/GetUserInformationByUserNameLIke',UserPhonelistController.GetUserInformationByUserNameLIke)
  .get('/ChangeToQita',UserPhonelistController.ChangeDepToQita)

  
  
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
  .get('/isexist',CustomGroupController.isexist)
  .get('/createGroup',CustomGroupController.CreateGroup)
  .get('/GetGroup',CustomGroupController.GetcustomGroupByDepID)
  .get('/GetAllDepUser',CustomGroupController.GetAllAreaDepUserbyAdminID)
  .post('/adduserTogroup',CustomGroupController.AddUsersToGroup)
  .post('/newaddUsersToGroup',CustomGroupController.NewaddUsersToGroup)
  
  .get('/InGroupUsersID',CustomGroupController.GetUserByGroupID)//读取组里的用户
  .get('/FindAllUserByGroupID',CustomGroupController.FindAllUsersByGroupID)
  .get('/DeleteGroupUser',CustomGroupController.DeleteUserByUID)
  .get('/DeleteGroup',CustomGroupController.DeleteGroupByGroupID)
  .post('/SortCustomGroupUserPhoneList',CustomGroupController.sortCustomGroupUsers)
//errorinformation
  .get('/submitErrorInfo',ErrorInformation.submitErrorInfo)
  .get('/selectErrorInfo',ErrorInformation.SelectErrorInfo)
  .get('/UpdateErrorInfo',ErrorInformation.UpdateErrorInfo)





  
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