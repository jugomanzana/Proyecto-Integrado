import { useState } from 'react';
import api from '../services/api';
import type { Usuario } from '../models/interfaces';

export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: loggedInUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
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
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (username: string, email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/auth/profile', { username, email });
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
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
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la contraseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (): Promise<{ totalItems: number; totalOutfits: number; mostUsedItemName?: string } | null> => {
    try {
      const response = await api.get('/auth/stats');
      return response.data;
    } catch (err) {
      console.error('Error fetching user stats:', err);
      return null;
    }
  };

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
