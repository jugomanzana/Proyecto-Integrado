import { Router } from 'express';
import { z } from 'zod';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { validateSchema }  from '../middlewares/validate.middleware.js';
import {
  getOutfits,
  getOutfitById,
  createOutfit,
  updateOutfit,
  deleteOutfit,
} from '../controllers/outfit.controller.js';

// ============================================================
// RUTAS: /api/outfits — todas protegidas con JWT
// ============================================================

const router = Router();

const createOutfitSchema = z.object({
  body: z.object({
    name:        z.string().min(1, 'El nombre es obligatorio').max(100),
    description: z.string().max(500).optional(),
    itemIds:     z.array(z.number().int().positive()).optional().default([]),
  }),
});

const updateOutfitSchema = z.object({
  body: z.object({
    name:        z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    itemIds:     z.array(z.number().int().positive()).optional(),
  }),
});

router.use(authenticateJWT);

router.get('/',    getOutfits);
router.get('/:id', getOutfitById);
router.post('/',   validateSchema(createOutfitSchema), createOutfit);
router.put('/:id', validateSchema(updateOutfitSchema), updateOutfit);
router.delete('/:id', deleteOutfit);

export default router;
