import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface NotificationAttributes {
  id: string;
  user_id: string;
  obf_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'read' | 'created_at' | 'updated_at'> {}

class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: string;
  public user_id!: string;
  public obf_id!: string;
  public type!: string;
  public message!: string;
  public read!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    obf_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: false,
  }
);

export default Notification; 