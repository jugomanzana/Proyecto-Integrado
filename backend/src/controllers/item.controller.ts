import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { deleteLocalFile } from '../utils/file.utils.js';
import { Op } from 'sequelize';
import { Item } from '../models/Item.js';

// ============================================================
// CONTROLLER: Items
// CRUD de prendas. Cada operación está aislada al userId
// del token para que un usuario nunca acceda a datos ajenos.
// ============================================================

/** GET /api/items — Listar prendas del usuario autenticado (con paginación y búsqueda) */
export const getItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { category, status, season, color, search, limit, offset } = req.query;

    const where: any = { userId };
    if (category && category !== 'Todas') where.category = category;
    if (status) where.status = status;
    if (season && season !== 'Todas') where.season = season;
    if (color && color !== 'Todos') where.color = color;

    if (search) {
      const q = `%${search}%`;
      where[Op.or] = [
        { name: { [Op.like]: q } },
        { color: { [Op.like]: q } },
        { category: { [Op.like]: q } },
      ];
    }

    const queryOptions: any = {
      where,
      order: [['createdAt', 'DESC']],
    };

    if (limit) queryOptions.limit = parseInt(limit as string, 10);
    if (offset) queryOptions.offset = parseInt(offset as string, 10);

    const items = await Item.findAll(queryOptions);
    res.status(200).json(items);
  } catch (error) {
    console.error('[items] getItems error:', error);
    res.status(500).json({ message: 'Error al obtener las prendas' });
  }
};

/** GET /api/items/:id — Detalle de una prenda */
export const getItemById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!item) {
      res.status(404).json({ message: 'Prenda no encontrada' });
      return;
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('[items] getItemById error:', error);
    res.status(500).json({ message: 'Error al obtener la prenda' });
  }
};

/** POST /api/items — Crear una prenda */
export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, color, season, size, fabric, status } = req.body;

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const fileUrl = req.file ? `${appUrl}/uploads/${req.file.filename}` : undefined;
    const finalImageUrl = fileUrl || req.body.imageUrl || null;

    if (!name || !category || !color || !season || !size || !finalImageUrl) {
      res.status(400).json({ message: 'Nombre, Categoría, Color, Temporada, Talla e Imagen son obligatorios' });
      return;
    }

    const item = await Item.create({
      userId: req.user!.id,
      name,
      category,
      color,
      imageUrl: finalImageUrl,
      season,
      size,
      fabric: fabric || null,
      status: status || 'Disponible',
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('[items] createItem error:', error);
    res.status(500).json({ message: 'Error al crear la prenda' });
  }
};

/** PUT /api/items/:id — Actualizar una prenda */
export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!item) {
      res.status(404).json({ message: 'Prenda no encontrada' });
      return;
    }

    const { name, category, color, season, size, fabric, status } = req.body;
    let finalImageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : item.imageUrl;

    if (!name || !category || !color || !season || !size) {
      res.status(400).json({ message: 'Nombre, Categoría, Color, Temporada y Talla son obligatorios' });
      return;
    }

    if (req.file) {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      // Si subió archivo nuevo, usarlo
      finalImageUrl = `${appUrl}/uploads/${req.file.filename}`;
      // Eliminar archivo antiguo si era local
      deleteLocalFile(item.imageUrl);
    }

    if (!finalImageUrl && !req.file) {
      res.status(400).json({ message: 'La imagen es obligatoria' });
      return;
    }

    await item.update({
      name,
      category,
      color,
      imageUrl: finalImageUrl,
      season,
      size,
      fabric: fabric || null,
      status
    });

    res.status(200).json(item);
  } catch (error) {
    console.error('[items] updateItem error:', error);
    res.status(500).json({ message: 'Error al actualizar la prenda' });
  }
};

/** DELETE /api/items/:id — Eliminar una prenda */
export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!item) {
      res.status(404).json({ message: 'Prenda no encontrada' });
      return;
    }

    // Si tiene imagen local, eliminarla de disco
    deleteLocalFile(item.imageUrl);

    await item.destroy();
    res.status(200).json({ message: 'Prenda eliminada correctamente' });
  } catch (error) {
    console.error('[items] deleteItem error:', error);
    res.status(500).json({ message: 'Error al eliminar la prenda' });
  }
};
