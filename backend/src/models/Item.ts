import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

// Tipos en español — fuente única de verdad, sin capa de traducción
export type ItemSeason = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno' | 'Todo el año';
export type ItemStatus = 'Disponible' | 'Colada' | 'Prestado';

export class Item extends Model {
  declare id: number;
  declare userId: number;
  declare name: string;
  declare category: string;       // 'Camisetas', 'Abrigos', 'Pantalones'…
  declare color: string;
  declare imageUrl: string;
  declare season: ItemSeason;
  declare size: string;
  declare fabric: string | null;  // Algodón, Lana, Poliéster…
  declare status: ItemStatus;
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
      references: { model: 'users', key: 'id' },
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
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season: {
      type: DataTypes.ENUM('Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el año'),
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fabric: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Disponible', 'Colada', 'Prestado'),
      allowNull: false,
      defaultValue: 'Disponible',
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
  }
);

// Asociaciones
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
Item.belongsTo(User, { foreignKey: 'userId', as: 'user' });

