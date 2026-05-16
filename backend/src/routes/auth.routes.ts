import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  updatePassword,
  getStats,
  deleteAccount
} from '../controllers/auth.controller.js';
import { validateSchema }         from '../middlewares/validate.middleware.js';
import { authenticateJWT }        from '../middlewares/auth.middleware.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(50),
    email: z.string().email('Email no válido'),
  }),
});

const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Contraseña actual requerida'),
    newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  }),
});

router.post('/register', validateSchema(registerSchema), register);
router.post('/login',    validateSchema(loginSchema),    login);
router.get('/me',        authenticateJWT,                getMe);
router.put('/profile',   authenticateJWT, validateSchema(updateProfileSchema), updateProfile);
router.put('/password',  authenticateJWT, validateSchema(updatePasswordSchema), updatePassword);

// Obtener estadísticas
router.get('/stats',     authenticateJWT,                getStats);

// Eliminar cuenta permanentemente
router.delete('/account', authenticateJWT,               deleteAccount);

export default router;
