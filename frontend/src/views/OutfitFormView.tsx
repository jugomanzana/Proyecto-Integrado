import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItems } from '../viewmodels/useItems';
import { useOutfits } from '../viewmodels/useOutfits';
import { Navbar } from '../components/organisms/Navbar';
import { FormField } from '../components/molecules/FormField';
import { Button } from '../components/atoms/Button';
import { AlertBanner } from '../components/molecules/AlertBanner';
import { Avatar } from '../components/atoms/Avatar';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OutfitFormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  
  const { items, fetchItems, loading: loadingItems } = useItems();
  const { fetchOutfitById, createOutfit, updateOutfit, deleteOutfit, loading: loadingOutfit, error: apiError } = useOutfits();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems(); // Cargar todas las prendas del armario
    if (isEditing && id) {
      fetchOutfitById(Number(id)).then(outfit => {
        if (outfit) {
          setName(outfit.name);
          setDescription(outfit.description || '');
          setSelectedItemIds(outfit.itemIds);
        } else {
          navigate('/outfits');
        }
      });
    }
  }, [isEditing, id, fetchItems, fetchOutfitById, navigate]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category)));
    return ['Todas', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'Todas') return items;
    return items.filter(item => item.category === categoryFilter);
  }, [items, categoryFilter]);

  const toggleItemSelection = (itemId: number) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name) {
      setLocalError('El nombre del outfit es obligatorio.');
      return;
    }

    if (selectedItemIds.length === 0) {
      setLocalError('Debes seleccionar al menos una prenda para el outfit.');
      return;
    }

    const payload = {
      name,
      description: description || undefined,
      itemIds: selectedItemIds
    };

    let success;
    if (isEditing && id) {
      success = await updateOutfit(Number(id), payload);
    } else {
      success = await createOutfit(payload);
    }

    if (success) {
      navigate('/outfits');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Seguro que quieres eliminar este outfit? Esta acción no se puede deshacer.')) {
      const success = await deleteOutfit(Number(id));
      if (success) {
        navigate('/outfits');
      }
    }
  };

  const error = localError || apiError;
  const isLoading = loadingOutfit || loadingItems;

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-warm-dark leading-tight">
            {isEditing ? 'Editar Outfit' : 'Crear un Outfit'}
          </h1>
          <p className="text-warm-brown mt-1">
            Combina tus prendas para tener tu estilo listo en cualquier momento.
          </p>
        </header>

        {error && <AlertBanner variant="error" message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          
          {/* Columna Izquierda: Datos del Outfit */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige space-y-6 sticky top-24">
              <h2 className="text-xl font-semibold text-warm-dark">Detalles</h2>
              
              <FormField
                id="name"
                label="Nombre del Outfit *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Casual de Viernes"
                required
              />
              
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="description" className="text-sm font-semibold tracking-wide text-warm-brown">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej. Outfit cómodo para ir a la oficina y luego salir a cenar."
                  className="w-full px-4 py-3 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark min-h-[120px] resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-warm-beige space-y-3">
                <p className="text-sm text-warm-brown font-medium">
                  {selectedItemIds.length} prendas seleccionadas
                </p>
                <Button type="submit" variant="primary" className="w-full" loading={isLoading}>
                  {isEditing ? 'Guardar Cambios' : 'Crear Outfit'}
                </Button>
                <Button type="button" variant="secondary" className="w-full" onClick={() => navigate('/outfits')}>
                  Cancelar
                </Button>
                {isEditing && (
                  <Button type="button" variant="danger" className="w-full mt-4" onClick={handleDelete} loading={isLoading}>
                    Eliminar Outfit
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Selección de prendas */}
          <div className="lg:w-2/3 flex flex-col gap-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-warm-dark font-semibold">Filtrar prendas:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={[
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150',
                      categoryFilter === cat
                        ? 'bg-warm-dark text-white'
                        : 'bg-warm-beige text-warm-brown hover:bg-warm-beige-dark',
                    ].join(' ')}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-beige min-h-[500px]">
              <AnimatePresence mode="popLayout">
                {filteredItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-warm-brown">
                    No hay prendas en esta categoría.
                  </div>
                ) : (
                  <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredItems.map(item => {
                      const isSelected = selectedItemIds.includes(item.id);
                      return (
                        <motion.li
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          key={item.id}
                        >
                          <button
                            type="button"
                            onClick={() => toggleItemSelection(item.id)}
                            className={[
                              'relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-warm-accent focus:ring-offset-2',
                              isSelected ? 'border-warm-accent shadow-md' : 'border-warm-beige bg-warm-beige/20 hover:border-warm-accent/50 hover:shadow-sm'
                            ].join(' ')}
                          >
                            {/* Checkmark overlay for selected items */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-warm-accent text-white rounded-full p-1 z-10 shadow-sm">
                                <Check size={14} strokeWidth={3} />
                              </div>
                            )}
                            
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Avatar alt={item.name} size="lg" />
                              </div>
                            )}

                            {/* Label en la parte inferior de la prenda */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                              <p className="text-white text-xs font-medium truncate">{item.name}</p>
                            </div>
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </AnimatePresence>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
};
