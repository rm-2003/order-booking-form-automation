import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { ProjectAttributes } from '../types';

interface ProjectInstance extends Model<ProjectAttributes, ProjectAttributes>, ProjectAttributes {}

const Project = sequelize.define<ProjectInstance>('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Project name cannot be empty'
      }
    }
  },
  project_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Project code cannot be empty'
      }
    }
  },
  client_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Client name cannot be empty'
      }
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'on-hold', 'cancelled'),
    defaultValue: 'active'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'projects'
});

export default Project; 