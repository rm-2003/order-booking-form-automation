'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('obf_input_result', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'obf',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      opportunity_id: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vertical: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      projection_period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      customer_payment_terms: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      capex_amortisation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amc_first_year: {
        type: Sequelize.STRING,
        allowNull: false
      },
      depreciation: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      interest: {
        type: Sequelize.STRING,
        allowNull: false
      },
      asset_backing: {
        type: Sequelize.STRING,
        allowNull: false
      },
      redeploy_asset: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // YOY Escalation
      rentals_escalation: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      manpower_mgmt_escalation: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      manpower_min_wage_escalation: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      capex_cost_escalation: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      operating_cost_escalation: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      // Credit Period
      rentals_credit_period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      manpower_mgmt_credit_period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      manpower_min_wage_credit_period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      capex_cost_credit_period: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      operating_cost_credit_period: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('obf_input_result', ['project_id'], {
      name: 'idx_obf_input_result_project_id'
    });
    await queryInterface.addIndex('obf_input_result', ['state'], {
      name: 'idx_obf_input_result_state'
    });
    await queryInterface.addIndex('obf_input_result', ['vertical'], {
      name: 'idx_obf_input_result_vertical'
    });
    await queryInterface.addIndex('obf_input_result', ['project_type'], {
      name: 'idx_obf_input_result_project_type'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('obf_input_result');
  }
}; 