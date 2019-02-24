const dotenv = require('dotenv').config({ debug: process.env.DEBUG });
var express = require('express');
var router = express.Router();
const models          = require("../models"),
      passport        = require("passport"),
      // LocalStrategy   = require("passport-local"),
      bcryptjs        = require("bcryptjs"),
      jsonWebToken    = require("jsonwebtoken"),
      controllers     = require("../controllers"),
      moment = require('moment'),
      encryptor = require('simple-encryptor')(process.env.simpleEncryptorSecret);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sign-up', (req, res, next) => {

  // find a user with this username
  models.UserAccount.findOne({ where : { username : req.body.username }})
  .then(userRecord => {
    const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    console.log(userRecord);
    
    // sign up new user
    if (!userRecord) {
      models.UserAccount.create({
        username : req.body.username,
        password : hashedPassword
      })
      .then(userRecord => {
      console.log("----------- User Created ------------");
      console.log(userRecord);
      // set res.cookie() header to persist his session until logout
        models.UserAccount.prototype.setJwTokenCookie(res, userRecord.dataValues.id);

      // log the new user in
      passport.authenticate('local', (error, user, info) => {
        if (error) { return next(error); }
        if (userRecord === (null || false || undefined)) {
          return res.json({ "error" : "User data is false" });
        } // should never trigger
  
        req.logIn(userRecord, error => {
          if (error) return next(error);
          return res.json({ "userInfo" : userRecord });
        })
        })(req, res, next) // for an inner function
      })
    } else if (userRecord) {
        console.log ("user already exists: routes/index.js:39");
        return res.json({ "error" : "User already exists" })
    } else {
      console.log("Hit the else clause"); res.json({"error" : "Hit else clause"})
    }
  })
});


/////////////// LOG IN / LOG OUT ///////////////

router.post('/log-in', passport.authenticate('local'), (req, res) => {
  console.log( `=====/login fired=====`);
  // get the user's Id. Then set the cookie with it
  models.UserAccount.findOne({ where : { username : req.body.username }})
    .then(userRecord => {
      console.log("=========userRecord==========");
      console.log(userRecord);
  
      const id = userRecord.dataValues.id;
      console.log("==========userRecord.id=======");
      console.log(id);
      // evaluates to res.cookie('jwtTestCookie', signedToken)
      models.UserAccount.prototype.setJwTokenCookie(res, id);
      
      return res.json({
        id : userRecord.dataValues.id,
        username : userRecord.dataValues.username
      })
    });
});

router.post('/log-out', (req, res, next) => {
  req.logOut(req.body.username);
  const jwTokenCookie = models.UserAccount.prototype.deleteJwTokenCookie(req);
  
  if (jwTokenCookie.data.userId === (null || false || undefined)) {
    res.send({
      id : null,
      username : null
    })
  } else res.send({ error : "cookie is still present on logout" })
});


////////////////// COOOKIE TESTING //////////////////////

// create test cookie
router.post('/create-cookie', (req, res, send) => {
  const cookieName = 'jwtTestCookie';
  const encryptedUserId = encryptor.encrypt(req.body.userId);
  
  const signedToken = jsonWebToken.sign({
    data: {
      userId : encryptedUserId
    }
  }, process.env.jwtSecret);
  const expireDate = new moment().add('10', 'years').toDate();
  
  res.cookie(cookieName, signedToken, {
    httpOnly : true,
    expires : expireDate
  });
  // want to see if not chaining also works
  res.send({
    "route" : '/create-cookie',
    "cookieName" : 'jwtTestCookie',
    "jwToken/value" : signedToken,
    "expireDate" : expireDate,
    "encrypted userId" : encryptedUserId
  })
});

// check cookie
router.post('/check-cookie', (req, res, send) => {
  const decodedJwt = jsonWebToken.verify(req.cookies.jwtTestCookie, process.env.jwtSecret);
  const decryptedUserId = encryptor.decrypt(decodedJwt.data.userId);
  
  console.log(process.env.simpleEncryptorSecret, `=====process.env.simpleEncryptorSecret=====`);
  res.send({
    route : '/check-cookie',
    name : 'jwtTestCookie (hardcoded)', // because the backend will ask specifically for a cookie with this name
    value : req.cookies.jwtTestCookie,
    decodedObject :  decodedJwt,
    directAccessedValue : decodedJwt.data.userId,
    userIdDecrypted : decryptedUserId
  })
});

// delete cookie
router.post('/clear-cookie', (req, res, next) => {
  res.clearCookie('jwtTestCookie')
  .send({
    name : 'jwtTestCookie',
    payload : req.cookies.jwtTestCookie || null
      // should short circuit evaluate to null on successful clearance
  })
});

// cold-start a slow starting heroku server
router.get('/cold-start', (req, res, next) => {
  res.send({ message : "Server started. Backend can now receive requests." })
});


module.exports = router;

