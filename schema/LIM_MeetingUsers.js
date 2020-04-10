/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {

    return sequelize.define('LIM_MeetingUsers', {
      meetingPersonID:{
        type:DataTypes.INTEGER,
        allowNull:false,          
        primaryKey: true,
        autoIncrement: true  
      },
      meetingPersonType:{
        type: DataTypes.STRING,
        allowNull: true
        },  
        meetingSubjectID: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        meetingUserID: {
          type: DataTypes.INTEGER,
          allowNull: true
        },   
        meetingPersonGroupID: {
          type: DataTypes.STRING,
          allowNull: true
        },     
        orderID: {
          type: DataTypes.INTEGER,
          allowNull: true
        },     

    }, {
    timestamps: false,
    tableName: 'LIM_MeetingUsers'
    });
  };
  //一下这条语句可以查询出 角色 ID 为83 的管理员所能看到的 栏目管理信息 RoleID 关联到管理员ID ，当管理员登陆时就可以根据角色获得所有路由信息
//   SELECT DISTINCT 
//                 LIM_Department.DepartmentName, LIM_Department.DepartmentId, LIM_PermissionInformation.RoleID, 
//                 LIM_PermissionInformation.IsView, LIM_PermissionInformation.IsEdit, LIM_Department.Permission_Key, 
//                 LIM_Permission.areakey, LIM_Area.areaname
// FROM      LIM_PermissionInformation INNER JOIN
//                 LIM_Department ON LIM_PermissionInformation.PermissionKey = LIM_Department.Permission_Key INNER JOIN
//                 LIM_Permission ON LIM_Department.Permission_Key = LIM_Permission.Permission_key INNER JOIN
//                 LIM_Area ON LIM_Permission.areakey = LIM_Area.areakey
// WHERE   (LIM_PermissionInformation.RoleID = 83)
//-----------------------
// SELECT   LIM_PermissionInformation.RoleID, LIM_PermissionInformation.PermissionKey, LIM_PermissionInformation.IsParent, 
//                 LIM_PermissionInformation.IsView, LIM_PermissionInformation.IsEdit, LIM_PermissionInformation.DepID, 
//                 LIM_Department.UploadDir, LIM_Department.DepartmentName, LIM_Permission.areakey, LIM_Area.areaname
// FROM      LIM_Area INNER JOIN
//                 LIM_Permission ON LIM_Area.areakey = LIM_Permission.areakey RIGHT OUTER JOIN
//                 LIM_PermissionInformation INNER JOIN
//                 LIM_Department ON LIM_PermissionInformation.DepID = LIM_Department.DepartmentId ON 
//                 LIM_Permission.Permission_key = LIM_PermissionInformation.PermissionKey
// WHERE   (LIM_PermissionInformation.RoleID = 80) AND (LIM_PermissionInformation.IsParent = 0)