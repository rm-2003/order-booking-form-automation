'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create obf_manpower_breakup table
    await queryInterface.createTable('obf_manpower_breakup', {
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
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      role_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      mll_grade: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      roll: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      ctc: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      nos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      master_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'manpower',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

    // Add unique constraint for obf_id and sr_no
    await queryInterface.addConstraint('obf_manpower_breakup', {
      fields: ['obf_id', 'sr_no'],
      type: 'unique',
      name: 'unique_obf_manpower_breakup'
    });

    // Create obf_capex_breakup table
    await queryInterface.createTable('obf_capex_breakup', {
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
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      asset: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      asset_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      period: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      amc: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      unit_cost: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      nos: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      master_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'capex',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

    // Add unique constraint for obf_id and sr_no
    await queryInterface.addConstraint('obf_capex_breakup', {
      fields: ['obf_id', 'sr_no'],
      type: 'unique',
      name: 'unique_obf_capex_breakup'
    });

    // Create obf_opex_breakup table
    await queryInterface.createTable('obf_opex_breakup', {
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
      sr_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cost_description: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      unit_cost_per_month: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      nos: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      master_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'opex',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

    // Add unique constraint for obf_id and sr_no
    await queryInterface.addConstraint('obf_opex_breakup', {
      fields: ['obf_id', 'sr_no'],
      type: 'unique',
      name: 'unique_obf_opex_breakup'
    });

    // Create obf_rent_breakup table
    await queryInterface.createTable('obf_rent_breakup', {
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
      built_up_to_carpet_ratio: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      rent_per_sqft_on_built_up: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      built_up_area_sqft: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      building_maintenance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      warai_charges: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      interest_on_security_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      security_deposit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      brokerage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      pre_go_live_rental: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      stamp_duty_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      registration_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      master_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'rental',
          key: 'id'
        },
        onDelete: 'SET NULL'
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

    // Add unique constraint for obf_id
    await queryInterface.addConstraint('obf_rent_breakup', {
      fields: ['obf_id'],
      type: 'unique',
      name: 'unique_obf_rent_breakup'
    });

    // Create indexes
    await queryInterface.addIndex('obf_manpower_breakup', ['obf_id'], {
      name: 'idx_obf_manpower_breakup_obf_id'
    });
    await queryInterface.addIndex('obf_manpower_breakup', ['master_id'], {
      name: 'idx_obf_manpower_breakup_master_id'
    });
    await queryInterface.addIndex('obf_manpower_breakup', ['category'], {
      name: 'idx_obf_manpower_breakup_category'
    });
    await queryInterface.addIndex('obf_manpower_breakup', ['role_description'], {
      name: 'idx_obf_manpower_breakup_role'
    });

    await queryInterface.addIndex('obf_capex_breakup', ['obf_id'], {
      name: 'idx_obf_capex_breakup_obf_id'
    });
    await queryInterface.addIndex('obf_capex_breakup', ['master_id'], {
      name: 'idx_obf_capex_breakup_master_id'
    });
    await queryInterface.addIndex('obf_capex_breakup', ['category'], {
      name: 'idx_obf_capex_breakup_category'
    });
    await queryInterface.addIndex('obf_capex_breakup', ['asset'], {
      name: 'idx_obf_capex_breakup_asset'
    });

    await queryInterface.addIndex('obf_opex_breakup', ['obf_id'], {
      name: 'idx_obf_opex_breakup_obf_id'
    });
    await queryInterface.addIndex('obf_opex_breakup', ['master_id'], {
      name: 'idx_obf_opex_breakup_master_id'
    });
    await queryInterface.addIndex('obf_opex_breakup', ['cost_description'], {
      name: 'idx_obf_opex_breakup_description'
    });

    await queryInterface.addIndex('obf_rent_breakup', ['obf_id'], {
      name: 'idx_obf_rent_breakup_obf_id'
    });
    await queryInterface.addIndex('obf_rent_breakup', ['master_id'], {
      name: 'idx_obf_rent_breakup_master_id'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order
    await queryInterface.removeColumn('obf_rent_breakup', 'security_deposit');
    await queryInterface.removeColumn('obf_rent_breakup', 'stamp_duty_amount');
    await queryInterface.removeColumn('obf_rent_breakup', 'registration_amount');
    await queryInterface.dropTable('obf_rent_breakup');
    await queryInterface.dropTable('obf_opex_breakup');
    await queryInterface.dropTable('obf_capex_breakup');
    await queryInterface.dropTable('obf_manpower_breakup');
  }
}; 