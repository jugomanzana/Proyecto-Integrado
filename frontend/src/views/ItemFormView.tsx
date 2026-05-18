import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../viewmodels/useItems';
import { Navbar } from '../components/organisms/Navbar';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { AlertBanner } from '../components/molecules/AlertBanner';
import type { ItemSeason, ItemStatus } from '../models/interfaces';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// VISTA: ItemFormView
// Formulario premium para añadir o editar una prenda de vestir.
// Cuenta con selectores premium desplegables dinámicamente para
// Categoría, Temporada y Estado con animaciones fluidas y pastillas de selección.
// ============================================================

export const ItemFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { fetchItemById, createItem, updateItem, loading, error: apiError } = useItems();

  const categoriesList = ['Camiseta', 'Sudadera', 'Pantalón', 'Zapatos', 'Accesorios', 'Otro'];
  const seasonsList: ItemSeason[] = ['Primavera', 'Verano', 'Otoño', 'Invierno', 'Todo el año'];
  const statusesList: { value: ItemStatus; label: string; activeClass: string }[] = [
    { value: 'Disponible', label: 'Disponible', activeClass: 'bg-status-success border-status-success text-white shadow-sm' },
    { value: 'Colada',     label: 'Colada',     activeClass: 'bg-status-warning border-status-warning text-white shadow-sm' },
    { value: 'Prestado',   label: 'Prestado',   activeClass: 'bg-status-info border-status-info text-white shadow-sm' },
  ];

  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [color, setColor] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [season, setSeason] = useState<ItemSeason | ''>('');
  const [size, setSize] = useState('');
  const [fabric, setFabric] = useState('');
  const [status, setStatus] = useState<ItemStatus>('Disponible');
  const [localError, setLocalError] = useState<string | null>(null);

  // Estados para abrir/cerrar desplegables interactivos
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      fetchItemById(Number(id)).then(item => {
        if (item) {
          setName(item.name);
          setColor(item.color || '');
          if (item.imageUrl) setImagePreview(item.imageUrl);
          setSeason(item.season || '');
          setSize(item.size || '');
          setFabric(item.fabric || '');
          setStatus(item.status);

          // Cargar categoría de forma inteligente
          if (categoriesList.includes(item.category)) {
            setSelectedCategory(item.category);
          } else {
            setSelectedCategory('Otro');
            setCustomCategory(item.category);
          }
        } else {
          navigate('/dashboard');
        }
      });
    }
  }, [isEditing, id, fetchItemById, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const finalCategory = selectedCategory === 'Otro' ? customCategory.trim() : selectedCategory;

    if (!name || !finalCategory || !color || !season || !size) {
      setLocalError('El nombre, categoría, color, temporada y talla son obligatorios.');
      return;
    }

    if (!isEditing && !imageFile) {
      setLocalError('La imagen es obligatoria al crear una prenda.');
      return;
    }

    const payload = {
      name,
      category: finalCategory,
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
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Camiseta básica blanca"
              required
            />

            {/* Categoría (Desplegable Premium Animado) */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <label className="text-sm font-semibold tracking-wide text-warm-brown">Categoría</label>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsSeasonOpen(false);
                  setIsStatusOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
              >
                <span className={selectedCategory ? 'text-warm-dark font-medium' : 'text-warm-muted'}>
                  {selectedCategory || 'Selecciona una categoría'}
                </span>
                <ChevronDown size={18} className={['text-warm-brown transition-transform duration-200', isCategoryOpen ? 'rotate-180' : ''].join(' ')} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <>
                    {/* Backdrop transparente para cerrar al hacer clic fuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                    
                    {/* Panel flotante de pastillas */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-4 z-20 flex flex-wrap gap-2"
                    >
                      {categoriesList.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setIsCategoryOpen(false);
                              if (cat !== 'Otro') {
                                setCustomCategory('');
                              }
                            }}
                            className={[
                              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none',
                              isSelected
                                ? 'bg-warm-dark border-warm-dark text-white shadow-sm'
                                : 'bg-warm-cream/40 border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                            ].join(' ')}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {selectedCategory === 'Otro' && (
              <div className="col-span-1 sm:col-span-2">
                <FormField
                  id="customCategory"
                  label="Especificar Categoría"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Especifica la categoría (como Abrigo, Vestido, etc.)"
                  required
                />
              </div>
            )}

            <FormField
              id="color"
              label="Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Blanco"
              required
            />
            <FormField
              id="size"
              label="Talla"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="M, 42, Única"
              required
            />
            <FormField
              id="fabric"
              label="Tejido"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              placeholder="Algodón"
            />
            
            {/* Temporada (Desplegable Premium Animado) */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <label className="text-sm font-semibold tracking-wide text-warm-brown">Temporada</label>
              <button
                type="button"
                onClick={() => {
                  setIsSeasonOpen(!isSeasonOpen);
                  setIsCategoryOpen(false);
                  setIsStatusOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
              >
                <span className={season ? 'text-warm-dark font-medium' : 'text-warm-muted'}>
                  {season || 'Selecciona una temporada'}
                </span>
                <ChevronDown size={18} className={['text-warm-brown transition-transform duration-200', isSeasonOpen ? 'rotate-180' : ''].join(' ')} />
              </button>

              <AnimatePresence>
                {isSeasonOpen && (
                  <>
                    {/* Backdrop transparente para cerrar al hacer clic fuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsSeasonOpen(false)} />
                    
                    {/* Panel flotante de pastillas */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-4 z-20 flex flex-wrap gap-2"
                    >
                      {seasonsList.map((s) => {
                        const isSelected = season === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSeason(s);
                              setIsSeasonOpen(false);
                            }}
                            className={[
                              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none',
                              isSelected
                                ? 'bg-warm-dark border-warm-dark text-white shadow-sm'
                                : 'bg-warm-cream/40 border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                            ].join(' ')}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Estado (Desplegable Premium Animado) */}
            <div className="flex flex-col gap-1.5 w-full relative">
              <label className="text-sm font-semibold tracking-wide text-warm-brown">Estado</label>
              <button
                type="button"
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsCategoryOpen(false);
                  setIsSeasonOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
              >
                <span className="text-warm-dark font-medium flex items-center gap-2">
                  {status ? (
                    <>
                      <span className={[
                        'w-2.5 h-2.5 rounded-full shrink-0', 
                        status === 'Disponible' ? 'bg-status-success' :
                        status === 'Colada' ? 'bg-status-warning' : 'bg-status-info'
                      ].join(' ')} />
                      {status}
                    </>
                  ) : (
                    'Selecciona un estado'
                  )}
                </span>
                <ChevronDown size={18} className={['text-warm-brown transition-transform duration-200', isStatusOpen ? 'rotate-180' : ''].join(' ')} />
              </button>

              <AnimatePresence>
                {isStatusOpen && (
                  <>
                    {/* Backdrop transparente para cerrar al hacer clic fuera */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsStatusOpen(false)} />
                    
                    {/* Panel flotante de pastillas */}
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-4 z-20 flex flex-wrap gap-2"
                    >
                      {statusesList.map((st) => {
                        const isSelected = status === st.value;
                        return (
                          <button
                            key={st.value}
                            type="button"
                            onClick={() => {
                              setStatus(st.value);
                              setIsStatusOpen(false);
                            }}
                            className={[
                              'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer select-none',
                              isSelected
                                ? st.activeClass
                                : 'bg-warm-cream/40 border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                            ].join(' ')}
                          >
                            {st.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Imagen de la prenda */}
          <div className="flex flex-col gap-3 pt-2">
            <label className="text-sm font-semibold tracking-wide text-warm-brown">
              Imagen de la prenda
            </label>
            <div className="flex items-center gap-6">
              <label 
                htmlFor="image-upload"
                className="w-24 h-24 rounded-2xl bg-warm-beige/30 border border-warm-beige border-dashed flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:bg-warm-beige/50 hover:border-warm-accent transition-all duration-200"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl opacity-50 select-none hover:scale-110 transition-transform">📷</span>
                )}
              </label>
              <div className="flex-1">
                <input
                  id="image-upload"
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
