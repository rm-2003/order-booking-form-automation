import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn('users', 'password', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  // Update provider enum to include 'local'
  await queryInterface.sequelize.query(`
    ALTER TABLE users 
    ALTER COLUMN provider TYPE VARCHAR(255),
    DROP CONSTRAINT IF EXISTS users_provider_check;
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE users 
    ADD CONSTRAINT users_provider_check 
    CHECK (provider IN ('local', 'google', 'microsoft'));
  `);

  // Make providerId nullable since local users won't have it
  await queryInterface.changeColumn('users', 'providerId', {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('users', 'password');
  
  // Revert provider enum changes
  await queryInterface.sequelize.query(`
    ALTER TABLE users 
    ALTER COLUMN provider TYPE VARCHAR(255),
    DROP CONSTRAINT IF EXISTS users_provider_check;
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE users 
    ADD CONSTRAINT users_provider_check 
    CHECK (provider IN ('google', 'microsoft'));
  `);

  // Make providerId required again
  await queryInterface.changeColumn('users', 'providerId', {
    type: DataTypes.STRING,
    allowNull: false,
  });
} 