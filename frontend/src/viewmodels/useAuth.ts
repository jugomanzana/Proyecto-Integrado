import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNotification } from '../hooks/useNotification';
import type { Usuario } from '../models/interfaces';

// ============================================================
// VIEWMODEL: useAuth
// Gestiona el estado de autenticación del usuario, inicio de sesión,
// registro, cierre de sesión, actualización de perfil (incluyendo avatar)
// y sincronización en tiempo real entre múltiples instancias del hook.
// ============================================================

export const useAuth = () => {
  const { notify } = useNotification();
  
  const [user, setUser] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronizar el estado del usuario en tiempo real entre todas las instancias del hook
  useEffect(() => {
    const handleUserChanged = (e: Event) => {
      const customEvent = e as CustomEvent<Usuario | null>;
      setUser(customEvent.detail);
    };
    window.addEventListener('auth-user-changed', handleUserChanged);
    return () => {
      window.removeEventListener('auth-user-changed', handleUserChanged);
    };
  }, []);

  const syncUser = (newUser: Usuario | null) => {
    setUser(newUser);
    window.dispatchEvent(new CustomEvent('auth-user-changed', { detail: newUser }));
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { identifier, password });
      const { token, user: loggedInUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      syncUser(loggedInUser);
      notify.success(`¡Bienvenido de nuevo, ${loggedInUser.username}!`);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión';
      setError(msg);
      notify.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/register', { username, email, password });
      notify.success('Registro completado. ¡Ya puedes iniciar sesión!');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error en el registro';
      setError(msg);
      notify.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    syncUser(null);
  };

  const updateProfile = async (
    username: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    birthDate?: string | null,
    avatarFile?: File | null
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (firstName) formData.append('firstName', firstName);
        if (lastName) formData.append('lastName', lastName);
        if (birthDate) formData.append('birthDate', birthDate);
        formData.append('avatar', avatarFile);
        response = await api.put('/auth/profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.put('/auth/profile', { 
          username, 
          email, 
          firstName, 
          lastName, 
          birthDate 
        });
      }
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      syncUser(updatedUser);
      notify.success('Perfil actualizado correctamente');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el perfil';
      setError(msg);
      notify.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      notify.success('Contraseña actualizada con éxito');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar la contraseña';
      setError(msg);
      notify.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = useCallback(async (): Promise<{ totalItems: number; totalOutfits: number; mostUsedItemName?: string } | null> => {
    try {
      const response = await api.get('/auth/stats');
      return response.data;
    } catch (err) {
      console.error('Error fetching user stats:', err);
      return null;
    }
  }, []);

  const deleteAccount = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/auth/account');
      logout(); // Limpia localStorage y estado
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la cuenta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    fetchUserStats,
    deleteAccount,
    isAuthenticated: !!user,
  };
};
