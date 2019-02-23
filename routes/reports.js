require("dotenv").load();
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
    const verifiedJwt = jsonWebToken.verify(req.cookies.jwTokenCookie, 'red scuba steel sheet');
  }
  
  models.Donation.findAll({
      where : {
        amountDonated : { [Sequelize.Op.ne] : null }
        },
    })
      .then(queryObjects => {
        const queriedRecords = queryObjects.map(currentObject => {
          // console.log(currentObject.dataValues);
          return currentObject.dataValues;
        });
        
        res.send(queriedRecords)
      });
  // };

});



module.exports = router;