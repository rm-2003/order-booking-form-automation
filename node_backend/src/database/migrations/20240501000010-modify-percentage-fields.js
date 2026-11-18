'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify percentage fields in obf_financial_metrics table
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_year1', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_fy2026', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_contract', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_year1', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_fy2026', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_contract', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_year1', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_fy2026', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_contract', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_year1', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_fy2026', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_contract', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert percentage fields back to DECIMAL(5,2)
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_year1', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_fy2026', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_percent_contract', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_year1', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_fy2026', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'gross_margin_after_discount_percent_contract', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_year1', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_fy2026', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebit_percent_contract', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_year1', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_fy2026', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
    await queryInterface.changeColumn('obf_financial_metrics', 'ebt_percent_contract', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false
    });
  }
}; 