import { useState, useCallback } from 'react';
import api from '../services/api';
import type { Prenda } from '../models/interfaces';

// ============================================================
// VIEWMODEL: useItems
// Gestión de estado y operaciones CRUD de prendas.
// Conecta el organismo WardrobeGrid con la API REST.
// ============================================================

interface CreateItemPayload {
  name:      string;
  category:  string;
  color:     string;
  imageUrl?: string;
  season:    Prenda['season'];
  size:      string;
  fabric?:   string;
  status?:   Prenda['status'];
  imageFile?: File | null;
}

type UpdateItemPayload = Partial<CreateItemPayload>;

export const useItems = () => {
  const [items,   setItems]   = useState<Prenda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const LIMIT = 12;

  /** Obtener todas las prendas del usuario */
  const fetchItems = useCallback(async (filters?: {
    category?: string;
    status?:   Prenda['status'];
    season?:   string;
    color?:    string;
    search?:   string;
    limit?:    number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const activeLimit = filters?.limit || LIMIT;
      const mergedFilters = { ...filters, limit: activeLimit, offset: 0 };
      setCurrentFilters(filters || {});
      const { data } = await api.get<Prenda[]>('/items', { params: mergedFilters });
      setItems(data);
      setHasMore(data.length === activeLimit);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar las prendas');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Cargar más prendas (paginación infinita) */
  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const currentOffset = items.length;
      const params = { ...currentFilters, limit: LIMIT, offset: currentOffset };
      const { data } = await api.get<Prenda[]>('/items', { params });
      setItems(prev => [...prev, ...data]);
      setHasMore(data.length === LIMIT);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar más prendas');
    } finally {
      setLoading(false);
    }
  }, [items.length, currentFilters, loading, hasMore]);

  /** Obtener una prenda por ID */
  const fetchItemById = useCallback(async (id: number): Promise<Prenda | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Prenda>(`/items/${id}`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la prenda');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Crear una prenda */
  const createItem = useCallback(async (payload: CreateItemPayload): Promise<Prenda | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('name', payload.name);
      formData.append('category', payload.category);
      formData.append('color', payload.color);
      formData.append('season', payload.season);
      formData.append('size', payload.size);
      if (payload.imageUrl) formData.append('imageUrl', payload.imageUrl);
      if (payload.fabric) formData.append('fabric', payload.fabric);
      if (payload.status) formData.append('status', payload.status);
      if (payload.imageFile) formData.append('image', payload.imageFile);

      const { data } = await api.post<Prenda>('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItems((prev) => [data, ...prev]);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la prenda');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Actualizar una prenda */
  const updateItem = useCallback(async (id: number, payload: UpdateItemPayload): Promise<Prenda | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (payload.name) formData.append('name', payload.name);
      if (payload.category) formData.append('category', payload.category);
      if (payload.color) formData.append('color', payload.color);
      if (payload.season) formData.append('season', payload.season);
      if (payload.size) formData.append('size', payload.size);
      if (payload.imageUrl !== undefined) formData.append('imageUrl', payload.imageUrl || '');
      if (payload.fabric) formData.append('fabric', payload.fabric);
      if (payload.status) formData.append('status', payload.status);
      if (payload.imageFile) formData.append('image', payload.imageFile);

      const { data } = await api.put<Prenda>(`/items/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar la prenda');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Eliminar una prenda */
  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al eliminar la prenda');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    fetchItems,
    loadMoreItems,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem,
  };
};
