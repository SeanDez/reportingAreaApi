'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Donations', 'countryLivedIn', 'countryLivingIn');
  },
  down: (queryInterface, Sequelize) => { // on undo
    return queryInterface
      .dropTable("Donations")
      .createTable("Donations", {
        id             : {
          allowNull     : false,
          autoIncrement : true,
          primaryKey    : true,
          type          : Sequelize.INTEGER,
        },
        firstName      : {
          type : Sequelize.STRING,
        },
        lastName       : {
          type : Sequelize.STRING,
        },
        donationDate   : {
          type : Sequelize.DATE,
        },
        amountDonated  : {
          type : Sequelize.DECIMAL(10, 2),
        },
        paymentType    : {
          type : Sequelize.STRING,
        },
        isRecurring    : {
          type : Sequelize.BOOLEAN,
        },
        countryLivingIn : {
          type : Sequelize.STRING,
        },
        notes          : {
          type : Sequelize.STRING,
        },
        createdAt      : {
          allowNull : false,
          type      : Sequelize.DATE,
        },
        updatedAt      : {
          allowNull : false,
          type      : Sequelize.DATE,
        },
      });
  }
};