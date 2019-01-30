'use strict';
require('dotenv').load();
const bcryptjs = require('bcryptjs'),
      jsonWebToken = require('jsonwebtoken'),
      moment = require('moment'); // won't autocomplete but argument prefixing still works
      
// UserAccount is returned from the wrapper function
// so module.exports = UserAccount
module.exports = function (sequelize, DataTypes) {
  const UserAccount = sequelize.define('UserAccount', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  });
  UserAccount.associate = function(models) {
    // associations can be defined here
  };

  UserAccount.prototype.validatePassword = (password) => {
    return bcryptjs.compareSync(password, this.password);
    // this.password is really a passwordHash
  };
  
    // cookie-setter
  UserAccount.prototype.setJwTokenCookie = function (responseLocal, userId) {
    // generate a new jwt encoded with userId:
    const signedToken = jsonWebToken.sign({
      data: {
        userId : userId
      }
    }, "red scuba steel sheet"); // TODO change this into Env variable
    
    // pass it into a cookie and respond
    const dateIn10Years = new moment()
      .add(10, "years").toDate();
    
    return responseLocal.cookie('jwTokenCookie', signedToken, {
      httpOnly: true,
      expires : dateIn10Years
    })
  };
  
  UserAccount.prototype.getJwTokenCookie = requestLocal => {
    const jwtCookie = requestLocal.cookies.jwTokenCookie;
    if (jwtCookie) {
      const decodedJwt = jsonWebToken.verify(jwtCookie, 'red scuba steel sheet');
      return decodedJwt;
    }
    else return null;
  };
  
  UserAccount.prototype.deleteJwTokenCookie = (requestLocal) => {
    if (requestLocal.cookies.jwTokenCookie) {
      res.clearCookie('jwTokenCookie');
    }
    const { jwTokenCookie = { data : { userId : null } }
            } = requestLocal.cookies; // defaults to this unless receives truthy value
    return jwTokenCookie;
  };
  
  return UserAccount;
};


































