import { useState, useCallback } from 'react';
import api from '../services/api';
import type { Outfit, OutfitDetalle } from '../models/interfaces';
import { useNotification } from '../hooks/useNotification';

// ============================================================
// VIEWMODEL: useOutfits
// Gestión de estado y operaciones CRUD de outfits.
// ============================================================

interface CreateOutfitPayload {
  name:         string;
  description?: string;
  itemIds?:     number[];
}

type UpdateOutfitPayload = Partial<CreateOutfitPayload>;

export const useOutfits = () => {
  const { notify } = useNotification();
  const [outfits,  setOutfits]  = useState<Outfit[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  /** Obtener todos los outfits del usuario */
  const fetchOutfits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Outfit[]>('/outfits');
      setOutfits(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar los outfits');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Obtener un outfit con sus prendas incluidas */
  const fetchOutfitById = useCallback(async (id: number): Promise<OutfitDetalle | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<OutfitDetalle>(`/outfits/${id}`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el outfit');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Crear un outfit */
  const createOutfit = useCallback(async (payload: CreateOutfitPayload): Promise<Outfit | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<Outfit>('/outfits', payload);
      setOutfits((prev) => [data, ...prev]);
      notify.success('Outfit guardado en tu colección');
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al crear el outfit';
      setError(msg);
      notify.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Actualizar un outfit */
  const updateOutfit = useCallback(async (id: number, payload: UpdateOutfitPayload): Promise<Outfit | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put<Outfit>(`/outfits/${id}`, payload);
      setOutfits((prev) => prev.map((o) => (o.id === id ? data : o)));
      notify.success('Outfit actualizado');
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al actualizar el outfit';
      setError(msg);
      notify.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Eliminar un outfit */
  const deleteOutfit = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/outfits/${id}`);
      setOutfits((prev) => prev.filter((o) => o.id !== id));
      notify.success('Outfit eliminado');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar el outfit';
      setError(msg);
      notify.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    outfits,
    loading,
    error,
    fetchOutfits,
    fetchOutfitById,
    createOutfit,
    updateOutfit,
    deleteOutfit,
  };
};
