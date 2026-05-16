import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../viewmodels/useItems';
import { Navbar } from '../components/organisms/Navbar';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { AlertBanner } from '../components/molecules/AlertBanner';
import type { ItemSeason, ItemStatus } from '../models/interfaces';

export const ItemFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { fetchItemById, createItem, updateItem, loading, error: apiError } = useItems();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [season, setSeason] = useState<ItemSeason | ''>('');
  const [size, setSize] = useState('');
  const [fabric, setFabric] = useState('');
  const [status, setStatus] = useState<ItemStatus>('Disponible');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      fetchItemById(Number(id)).then(item => {
        if (item) {
          setName(item.name);
          setCategory(item.category);
          setColor(item.color || '');
          if (item.imageUrl) setImagePreview(item.imageUrl);
          setSeason(item.season || '');
          setSize(item.size || '');
          setFabric(item.fabric || '');
          setStatus(item.status);
        } else {
          navigate('/dashboard');
        }
      });
    }
  }, [isEditing, id, fetchItemById, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !category || !color || !season || !size) {
      setLocalError('El nombre, categoría, color, temporada y talla son obligatorios.');
      return;
    }

    if (!isEditing && !imageFile) {
      setLocalError('La imagen es obligatoria al crear una prenda.');
      return;
    }

    const payload = {
      name,
      category,
      color,
      season: season as ItemSeason,
      size,
      fabric: fabric || undefined,
      status,
      imageFile: imageFile || null
    };

    let success;
    if (isEditing && id) {
      success = await updateItem(Number(id), payload);
    } else {
      success = await createItem(payload);
    }

    if (success) {
      navigate('/dashboard');
    }
  };

  const error = localError || apiError;

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
        <header>
          <h1 className="text-3xl font-bold text-warm-dark leading-tight">
            {isEditing ? 'Editar prenda' : 'Añadir nueva prenda'}
          </h1>
          <p className="text-warm-brown mt-1">
            Completa los detalles para {isEditing ? 'actualizar tu prenda' : 'agregar a tu armario'}.
          </p>
        </header>

        {error && <AlertBanner variant="error" message={error} />}

        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-warm-beige space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              id="name"
              label="Nombre *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Camiseta básica blanca"
              required
            />
            <FormField
              id="category"
              label="Categoría *"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej. Camisetas"
              required
            />
            <FormField
              id="color"
              label="Color *"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej. Blanco"
              required
            />
            <FormField
              id="size"
              label="Talla *"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Ej. M, 42, Única"
              required
            />
            <FormField
              id="fabric"
              label="Tejido"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="Ej. Algodón"
            />
            
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="season" className="text-sm font-semibold tracking-wide text-warm-brown">Temporada *</label>
              <select
                id="season"
                value={season}
                onChange={(e) => setSeason(e.target.value as ItemSeason)}
                className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white"
                required
              >
                <option value="">Selecciona una temporada</option>
                <option value="Primavera">Primavera</option>
                <option value="Verano">Verano</option>
                <option value="Otoño">Otoño</option>
                <option value="Invierno">Invierno</option>
                <option value="Todo el año">Todo el año</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="status" className="text-sm font-semibold tracking-wide text-warm-brown">Estado *</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white"
                required
              >
                <option value="Disponible">Disponible</option>
                <option value="Lavandería">Lavandería</option>
                <option value="Prestado">Prestado</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold tracking-wide text-warm-brown">
              Imagen de la prenda
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-warm-beige/30 border border-warm-beige border-dashed flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl opacity-50">📷</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-warm-brown file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-warm-dark file:text-white hover:file:bg-warm-brown cursor-pointer transition-all"
                />
                <p className="mt-2 text-xs text-warm-brown/70">
                  Formatos soportados: JPG, PNG, WEBP, GIF. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-warm-beige flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {isEditing ? 'Guardar cambios' : 'Crear prenda'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
