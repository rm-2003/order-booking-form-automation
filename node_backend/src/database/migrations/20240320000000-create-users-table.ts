import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM('google', 'microsoft'),
      allowNull: false,
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accessToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Salesperson',
    },
  });

  // Add unique constraint for provider + providerId combination
  await queryInterface.addIndex('users', ['provider', 'providerId'], {
    unique: true,
    name: 'users_provider_providerId_unique',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('users', 'role');
  await queryInterface.dropTable('users');
} 