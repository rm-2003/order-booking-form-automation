'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('obf', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      project_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      opportunity_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      client_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      project_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_priority: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Draft'
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'draft'
      },
      working_data: {
        type: Sequelize.JSONB,
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
      },
      validation_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      validation_result: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      approval_status: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_approver_role: {
        type: Sequelize.STRING,
        allowNull: true
      },
      current_approver_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
    });

    // Add check constraint
    await queryInterface.sequelize.query(`
      ALTER TABLE obf ADD CONSTRAINT valid_status 
      CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'archived'));
    `);

    // Create indexes
    await queryInterface.addIndex('obf', ['project_code'], {
      name: 'idx_obf_project_code'
    });
    await queryInterface.addIndex('obf', ['opportunity_id'], {
      name: 'idx_obf_opportunity_id'
    });
    await queryInterface.addIndex('obf', ['project_type'], {
      name: 'idx_obf_project_type'
    });
    await queryInterface.addIndex('obf', ['project_category'], {
      name: 'idx_obf_project_category'
    });
    await queryInterface.addIndex('obf', ['project_priority'], {
      name: 'idx_obf_project_priority'
    });
    await queryInterface.addIndex('obf', ['project_status'], {
      name: 'idx_obf_project_status'
    });
    await queryInterface.addIndex('obf', ['status'], {
      name: 'idx_obf_status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('obf', 'validation_status');
    await queryInterface.removeColumn('obf', 'validation_result');
    await queryInterface.removeColumn('obf', 'approval_status');
    await queryInterface.removeColumn('obf', 'current_approver_role');
    await queryInterface.removeColumn('obf', 'current_approver_user_id');
    await queryInterface.dropTable('obf');
  }
}; 