import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

export class Outfit extends Model {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare description: string;
  declare itemIds: number[]; // Storing JSON array of Item IDs for simplicity
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
      get() {
        const rawValue = this.getDataValue('itemIds');
        if (!rawValue) return [];
        // Si el driver de MySQL lo devuelve como String, lo parseamos a Array numérico real
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
      },
      set(value) {
        // Nos aseguramos de que siempre guarde la estructura limpia (evita dobles stringificaciones)
        const newValue = typeof value === 'string' ? JSON.parse(value) : value;
        this.setDataValue('itemIds', newValue);
      },
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
