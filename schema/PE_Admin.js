/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PE_Admin', {
    AdminID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AdminName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    AdminPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    EnableMultiLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    RndPassword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LoginTimes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LastLoginIP: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LastLogoutTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LastModifyPasswordTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    IsLock: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    EnableModifyPassword: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    LoginErrorTimes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LastLoginErrorTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    RolesID: {
      type: DataTypes.STRING,
      allowNull: true
    }
    
  }, {
  timestamps: false,
  tableName: 'PE_Admin'
  });
};
