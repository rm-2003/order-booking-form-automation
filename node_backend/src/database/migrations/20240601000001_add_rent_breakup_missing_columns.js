'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // These columns already exist in the table from the initial creation
    // No need to add them again
  },

  async down(queryInterface, Sequelize) {
    // No columns to remove since we didn't add any
  }
}; 