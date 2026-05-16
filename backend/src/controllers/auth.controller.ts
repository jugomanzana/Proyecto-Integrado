import type { Request, Response } from 'express';
import type { AuthRequest } from '../middlewares/auth.middleware.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js';
import { deleteLocalFile } from '../utils/file.utils.js';
import { User } from '../models/User.js';
import { Item } from '../models/Item.js';
import { Outfit } from '../models/Outfit.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'User',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = generateToken(payload);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/** GET /api/auth/me — Devuelve el usuario autenticado actual */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'username', 'email', 'role'],
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

/** PUT /api/auth/profile — Actualiza username y email */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;
    
    // Verificar si el email ya existe en otro usuario
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== req.user!.id) {
      res.status(400).json({ message: 'El email ya está en uso por otra cuenta' });
      return;
    }

    const user = await User.findByPk(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    await user.update({ username, email });
    res.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

/** PUT /api/auth/password — Actualiza la contraseña validando la actual */
export const updatePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user!.id);

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'La contraseña actual es incorrecta' });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    await user.update({ password: hashedPassword });
    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('updatePassword error:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};

/** GET /api/auth/stats — Devuelve estadísticas del armario del usuario */
export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalItems = await Item.count({ where: { userId: req.user!.id } });
    
    const outfits = await Outfit.findAll({ where: { userId: req.user!.id } });
    const totalOutfits = outfits.length;

    let mostUsedItemName = 'Ninguna todavía';
    if (totalOutfits > 0) {
      const itemCounts: Record<number, number> = {};
      outfits.forEach(outfit => {
        if (Array.isArray(outfit.itemIds)) {
          outfit.itemIds.forEach((itemId: number) => {
            itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
          });
        }
      });

      let mostUsedId = -1;
      let maxCount = 0;
      for (const [idStr, count] of Object.entries(itemCounts)) {
        if (count > maxCount) {
          maxCount = count;
          mostUsedId = Number(idStr);
        }
      }

      if (mostUsedId !== -1) {
        const item = await Item.findByPk(mostUsedId);
        if (item) {
          mostUsedItemName = item.name;
        }
      }
    }

    res.status(200).json({ totalItems, totalOutfits, mostUsedItemName });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};

/** DELETE /api/auth/account — Elimina la cuenta, datos y fotos vinculadas (Derecho al olvido) */
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    
    // 1. Borrar fotos locales asociadas a los items
    const items = await Item.findAll({ where: { userId } });
    items.forEach(item => deleteLocalFile(item.imageUrl));

    // 2. Borrar registros de DB (borrado en cascada manual por seguridad)
    await Outfit.destroy({ where: { userId } });
    await Item.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    res.status(500).json({ message: 'Error al eliminar la cuenta' });
  }
};
