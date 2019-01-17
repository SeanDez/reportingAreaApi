var express = require('express');
var router = express.Router();
const models   = require("../models"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      bcryptjs = require("bcryptjs");




passport.use('local', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true
}, (req, username, password, done) => {
  
  process.nextTick(() => {
    models.UserAccount.find({
      where : {
        username : username
      }
    }).then((userRecord, error) => {
      if (error) {
        console.log('=================== 1 error =====================');
      return done(error);
      }
      else if (userRecord === false) {
        console.log('============== 2 no userRecord found ================');
        return done(null, false);
      }
      bcryptjs.compare(req.body.password, userRecord.password, (error, compareResult) => {
        if (compareResult === false) {
          console.log('================= 3 pw mismatch ====================');
          return done(null, false);
        } else if (compareResult) {
          console.log('=============== 4 successful local strat ==============');
          return done(null, userRecord); // goes into req.user
        }
      })
    })
  })
}));

passport.serializeUser((user, done) => { done(null, user) });
passport.deserializeUser((user, done) => { done(null, user) });





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// find the user.
  // If none, create and then authenticate
router.post('/sign-up', (req, res, next) => {
  models.UserAccount.findOne({ where : { username : req.body.username }})
  .then(userRecord => {
    console.log("inside first .then()");
    const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
    console.log(userRecord);
    if (!userRecord) {
      console.log("inside if !userRecord");
      models.UserAccount.create({
        username : req.body.username,
        password : hashedPassword
      })
      .then(userRecord => {
      console.log("----------- User Created ------------");
      console.log(userRecord);
      passport.authenticate('local', (error, user, info) => {
        if (error) { return next(error); }
        if (userRecord == false) {
          console.log("------------ USER RECORD AGAIN ----------");
          console.log(userRecord);
          return res.json({ "error" : "User data is false" });
        } // should never trigger
  
        console.log("----------- user object in pp.authenticate ---------");
        console.log(user); // false means auth failed
        req.logIn(userRecord, error => {
          if (error) return next(error);
          return res.json({ "userInfo" : userRecord });
        })
        })(req, res, next)
      })
    } else if (userRecord) {
        console.log ("user already exists: routes/index.js:39");
        return res.json({ "error" : "User already exists" })
    } else {
      console.log("Hit the else clause"); res.json({"error" : "Hit else clause"})
    }
  })
});

router.post('/log-in', passport.authenticate('local'), (req, res) => {
  return res.json({ "loggedInUser" : {
      "id" : req.user.id,
      "username" : req.user.username
    }
  })
});



module.exports = router;

