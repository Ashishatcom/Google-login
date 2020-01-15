'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    googleID: DataTypes.STRING,
    displayName:DataTypes.STRING,
    emails:DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};