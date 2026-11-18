'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('obf_rent_breakup', 'location', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('obf_rent_breakup', 'area', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('obf_rent_breakup', 'location');
    await queryInterface.removeColumn('obf_rent_breakup', 'area');
  }
}; 