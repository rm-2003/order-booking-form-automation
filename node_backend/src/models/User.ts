import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password?: string;
  provider: 'local' | 'google' | 'microsoft';
  providerId?: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare name: string;
  declare password?: string;
  declare provider: 'local' | 'google' | 'microsoft';
  declare providerId?: string;
  declare picture?: string;
  declare accessToken?: string;
  declare refreshToken?: string;
  declare role?: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  constructor(values?: any, options?: any) {
    super(values, options);
  }

  // Method to check password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('local', 'google', 'microsoft'),
      allowNull: false,
      defaultValue: 'local',
    },
    providerId: {
      type: DataTypes.STRING,
      allowNull: true,
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
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password!, salt);
        }
      },
    },
  }
);

export default User; 