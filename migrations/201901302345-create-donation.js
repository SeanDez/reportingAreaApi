'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => { // on db:migrate
    return queryInterface.addColumn('Donations', 'stateLivingIn', {
      type : Sequelize.STRING
    });
  },
  down: (queryInterface, Sequelize) => { // on undo
    return queryInterface
      .removeColumn('Donations', 'stateLivingIn');
  }
};