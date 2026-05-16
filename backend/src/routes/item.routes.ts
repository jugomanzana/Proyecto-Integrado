import { Router } from 'express';
import { z } from 'zod';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { validateSchema }  from '../middlewares/validate.middleware.js';
import { upload }          from '../middlewares/upload.middleware.js';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/item.controller.js';

// ============================================================
// RUTAS: /api/items — todas protegidas con JWT
// ============================================================

const router = Router();

// Valores de enums en español
const SEASONS  = ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el año'] as const;
const STATUSES = ['Disponible', 'Lavandería', 'Prestado'] as const;

const createItemSchema = z.object({
  body: z.object({
    name:     z.string().min(1, 'El nombre es obligatorio').max(100),
    category: z.string().min(1, 'La categoría es obligatoria').max(50),
    color:    z.string().max(50).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    season:   z.enum([...SEASONS, ''] as [string, ...string[]]).optional().transform(v => v === '' ? undefined : v),
    fabric:   z.string().max(100).optional(),
    status:   z.enum(STATUSES).optional(),
  }),
});

const updateItemSchema = z.object({
  body: z.object({
    name:     z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(50).optional(),
    color:    z.string().max(50).optional().nullable(),
    imageUrl: z.string().url().optional().nullable().or(z.literal('')),
    season:   z.enum([...SEASONS, ''] as [string, ...string[]]).optional().nullable().transform(v => v === '' ? undefined : v),
    fabric:   z.string().max(100).optional().nullable(),
    status:   z.enum(STATUSES).optional(),
  }),
});

router.use(authenticateJWT);  // Protege todas las rutas del router

router.get('/',    getItems);
router.get('/:id', getItemById);
router.post('/',   upload.single('image'), validateSchema(createItemSchema), createItem);
router.put('/:id', upload.single('image'), validateSchema(updateItemSchema), updateItem);
router.delete('/:id', deleteItem);

export default router;
