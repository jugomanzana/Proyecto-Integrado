import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { Outfit } from '../models/Outfit.js';
import { Item }   from '../models/Item.js';

// ============================================================
// CONTROLLER: Outfits
// CRUD de outfits. itemIds almacena los IDs de prendas
// que componen el outfit (JSON array).
// ============================================================

// Prioridad de categorías para el collage: de más a menos representativa del outfit
const COLLAGE_CATEGORY_PRIORITY: string[] = [
  'Camiseta', 'Sudadera', 'Pantalón', 'Zapatos', 'Accesorios', 'Otro',
];

/** GET /api/outfits — Listar outfits del usuario (con preview de imágenes para collage) */
export const getOutfits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const outfits = await Outfit.findAll({
      where: { userId: req.user!.id },
      order: [['createdAt', 'DESC']],
    });

    // Para cada outfit, obtenemos las prendas y las ordenamos por categoría antes del collage
    const outfitsWithPreviews = await Promise.all(
      outfits.map(async (outfit) => {
        const allIds = outfit.itemIds ?? [];
        const allItems = allIds.length > 0
          ? await Item.findAll({
              where: { id: allIds, userId: req.user!.id },
              attributes: ['id', 'imageUrl', 'category'],
            })
          : [];

        // Ordenar por prioridad de categoría
        const sorted = [...allItems].sort((a, b) => {
          const pa = COLLAGE_CATEGORY_PRIORITY.indexOf(a.category);
          const pb = COLLAGE_CATEGORY_PRIORITY.indexOf(b.category);
          const rankA = pa === -1 ? COLLAGE_CATEGORY_PRIORITY.length : pa;
          const rankB = pb === -1 ? COLLAGE_CATEGORY_PRIORITY.length : pb;
          return rankA - rankB;
        });

        // Tomar las 4 mejores y extraer solo sus URLs
        const previewImageUrls = sorted
          .slice(0, 4)
          .map((i) => i.imageUrl)
          .filter(Boolean) as string[];

        return { ...outfit.toJSON(), previewImageUrls };
      })
    );

    res.status(200).json(outfitsWithPreviews);
  } catch (error) {
    console.error('[outfits] getOutfits error:', error);
    res.status(500).json({ message: 'Error al obtener los outfits' });
  }
};

/** GET /api/outfits/:id — Detalle de un outfit con sus prendas */
export const getOutfitById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const outfit = await Outfit.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!outfit) {
      res.status(404).json({ message: 'Outfit no encontrado' });
      return;
    }

    // Incluir las prendas del outfit en la respuesta
    const items = outfit.itemIds.length > 0
      ? await Item.findAll({ where: { id: outfit.itemIds, userId: req.user!.id } })
      : [];

    res.status(200).json({ ...outfit.toJSON(), items });
  } catch (error) {
    console.error('[outfits] getOutfitById error:', error);
    res.status(500).json({ message: 'Error al obtener el outfit' });
  }
};

/** POST /api/outfits — Crear un outfit */
export const createOutfit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, itemIds } = req.body;

    // Verificar que todos los itemIds pertenecen al usuario
    if (itemIds && itemIds.length > 0) {
      const count = await Item.count({ where: { id: itemIds, userId: req.user!.id } });
      if (count !== itemIds.length) {
        res.status(400).json({ message: 'Algunas prendas no existen o no te pertenecen' });
        return;
      }
    }

    const outfit = await Outfit.create({
      userId:      req.user!.id,
      name,
      description: description ?? null,
      itemIds:     itemIds     ?? [],
    });

    res.status(201).json(outfit);
  } catch (error) {
    console.error('[outfits] createOutfit error:', error);
    res.status(500).json({ message: 'Error al crear el outfit' });
  }
};

/** PUT /api/outfits/:id — Actualizar un outfit */
export const updateOutfit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const outfit = await Outfit.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!outfit) {
      res.status(404).json({ message: 'Outfit no encontrado' });
      return;
    }

    const { name, description, itemIds } = req.body;

    // Verificar que los nuevos itemIds pertenecen al usuario
    if (itemIds && itemIds.length > 0) {
      const count = await Item.count({ where: { id: itemIds, userId: req.user!.id } });
      if (count !== itemIds.length) {
        res.status(400).json({ message: 'Algunas prendas no existen o no te pertenecen' });
        return;
      }
    }

    await outfit.update({ name, description, itemIds });
    res.status(200).json(outfit);
  } catch (error) {
    console.error('[outfits] updateOutfit error:', error);
    res.status(500).json({ message: 'Error al actualizar el outfit' });
  }
};

/** DELETE /api/outfits/:id — Eliminar un outfit */
export const deleteOutfit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const outfit = await Outfit.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!outfit) {
      res.status(404).json({ message: 'Outfit no encontrado' });
      return;
    }

    await outfit.destroy();
    res.status(200).json({ message: 'Outfit eliminado correctamente' });
  } catch (error) {
    console.error('[outfits] deleteOutfit error:', error);
    res.status(500).json({ message: 'Error al eliminar el outfit' });
  }
};
