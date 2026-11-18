'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First add the column as nullable
    await queryInterface.addColumn('obf', 'creatorId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    });

    // Get the first user from the users table to set as default creator
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM users ORDER BY "createdAt" ASC LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (users && users.length > 0) {
      const defaultUserId = users[0].id;
      
      // Update all existing records with the default user
      await queryInterface.sequelize.query(
        `UPDATE obf SET "creatorId" = :defaultUserId WHERE "creatorId" IS NULL`,
        {
          replacements: { defaultUserId },
          type: Sequelize.QueryTypes.UPDATE
        }
      );
    }

    // Now make the column NOT NULL
    await queryInterface.changeColumn('obf', 'creatorId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    });

    // Add index for creatorId
    await queryInterface.addIndex('obf', ['creatorId'], {
      name: 'idx_obf_creator_id'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('obf', 'idx_obf_creator_id');
    await queryInterface.removeColumn('obf', 'creatorId');
  }
}; 