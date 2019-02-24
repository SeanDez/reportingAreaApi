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
  
  if (req.cookies.jwTokenCookie) {
    const verifiedJwt = jsonWebToken.verify(req.cookies.jwTokenCookie, process.env.jwtSecret);
    
    // todo decode verifiedJWT to PRINT the userId
    // todo run a test matcher on userid in the db
      // nest the below code on success
  }
  
  models.Donation.findAll({
      where : {
        amountDonated : { [Sequelize.Op.ne] : null }
        },
    })
      .then(queryObjects => {
        const queriedRecords = queryObjects.map(currentObject => {
          return currentObject.dataValues;
        });
        res.send(queriedRecords)
      });
  // };

});



module.exports = router;