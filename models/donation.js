'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    donationDate: DataTypes.DATE,
    amountDonated: DataTypes.DECIMAL(8, 2),
    paymentType: DataTypes.STRING,
    isRecurring: DataTypes.BOOLEAN,
    // countryLivedIn: DataTypes.STRING, // removed via migration
    notes: DataTypes.STRING,
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
  };
  
  Donation.getAllValidRecords = () => {
    Donation
      .findAll({
        where : {
          amountDonated : {[Sequelize.Op.ne] : null},
        },
      })
      .then(queryObjects => {
        const queriedRecords = queryObjects
          .map(currentObject => {
          return currentObject.dataValues;
        });
        res.send(queriedRecords);
      });
  };
  
  return Donation;
};