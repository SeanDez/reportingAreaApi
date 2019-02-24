require("dotenv").config();
const express      = require("express"),
      router       = express.Router(),
      models       = require("../models"),
      passport     = require("passport"),
      controllers  = require("../controllers"),
      jsonWebToken = require("jsonwebtoken"),
      Sequelize    = require("sequelize");

// this is the reports router
router.post("/", (req, res, next) => {
  console.log(`====/======`);
  // check the user's cookie for a signed, decrypted userId match
  
  // const verifyResult = models.UserAccount.prototype.verifyUser(req, res);
  
  // if (verifyResult.success) {
  
  models
    .Donation
    .findAll({
      where : {
        amountDonated : {[Sequelize.Op.ne] : null},
      },
    })
    .then(queryObjects => {
      console.log(queryObjects[0], `=====queryObjects[0]=====`);
      const queriedRecords = queryObjects
        .map(currentObject => {
          return currentObject.dataValues;
        });
      res.send(queriedRecords);
    });
});

  // } else if (verifyResult.error) {
  //   res.send(verifyResult.error) // back to the front end
  // }




module.exports = router;