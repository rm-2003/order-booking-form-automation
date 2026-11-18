import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { OBFAttributes } from '../types';
import CostBreakup from './CostBreakup';
import User from './User';

class OBF extends Model<OBFAttributes> implements OBFAttributes {
  declare id: string;
  declare client_name: string;
  declare project_name: string;
  declare status: 'draft' | 'submitted' | 'approved' | 'rejected';
  declare created_at: Date;
  declare updated_at: Date;
  declare project_code: string;
  declare creatorId: string;
  declare validation_status?: string | null;
  declare validation_result?: any;
}

OBF.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  client_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  project_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'),
    defaultValue: 'draft'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  creatorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  validation_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  validation_result: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'obf'
});

// Define relationships
OBF.hasMany(CostBreakup, { 
  foreignKey: 'obf_id',
  as: 'cost_breakups'
});

CostBreakup.belongsTo(OBF, {
  foreignKey: 'obf_id',
  as: 'obf'
});

OBF.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

export default OBF; 