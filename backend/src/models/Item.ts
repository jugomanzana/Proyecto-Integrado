import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

export class Item extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public category!: string; // e.g., 'T-shirts', 'Coats', 'Pants'
  public color!: string;
  public imageUrl!: string;
}

Item.init(
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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
  }
);

// Setup association
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'user' });
