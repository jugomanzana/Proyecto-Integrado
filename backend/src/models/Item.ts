import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import { User } from './User.js';

// Tipos en español — fuente única de verdad, sin capa de traducción
export type ItemSeason = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno' | 'Todo el año';
export type ItemStatus = 'Disponible' | 'Lavandería' | 'Prestado';

export class Item extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public category!: string;       // 'Camisetas', 'Abrigos', 'Pantalones'…
  public color!: string;
  public imageUrl!: string;
  public season!: ItemSeason;
  public size!: string;
  public fabric!: string | null;  // Algodón, Lana, Poliéster…
  public status!: ItemStatus;
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
      type: DataTypes.ENUM('Disponible', 'Lavandería', 'Prestado'),
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

