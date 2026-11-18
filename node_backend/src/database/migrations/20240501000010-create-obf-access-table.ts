import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('obf_access', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    obfId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'obf',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    accessLevel: {
      type: DataTypes.ENUM('view', 'edit', 'admin'),
      allowNull: false,
      defaultValue: 'view',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Add unique constraint for obfId and userId combination
  await queryInterface.addIndex('obf_access', ['obfId', 'userId'], {
    unique: true,
    name: 'obf_access_obfId_userId_unique'
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn('obf_access', 'role');
  await queryInterface.dropTable('obf_access');
} 