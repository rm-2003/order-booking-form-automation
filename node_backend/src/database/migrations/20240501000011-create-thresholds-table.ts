import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('thresholds', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vertical: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gross_margin_percent_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    credit_period_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capex_min_lakhs: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ebit_percent_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    ebt_percent_min: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add unique constraint for vertical and project_type combination
  await queryInterface.addIndex('thresholds', ['vertical', 'project_type'], {
    unique: true,
    name: 'thresholds_vertical_project_type_unique'
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('thresholds');
} 