'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable UUID extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  },

  async down(queryInterface, Sequelize) {
    // We don't want to drop the extension as it might be used by other databases
    // This is intentionally left empty
  }
}; 