import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';
import OBF from './OBF';

export interface OBFAccessAttributes {
  id: string;
  obfId: string;
  userId: string;
  accessLevel: 'view' | 'edit' | 'admin';
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class OBFAccess extends Model<OBFAccessAttributes> implements OBFAccessAttributes {
  declare id: string;
  declare obfId: string;
  declare userId: string;
  declare accessLevel: 'view' | 'edit' | 'admin';
  declare role: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

OBFAccess.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    obfId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'obfs',
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: 'OBFAccess',
    tableName: 'obf_access',
    indexes: [
      {
        unique: true,
        fields: ['obfId', 'userId'],
      },
    ],
  }
);

// Set up associations
OBFAccess.belongsTo(User, { foreignKey: 'userId' });
OBFAccess.belongsTo(OBF, { foreignKey: 'obfId' });

export default OBFAccess; 