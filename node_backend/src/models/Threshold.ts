import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

interface ThresholdAttributes {
  id?: string;
  vertical: string;
  project_type: string;
  gross_margin_percent_min: number;
  credit_period_days: number;
  capex_min_lakhs: number;
  ebit_percent_min: number;
  ebt_percent_min: number;
  created_at?: Date;
  updated_at?: Date;
}

interface ThresholdInstance extends Model<ThresholdAttributes>, ThresholdAttributes {}

const Threshold = sequelize.define<ThresholdInstance>('Threshold', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vertical: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gross_margin_percent_min: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  credit_period_days: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  capex_min_lakhs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  ebit_percent_min: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  ebt_percent_min: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'thresholds'
});

export default Threshold; 