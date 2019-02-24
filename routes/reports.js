require("dotenv").config();
const express      = require("express"),
      router       = express.Router(),
      models       = require("../models"),
      passport     = require("passport"),
      controllers  = require("../controllers"),
      jsonWebToken = require("jsonwebtoken"),
      Sequelize    = require("sequelize");

// this is the reports router
router.post('/', (req, res, next) => {
  // check the user's cookie for a signed, decrypted userId match
  console.log( `=====/reports entered=====`);
  const verifyResult = models.UserAccount.prototype.verifyUser(req, res);
  
  if (verifyResult.success) {
    const allRecords = models.Donation.getAllValidRecords();
    res.send(allRecords)
  } else if (verifyResult.error) {
    res.send(verifyResult.error) // back to the front end
  }
});



module.exports = router;