import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { CostBreakupAttributes } from '../types';

interface CostBreakupInstance extends Model<CostBreakupAttributes, CostBreakupAttributes>, CostBreakupAttributes {}

const CostBreakup = sequelize.define<CostBreakupInstance>('CostBreakup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  obf_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'obf',
      key: 'id'
    }
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR'
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
  tableName: 'cost_breakups'
});

export default CostBreakup; 