'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create all enum types
    await queryInterface.sequelize.query(`
      CREATE TYPE state_type AS ENUM (
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands -UT', 'Chandigarh -UT',
        'Dadra & Nagar Haveli and Daman & Diu -UT', 'Delhi -UT',
        'Jammu and Kashmir -UT', 'Lakshadweep -UT', 'Puducherry-UT', 'Ladakh-UT'
      );

      CREATE TYPE vertical_type AS ENUM (
        'Auto and Engineering (Non-MnM)', 'E-Commerce', 'Auto Outbound',
        'Transportation', 'Enterprise Mobility', 'S and LF / Stockyards',
        'AFS (MnM)', 'Auto and Engineering - Telecom', 'Distribution/EDSP/OXD/XL',
        'Transport Solutions Group', 'MFC', 'FMCG and Pharma', 'EV Deliveries',
        'Consumer - CD, CE, AFR and Bazaar', 'Field Sales - Auto and Engineering(Non-MnM)',
        'Field Sales - Consumer and Pharma', 'Field Sales - Telecom', 'LMD'
      );

      CREATE TYPE project_type AS ENUM (
        'New', 'Extension', 'Renewal', 'EV Deliveries'
      );

      CREATE TYPE project_category AS ENUM (
        'Implementation', 'Support', 'Maintenance'
      );

      CREATE TYPE project_priority AS ENUM (
        'High', 'Medium', 'Low'
      );

      CREATE TYPE project_status AS ENUM (
        'Draft', 'In Progress', 'Completed', 'On Hold'
      );

      CREATE TYPE cost_category AS ENUM (
        'Manpower', 'Equipment', 'Materials', 'Services', 'Travel', 'Other'
      );

      CREATE TYPE implementation_phase AS ENUM (
        'Planning', 'Development', 'Testing', 'Deployment', 'Training', 'Support'
      );

      CREATE TYPE location AS ENUM (
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'
      );

      CREATE TYPE capex_amortisation_type AS ENUM (
        'Life of Asset', 'Contract Period'
      );

      CREATE TYPE interest_type AS ENUM (
        'Reducing Balance', 'PMT', 'EMI'
      );

      CREATE TYPE yes_no_type AS ENUM (
        'Yes', 'No'
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop all enum types
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS yes_no_type CASCADE;
      DROP TYPE IF EXISTS interest_type CASCADE;
      DROP TYPE IF EXISTS capex_amortisation_type CASCADE;
      DROP TYPE IF EXISTS location CASCADE;
      DROP TYPE IF EXISTS implementation_phase CASCADE;
      DROP TYPE IF EXISTS cost_category CASCADE;
      DROP TYPE IF EXISTS project_status CASCADE;
      DROP TYPE IF EXISTS project_priority CASCADE;
      DROP TYPE IF EXISTS project_category CASCADE;
      DROP TYPE IF EXISTS project_type CASCADE;
      DROP TYPE IF EXISTS vertical_type CASCADE;
      DROP TYPE IF EXISTS state_type CASCADE;
    `);
  }
}; 