'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAccount = sequelize.define('UserAccount', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  UserAccount.associate = function(models) {
    // associations can be defined here
  };
  return UserAccount;
};