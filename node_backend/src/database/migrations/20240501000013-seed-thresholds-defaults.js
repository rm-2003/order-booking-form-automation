'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Array of default threshold rows (from screenshot)
    const rows = [
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Warehousing and VAS', gross_margin_percent_min: 20, credit_period_days: 30, capex_min_lakhs: 100, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Transportation', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'E-Commerce', project_type: 'Warehousing and VAS', gross_margin_percent_min: 22, credit_period_days: 30, capex_min_lakhs: 100, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'E-Commerce', project_type: 'Transportation', gross_margin_percent_min: 30, credit_period_days: 45, capex_min_lakhs: 100, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'E-Commerce', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 30, credit_period_days: 55, capex_min_lakhs: 100, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Auto Outbound', project_type: 'Warehousing and VAS', gross_margin_percent_min: 22, credit_period_days: 30, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Auto Outbound', project_type: 'Transportation', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Auto Outbound', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Enterprise Mobility', project_type: 'Transportation', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 50, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Enterprise Mobility', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 28, credit_period_days: 55, capex_min_lakhs: 50, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'AFS (MnM)', project_type: 'Warehousing and VAS', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'AFS (MnM)', project_type: 'Transportation', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'AFS (MnM)', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Warehousing and VAS', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Transportation', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Transport Solutions Group', project_type: 'Transportation', gross_margin_percent_min: 30, credit_period_days: 55, capex_min_lakhs: 100, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Transport Solutions Group', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 30, credit_period_days: 55, capex_min_lakhs: 100, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'FMCG and Pharma', project_type: 'Warehousing and VAS', gross_margin_percent_min: 24, credit_period_days: 30, capex_min_lakhs: 80, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'FMCG and Pharma', project_type: 'Transportation', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'FMCG and Pharma', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Warehousing and VAS', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 60, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Transportation', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Auto and Engineering(Non-MnM)', project_type: 'Warehousing and VAS', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Field Sales - Auto and Engineering(Non-MnM)', project_type: 'Transportation', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Warehousing and VAS', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Transportation', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Telecom', project_type: 'Warehousing and VAS', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Field Sales - Telecom', project_type: 'Transportation', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Field Sales - Telecom', project_type: 'S and LF / Stockyards', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'LMD', project_type: 'Delivery as Service', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'LMD', project_type: 'Distribution/EDSP/OXD/XL', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'LMD', project_type: 'MFC', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'LMD', project_type: 'EV Deliveries', gross_margin_percent_min: 30, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Fleet Service Business', project_type: 'Pro Trucking', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Fleet Service Business', project_type: 'E-Del', gross_margin_percent_min: 28, credit_period_days: 50, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Integrated Solutions', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'E-Commerce', project_type: 'Integrated Solutions', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Auto Outbound', project_type: 'Integrated Solutions', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'AFS (MnM)', project_type: 'Integrated Solutions', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Integrated Solutions', gross_margin_percent_min: 24, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 13, ebt_percent_min: 8 },
      { vertical: 'Transport Solutions Group', project_type: 'Integrated Solutions', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'FMCG and Pharma', project_type: 'Integrated Solutions', gross_margin_percent_min: 28, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 15, ebt_percent_min: 13 },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Integrated Solutions', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Integrated Solutions', gross_margin_percent_min: 22, credit_period_days: 35, capex_min_lakhs: 50, ebit_percent_min: 10, ebt_percent_min: 8 },
      { vertical: 'Field Sales - Telecom', project_type: 'Integrated Solutions', gross_margin_percent_min: 26, credit_period_days: 45, capex_min_lakhs: 80, ebit_percent_min: 25, ebt_percent_min: 19 },
    ];

    for (const row of rows) {
      // Upsert: only insert if not already present (by vertical + project_type)
      await queryInterface.sequelize.query(`
        INSERT INTO thresholds (id, vertical, project_type, gross_margin_percent_min, credit_period_days, capex_min_lakhs, ebit_percent_min, ebt_percent_min, created_at, updated_at)
        SELECT gen_random_uuid(), :vertical, :project_type, :gross_margin_percent_min, :credit_period_days, :capex_min_lakhs, :ebit_percent_min, :ebt_percent_min, NOW(), NOW()
        WHERE NOT EXISTS (
          SELECT 1 FROM thresholds WHERE vertical = :vertical AND project_type = :project_type
        )
      `, {
        replacements: row
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove all seeded rows (by vertical + project_type)
    const rows = [
      // ...same as above, but only vertical and project_type needed for deletion
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Warehousing and VAS' },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Transportation' },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'S and LF / Stockyards' },
      { vertical: 'E-Commerce', project_type: 'Warehousing and VAS' },
      { vertical: 'E-Commerce', project_type: 'Transportation' },
      { vertical: 'E-Commerce', project_type: 'S and LF / Stockyards' },
      { vertical: 'Auto Outbound', project_type: 'Warehousing and VAS' },
      { vertical: 'Auto Outbound', project_type: 'Transportation' },
      { vertical: 'Auto Outbound', project_type: 'S and LF / Stockyards' },
      { vertical: 'Enterprise Mobility', project_type: 'Transportation' },
      { vertical: 'Enterprise Mobility', project_type: 'S and LF / Stockyards' },
      { vertical: 'AFS (MnM)', project_type: 'Warehousing and VAS' },
      { vertical: 'AFS (MnM)', project_type: 'Transportation' },
      { vertical: 'AFS (MnM)', project_type: 'S and LF / Stockyards' },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Warehousing and VAS' },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Transportation' },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'S and LF / Stockyards' },
      { vertical: 'Transport Solutions Group', project_type: 'Transportation' },
      { vertical: 'Transport Solutions Group', project_type: 'S and LF / Stockyards' },
      { vertical: 'FMCG and Pharma', project_type: 'Warehousing and VAS' },
      { vertical: 'FMCG and Pharma', project_type: 'Transportation' },
      { vertical: 'FMCG and Pharma', project_type: 'S and LF / Stockyards' },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Warehousing and VAS' },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Transportation' },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'S and LF / Stockyards' },
      { vertical: 'Field Sales - Auto and Engineering(Non-MnM)', project_type: 'Warehousing and VAS' },
      { vertical: 'Field Sales - Auto and Engineering(Non-MnM)', project_type: 'Transportation' },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Warehousing and VAS' },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Transportation' },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'S and LF / Stockyards' },
      { vertical: 'Field Sales - Telecom', project_type: 'Warehousing and VAS' },
      { vertical: 'Field Sales - Telecom', project_type: 'Transportation' },
      { vertical: 'Field Sales - Telecom', project_type: 'S and LF / Stockyards' },
      { vertical: 'LMD', project_type: 'Delivery as Service' },
      { vertical: 'LMD', project_type: 'Distribution/EDSP/OXD/XL' },
      { vertical: 'LMD', project_type: 'MFC' },
      { vertical: 'LMD', project_type: 'EV Deliveries' },
      { vertical: 'Fleet Service Business', project_type: 'Pro Trucking' },
      { vertical: 'Fleet Service Business', project_type: 'E-Del' },
      { vertical: 'Auto and Engineering (Non-MnM)', project_type: 'Integrated Solutions' },
      { vertical: 'E-Commerce', project_type: 'Integrated Solutions' },
      { vertical: 'Auto Outbound', project_type: 'Integrated Solutions' },
      { vertical: 'AFS (MnM)', project_type: 'Integrated Solutions' },
      { vertical: 'Auto and Engineering - Telecom', project_type: 'Integrated Solutions' },
      { vertical: 'Transport Solutions Group', project_type: 'Integrated Solutions' },
      { vertical: 'FMCG and Pharma', project_type: 'Integrated Solutions' },
      { vertical: 'Consumer - CD, CE, AFR and Bazaar', project_type: 'Integrated Solutions' },
      { vertical: 'Field Sales - Consumer and Pharma', project_type: 'Integrated Solutions' },
      { vertical: 'Field Sales - Telecom', project_type: 'Integrated Solutions' },
    ];
    for (const row of rows) {
      await queryInterface.bulkDelete('thresholds', {
        vertical: row.vertical,
        project_type: row.project_type
      });
    }
  }
}; 