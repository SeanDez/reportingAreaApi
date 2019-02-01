'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    donationDate: DataTypes.DATE,
    amountDonated: DataTypes.DECIMAL(8, 2),
    paymentType: DataTypes.STRING,
    isRecurring: DataTypes.BOOLEAN,
    countryLivedIn: DataTypes.STRING,
    notes: DataTypes.STRING,
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
  };
  Donation.getTotalDonationsByMonth = (donationData) => {
    // setup date containers

    // Donation.mergeRecordsByMonth
  };
  return Donation;
};