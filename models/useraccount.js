require('dotenv').config();
const bcryptjs = require('bcryptjs'),
      jsonWebToken = require('jsonwebtoken'),
      moment = require('moment'), // won't autocomplete but argument prefixing still works
      encryptor = require('simple-encryptor')(process.env.simpleEncryptorSecret),
      _ = require('lodash')
      
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
  UserAccount.prototype.setJwTokenCookie = function (response, userId) {
    const encryptedUserId = encryptor.encrypt(userId);
    
    // generate a new jwt encoded with encrypted userId:
    const signedToken = jsonWebToken.sign({
      data: {
        userId : encryptedUserId
      }
    }, process.env.jwtSecret);
    
    // pass it into a cookie and respond
    const dateIn10Years = new moment()
      .add(10, "years").toDate();
    
    return response.cookie('jwTokenCookie', signedToken, {
      httpOnly: true,
      expires : dateIn10Years
    })
  };
  
  UserAccount.prototype.getJwTokenCookie = request => {
    const jwtCookie = request.cookies.jwTokenCookie;
    if (jwtCookie) {
      const decodedJwt = jsonWebToken.verify(jwtCookie, process.env.jwtSecret);
      return decodedJwt;
    }
    else return null;
  };
  
  UserAccount.prototype.verifyUser = (request, response) => {
    console.log(`====verifyUser entered======`);
    const rawCookie = request.cookies;
    if (!rawCookie || _.isEmpty(rawCookie)){
      console.log(`====Sending error object======`);
      response.send({ error : "No user cookie found" });
    }
    
    console.log(rawCookie, `=====rawCookie=====`);
     // -> .data.userId === encrypted
    const verifiedCookie = jsonWebToken
      .verify(rawCookie, process.env.jwtSecret);
    const decryptedUserId = encryptor.decrypt(verifiedCookie.data.userId);
    console.log(decryptedUserId, `=====decryptedUserId=====`);
    
    // search the db for a userId match. resolve with the dat object if yes. Else reject with an error message
    UserAccount.findOne({ where : { username : decryptedUserId } })
      .then(userRecord => {
        if (!userRecord) {
          console.log(`====NO USER FOUND======`);
          return res.json({ error : 'No user found' })
        } else if (userRecord) {
          // don't need the user record. just need to run the donation data getter
          return ({ success : 'User verified' })
        }
      })
      .catch({ error : 'Something went wrong in UserAccount.prototype.verifyUser()' })
  };
  
  UserAccount.prototype.deleteJwTokenCookie = (request) => {
    if (request.cookies.jwTokenCookie) {
      res.clearCookie('jwTokenCookie');
    }
    const { jwTokenCookie = { data : { userId : null } }
            } = request.cookies; // defaults to this unless receives truthy value
    return jwTokenCookie;
  };
  
  return UserAccount;
};


































