import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

export class Outfit extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  public itemIds!: number[]; // Storing JSON array of Item IDs for simplicity
}

Outfit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    itemIds: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'outfits',
    timestamps: true,
  }
);

// Setup association
User.hasMany(Outfit, { foreignKey: 'userId', as: 'outfits' });
Outfit.belongsTo(User, { foreignKey: 'userId', as: 'user' });
