'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('obf_history', {
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
      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      changes: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      changed_by: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('obf_history', ['obf_id'], {
      name: 'idx_obf_history_obf_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('obf_history');
  }
}; 