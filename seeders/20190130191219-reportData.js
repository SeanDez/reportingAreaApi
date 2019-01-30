'use strict';
const cleanedSeedData = require("../data/cleanedSeedData");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Donations", (() => {
        const arrayToReturn = [];
        cleanedSeedData.forEach((currentRecord, index, array) => {
          const formattedRecord = Object.assign({}, currentRecord);
          delete formattedRecord.donationId;
          formattedRecord.donationDate =
                                       new Date(formattedRecord.donationDate);
          formattedRecord.createdAt = new Date();
          formattedRecord.updatedAt = new Date();
          arrayToReturn.push(formattedRecord)
        });
      return arrayToReturn;
      })(),
    );
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Donations", null, {})
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
