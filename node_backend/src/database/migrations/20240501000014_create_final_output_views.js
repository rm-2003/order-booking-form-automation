'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create view for manpower breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_manpower_breakup AS
      SELECT 
        mb.id,
        mb.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        mb.sr_no,
        mb.role_description,
        mb.mll_grade,
        mb.category,
        mb.roll,
        mb.ctc,
        mb.nos,
        mb.master_id,
        mb.created_at,
        mb.updated_at
      FROM obf_manpower_breakup mb
      JOIN obf o ON mb.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for capex breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_capex_breakup AS
      SELECT 
        cb.id,
        cb.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        cb.sr_no,
        cb.asset,
        cb.asset_description,
        cb.nos as quantity,
        cb.unit_cost,
        (cb.nos * cb.unit_cost) as total_cost,
        cb.master_id,
        cb.created_at,
        cb.updated_at
      FROM obf_capex_breakup cb
      JOIN obf o ON cb.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for opex breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_opex_breakup AS
      SELECT 
        ob.id,
        ob.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description as project_description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        ob.sr_no,
        ob.cost_description as description,
        ob.nos as quantity,
        ob.unit_cost_per_month as unit_cost,
        (ob.unit_cost_per_month * ob.nos) as total_cost,
        ob.master_id,
        ob.created_at,
        ob.updated_at
      FROM obf_opex_breakup ob
      JOIN obf o ON ob.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for rental breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_rental_breakup AS
      SELECT 
        rb.id,
        rb.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        rb.built_up_to_carpet_ratio,
        rb.rent_per_sqft_on_built_up,
        rb.built_up_area_sqft,
        rb.building_maintenance,
        rb.warai_charges,
        rb.interest_on_security_deposit,
        rb.security_deposit,
        rb.brokerage,
        rb.pre_go_live_rental,
        rb.stamp_duty_amount,
        rb.registration_amount,
        rb.master_id,
        rb.created_at,
        rb.updated_at
      FROM obf_rent_breakup rb
      JOIN obf o ON rb.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for implementation cost breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_implementation_cost_breakup AS
      SELECT 
        ic.id,
        ic.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        ic.cost_type,
        ic.nos as quantity,
        ic.unit_cost,
        (ic.unit_cost * ic.nos) as total_cost,
        ic.created_at,
        ic.updated_at
      FROM obf_implementation_cost ic
      JOIN obf o ON ic.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for pre-go-live manpower breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_pre_go_live_manpower_breakup AS
      SELECT 
        pg.id,
        pg.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        pg.manpower_type,
        pg.nos,
        pg.cost_per_month,
        (pg.nos * pg.cost_per_month) as amount,
        pg.created_at,
        pg.updated_at
      FROM obf_pre_go_live_manpower pg
      JOIN obf o ON pg.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for additional implementation cost breakup
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_additional_implementation_cost_breakup AS
      SELECT 
        aic.id,
        aic.obf_id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description as project_description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        ir.vertical,
        ir.location,
        ir.state,
        aic.description,
        aic.nos as quantity,
        aic.unit_cost,
        (aic.unit_cost * aic.nos) as total_cost,
        aic.created_at,
        aic.updated_at
      FROM obf_additional_implementation_cost aic
      JOIN obf o ON aic.obf_id = o.id
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id;
    `);

    // Create view for final output
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW vw_final_output AS
      SELECT 
        o.id,
        o.project_code,
        o.project_name,
        o.opportunity_id,
        o.client_name,
        o.description,
        o.project_type,
        o.project_category,
        o.project_priority,
        o.project_status,
        o.status,
        o.working_data,
        o.created_at,
        o.updated_at,
        o.validation_status,
        o.validation_result,
        COALESCE(o.approval_status, NULL) as approval_status,
        COALESCE(o.current_approver_role, NULL) as current_approver_role,
        COALESCE(o.current_approver_user_id, NULL) as current_approver_user_id,
        ir.vertical,
        ir.location,
        ir.state,
        ir.customer_payment_terms,
        ir.project_type as input_project_type,
        metrics.gross_margin_year1 as monthly_revenue,
        metrics.gross_margin_fy2026 as monthly_opex,
        metrics.gross_margin_contract as monthly_rent,
        metrics.gross_percent_year1 as monthly_manpower_cost,
        metrics.gross_percent_fy2026 as monthly_other_cost,
        metrics.gross_percent_contract as monthly_total_cost,
        metrics.ebit_year1 as monthly_ebitda,
        metrics.ebit_percent_year1 as monthly_ebitda_percentage,
        metrics.ebit_fy2026 as yearly_revenue,
        metrics.ebit_contract as yearly_opex,
        metrics.ebit_percent_fy2026 as yearly_rent,
        metrics.ebit_percent_contract as yearly_manpower_cost,
        metrics.ebt_year1 as yearly_other_cost,
        metrics.ebt_fy2026 as yearly_total_cost,
        metrics.ebt_contract as yearly_ebitda,
        metrics.ebt_percent_year1 as yearly_ebitda_percentage,
        metrics.created_at as metrics_created_at,
        metrics.updated_at as metrics_updated_at,
        mp.manpower_mll,
        mp.manpower_ba,
        mp.manpower_security,
        mp.manpower_total,
        fc.total_capex,
        fo.rentals as one_time_rentals,
        fo.rent_related as one_time_rent_related,
        fo.impl_cost as one_time_impl_cost,
        fo.capex_1st_month_write_off as one_time_capex_1st_month_write_off,
        r.go_live_date as go_live_date
      FROM obf o
      LEFT JOIN obf_input_result ir ON o.id = ir.project_id
      LEFT JOIN obf_financial_metrics metrics ON o.id = metrics.obf_id
      LEFT JOIN obf_revenue r ON o.id = r.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          SUM(CASE WHEN roll = 'MLL' THEN nos ELSE 0 END) as manpower_mll,
          SUM(nos) - SUM(CASE WHEN roll = 'MLL' THEN nos ELSE 0 END) - SUM(CASE WHEN category = 'Security' THEN nos ELSE 0 END) as manpower_ba,
          SUM(CASE WHEN category = 'Security' THEN nos ELSE 0 END) as manpower_security,
          SUM(nos) as manpower_total
        FROM obf_manpower_breakup
        GROUP BY obf_id
      ) mp ON o.id = mp.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          COALESCE(SUM(unit_cost * nos), 0) as total_capex
        FROM obf_capex_breakup
        GROUP BY obf_id
      ) fc ON o.id = fc.obf_id
      LEFT JOIN (
        SELECT 
          obf_id,
          SUM(pre_go_live_rental) as rentals,
          SUM(stamp_duty_amount + registration_amount) as rent_related,
          (
            SELECT COALESCE(SUM(unit_cost * nos), 0)
            FROM obf_implementation_cost
            WHERE obf_id = rb.obf_id
          ) + (
            SELECT COALESCE(SUM(cost_per_month * nos), 0)
            FROM obf_pre_go_live_manpower
            WHERE obf_id = rb.obf_id
          ) + (
            SELECT COALESCE(SUM(unit_cost * nos), 0)
            FROM obf_additional_implementation_cost
            WHERE obf_id = rb.obf_id
          ) as impl_cost,
          0 as capex_1st_month_write_off
        FROM obf_rent_breakup rb
        GROUP BY obf_id
      ) fo ON o.id = fo.obf_id;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop all views
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_manpower_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_capex_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_opex_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_rental_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_implementation_cost_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_pre_go_live_manpower_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_additional_implementation_cost_breakup;`);
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS vw_final_output;`);
  }
}; 