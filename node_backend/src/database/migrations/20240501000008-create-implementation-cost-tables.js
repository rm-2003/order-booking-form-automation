'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create obf_implementation_cost table
    await queryInterface.createTable('obf_implementation_cost', {
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
      cost_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      nos: {
        type: Sequelize.DECIMAL(10, 2),
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

    // Add unique constraint for obf_id and cost_type
    await queryInterface.addConstraint('obf_implementation_cost', {
      fields: ['obf_id', 'cost_type'],
      type: 'unique',
      name: 'unique_obf_implementation_cost'
    });

    // Create obf_pre_go_live_manpower table
    await queryInterface.createTable('obf_pre_go_live_manpower', {
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
      manpower_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      cost_per_month: {
        type: Sequelize.DECIMAL(10, 2),
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

    // Add unique constraint for obf_id and manpower_type
    await queryInterface.addConstraint('obf_pre_go_live_manpower', {
      fields: ['obf_id', 'manpower_type'],
      type: 'unique',
      name: 'unique_obf_pre_go_live_manpower'
    });

    // Create obf_additional_implementation_cost table
    await queryInterface.createTable('obf_additional_implementation_cost', {
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
      description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      nos: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.addIndex('obf_implementation_cost', ['obf_id'], {
      name: 'idx_obf_implementation_cost_obf_id'
    });
    await queryInterface.addIndex('obf_implementation_cost', ['cost_type'], {
      name: 'idx_obf_implementation_cost_type'
    });

    await queryInterface.addIndex('obf_pre_go_live_manpower', ['obf_id'], {
      name: 'idx_obf_pre_go_live_manpower_obf_id'
    });
    await queryInterface.addIndex('obf_pre_go_live_manpower', ['manpower_type'], {
      name: 'idx_obf_pre_go_live_manpower_type'
    });

    await queryInterface.addIndex('obf_additional_implementation_cost', ['obf_id'], {
      name: 'idx_obf_additional_implementation_cost_obf_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.dropTable('obf_additional_implementation_cost');
    await queryInterface.dropTable('obf_pre_go_live_manpower');
    await queryInterface.dropTable('obf_implementation_cost');
  }
}; 