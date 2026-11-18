'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create obf_revenue table
    await queryInterface.createTable('obf_revenue', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      obf_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'obf',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      monthly_fixed_revenue_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_fixed_revenue_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_fixed_revenue_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_fixed_revenue_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_fixed_revenue_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_variable_revenue_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_variable_revenue_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_variable_revenue_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_variable_revenue_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      monthly_variable_revenue_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_value_added_revenue_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_value_added_revenue_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_value_added_revenue_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_revenue_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_revenue_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_revenue_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      yoy_escalation_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      go_live_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create obf_ba_rates table
    await queryInterface.createTable('obf_ba_rates', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      obf_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'obf',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      warehouse_rent_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouse_rent_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouse_rent_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouse_rent_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      warehouse_rent_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_mgmt_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_mgmt_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_mgmt_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_mgmt_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_mgmt_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_min_wage_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_min_wage_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_min_wage_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_min_wage_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      manpower_cost_min_wage_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      consumables_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      consumables_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      consumables_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      consumables_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      consumables_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      capex_write_off_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      capex_write_off_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      capex_write_off_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      capex_write_off_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      capex_write_off_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_impl_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_impl_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_impl_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_impl_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      one_time_ammortised_cost_impl_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_ba_cost_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_ba_cost_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_ba_cost_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      yoy_escalation_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create obf_direct_expenses table
    await queryInterface.createTable('obf_direct_expenses', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      obf_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'obf',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      transport_cost_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_cost_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_cost_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_cost_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_cost_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_manpower_cost_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_manpower_cost_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_manpower_cost_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_manpower_cost_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      transport_manpower_cost_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gps_ct_running_expenses_qty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gps_ct_running_expenses_rate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gps_ct_running_expenses_amt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gps_ct_running_expenses_amt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gps_ct_running_expenses_amt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_direct_expenses_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_direct_expenses_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      total_direct_expenses_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      yoy_escalation_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create obf_financial_metrics table
    await queryInterface.createTable('obf_financial_metrics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      obf_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'obf',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      gross_margin_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_percent_year1: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      gross_percent_fy2026: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      gross_percent_contract: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      trade_discount_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      trade_discount_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      trade_discount_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_after_discount_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_after_discount_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_after_discount_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      gross_margin_after_discount_percent_year1: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      gross_margin_after_discount_percent_fy2026: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      gross_margin_after_discount_percent_contract: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      depreciation_ammortisation_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      depreciation_ammortisation_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      depreciation_ammortisation_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebit_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebit_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebit_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebit_percent_year1: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      ebit_percent_fy2026: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      ebit_percent_contract: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      interest_cost_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      interest_cost_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      interest_cost_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebt_year1: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebt_fy2026: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebt_contract: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ebt_percent_year1: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      ebt_percent_fy2026: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      ebt_percent_contract: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('obf_revenue', ['obf_id'], {
      name: 'idx_obf_revenue_obf_id'
    });
    await queryInterface.addIndex('obf_ba_rates', ['obf_id'], {
      name: 'idx_obf_ba_rates_obf_id'
    });
    await queryInterface.addIndex('obf_direct_expenses', ['obf_id'], {
      name: 'idx_obf_direct_expenses_obf_id'
    });
    await queryInterface.addIndex('obf_financial_metrics', ['obf_id'], {
      name: 'idx_obf_financial_metrics_obf_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.dropTable('obf_financial_metrics');
    await queryInterface.dropTable('obf_direct_expenses');
    await queryInterface.dropTable('obf_ba_rates');
    await queryInterface.dropTable('obf_revenue');
  }
}; 