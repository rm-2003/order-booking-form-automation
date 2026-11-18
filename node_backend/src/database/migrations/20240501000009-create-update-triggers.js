'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create update_updated_at_column function
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Define all tables that need an updated_at trigger
    const tables = [
      'obf',
      'obf_input_result',
      'manpower',
      'capex',
      'opex',
      'rental',
      'obf_history',
      'obf_revenue',
      'obf_ba_rates',
      'obf_direct_expenses',
      'obf_financial_metrics',
      'obf_manpower_breakup',
      'obf_capex_breakup',
      'obf_opex_breakup',
      'obf_rent_breakup',
      'obf_implementation_cost',
      'obf_pre_go_live_manpower',
      'obf_additional_implementation_cost'
    ];

    // Create triggers for each table
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
    }
  },

  async down(queryInterface, Sequelize) {
    // Define all tables that have an updated_at trigger
    const tables = [
      'obf',
      'obf_input_result',
      'manpower',
      'capex',
      'opex',
      'rental',
      'obf_history',
      'obf_revenue',
      'obf_ba_rates',
      'obf_direct_expenses',
      'obf_financial_metrics',
      'obf_manpower_breakup',
      'obf_capex_breakup',
      'obf_opex_breakup',
      'obf_rent_breakup',
      'obf_implementation_cost',
      'obf_pre_go_live_manpower',
      'obf_additional_implementation_cost'
    ];

    // Drop triggers for each table
    for (const table of tables) {
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
      `);
    }

    // Drop the function
    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);
  }
}; 