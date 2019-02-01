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
  
  // switch (req.body.reportType) {
  //   case 'totalDonationsByMonth':
  //     donationData = models.Donation.getDonations(null, ['date', 'amount']);
  //     break; // needed when there's no return;
  //   default:
  //     donationData = { error : 'Hit the default clause' }
  // }
  
  // see if the userId matches
  // if (verifiedJwt(['userId'] || ['id'])) { }
  
  // load a variable with every data point and return it
    // first run the query to select the target records
  // const donationData = () => {
  
  
    const queriedRecords = [];
      // complex data types can be modded. primitives are immutable
  models.Donation.findAll({
      attributes : ['amountDonated', 'donationDate'],
      where : {
        amountDonated : { [Sequelize.Op.ne] : null }
        },
    })
      .then(queryObjects => {
        // push into a persistent array and then return it
        queryObjects.forEach((currentObject, index, array) => {
          console.log(currentObject.dataValues);
          queriedRecords.push(currentObject.dataValues)
        });
  
        console.log("---------DONATION DATA--------------");
        console.log(queriedRecords);
        res.send(queriedRecords)
      });
  // };

});



module.exports = router;