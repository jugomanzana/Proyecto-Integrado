import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';
import type { Prenda } from '../../models/interfaces';
import { Button }      from '../atoms/Button';
import { Badge }       from '../atoms/Badge';
import { Avatar }      from '../atoms/Avatar';
import { Text }        from '../atoms/Text';
import { SearchBar }   from '../molecules/SearchBar';

// ============================================================
// ORGANISMO: WardrobeGrid
// Cuadrícula principal del armario con búsqueda y filtrado
// por categoría. Recibe prendas desde la vista/viewmodel.
// ============================================================

interface WardrobeGridProps {
  items:     Prenda[];
  loading?:  boolean;
  onAddItem?: () => void;
  onItemClick?: (item: Prenda) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onFilterChange?: (filters: { search: string, category: string, season: string, color: string }) => void;
}

// Categorías disponibles — se generan dinámicamente desde los datos
const ALL_LABEL = 'Todas';

export const WardrobeGrid: React.FC<WardrobeGridProps> = ({
  items,
  loading     = false,
  onAddItem,
  onItemClick,
  hasMore,
  onLoadMore,
  onFilterChange
}) => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState(ALL_LABEL);
  const [season, setSeason] = useState(ALL_LABEL);
  const [color, setColor] = useState('Todos');

  // Estados para abrir/cerrar los desplegables de filtrado
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isSeasonOpen, setIsSeasonOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);

  // Informar al padre de cambios de filtro con debounce (para búsqueda backend)
  React.useEffect(() => {
    if (onFilterChange) {
      const handler = setTimeout(() => {
        onFilterChange({ search, category, season, color });
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [search, category, season, color, onFilterChange]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.category)));
    return [ALL_LABEL, ...unique];
  }, [items]);

  const seasons = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.season).filter(Boolean)));
    return [ALL_LABEL, ...unique];
  }, [items]);

  const colors = useMemo(() => {
    const unique = Array.from(new Set(items.map((i) => i.color).filter(Boolean)));
    return ['Todos', ...unique];
  }, [items]);

  // Filtrado combinado: búsqueda + categoría + temporada + color
  const filtered = useMemo(() => {
    // Si delegamos al backend, items ya vienen filtrados
    if (onFilterChange) return items;

    const q = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        (item.color ?? '').toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCategory =
        category === ALL_LABEL || item.category === category;
      const matchesSeason = season === ALL_LABEL || item.season === season;
      const matchesColor = color === 'Todos' || item.color === color;
      
      return matchesSearch && matchesCategory && matchesSeason && matchesColor;
    });
  }, [items, search, category, season, color, onFilterChange]);

  return (
    <section aria-label="Mi armario" className="flex flex-col gap-6">

      {/* Barra de herramientas: búsqueda + añadir */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <SearchBar
          placeholder="Buscar prendas…"
          value={search}
          onChange={setSearch}
          className="w-full sm:max-w-sm"
        />
        {onAddItem && (
          <Button variant="primary" size="sm" onClick={onAddItem}>
            <Plus size={16} />
            Nueva prenda
          </Button>
        )}
      </div>

      {/* Filtros avanzados */}
      <div
        role="group"
        aria-label="Filtros avanzados"
        className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-warm-beige"
      >
        {/* Filtro de Categoría (Desplegable Premium) */}
        <div className="flex flex-col gap-1.5 w-full sm:w-48 relative">
          <label className="text-xs font-semibold text-warm-brown uppercase tracking-wider">Categoría</label>
          <button
            type="button"
            onClick={() => {
              setIsCatOpen(!isCatOpen);
              setIsSeasonOpen(false);
              setIsColorOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
          >
            <span className="font-medium truncate">{category}</span>
            <ChevronDown size={16} className={['text-warm-brown transition-transform shrink-0', isCatOpen ? 'rotate-180' : ''].join(' ')} />
          </button>

          <AnimatePresence>
            {isCatOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCatOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-3.5 z-20 flex flex-wrap gap-1.5 max-h-60 overflow-y-auto"
                >
                  {categories.map((c) => {
                    const isSelected = category === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCategory(c);
                          setIsCatOpen(false);
                        }}
                        className={[
                          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none',
                          isSelected
                            ? 'bg-warm-dark border-warm-dark text-white shadow-sm'
                            : 'bg-warm-cream/40 border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Filtro de Temporada (Desplegable Premium) */}
        <div className="flex flex-col gap-1.5 w-full sm:w-48 relative">
          <label className="text-xs font-semibold text-warm-brown uppercase tracking-wider">Temporada</label>
          <button
            type="button"
            onClick={() => {
              setIsSeasonOpen(!isSeasonOpen);
              setIsCatOpen(false);
              setIsColorOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
          >
            <span className="font-medium truncate">{season}</span>
            <ChevronDown size={16} className={['text-warm-brown transition-transform shrink-0', isSeasonOpen ? 'rotate-180' : ''].join(' ')} />
          </button>

          <AnimatePresence>
            {isSeasonOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsSeasonOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-3.5 z-20 flex flex-wrap gap-1.5 max-h-60 overflow-y-auto"
                >
                  {seasons.map((s) => {
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
                          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none',
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

        {/* Filtro de Color (Desplegable Premium) */}
        <div className="flex flex-col gap-1.5 w-full sm:w-48 relative">
          <label className="text-xs font-semibold text-warm-brown uppercase tracking-wider">Color</label>
          <button
            type="button"
            onClick={() => {
              setIsColorOpen(!isColorOpen);
              setIsCatOpen(false);
              setIsSeasonOpen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-warm-beige bg-warm-cream/50 text-warm-dark text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white text-left cursor-pointer"
          >
            <span className="font-medium truncate">{color}</span>
            <ChevronDown size={16} className={['text-warm-brown transition-transform shrink-0', isColorOpen ? 'rotate-180' : ''].join(' ')} />
          </button>

          <AnimatePresence>
            {isColorOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsColorOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 right-0 top-[calc(100%+4px)] bg-white border border-warm-beige rounded-2xl shadow-lg p-3.5 z-20 flex flex-wrap gap-1.5 max-h-60 overflow-y-auto"
                >
                  {colors.map((c) => {
                    const isSelected = color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setColor(c);
                          setIsColorOpen(false);
                        }}
                        className={[
                          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer select-none',
                          isSelected
                            ? 'bg-warm-dark border-warm-dark text-white shadow-sm'
                            : 'bg-warm-cream/40 border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                        ].join(' ')}
                      >
                        {c}
                      </button>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Estado vacío */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">👗</span>
          <Text variant="body" className="text-warm-brown">
            {search || category !== ALL_LABEL
              ? 'No encontramos prendas con ese filtro.'
              : 'Tu armario está vacío. ¡Añade tu primera prenda!'}
          </Text>
          {onAddItem && !search && (
            <Button variant="secondary" size="sm" onClick={onAddItem}>
              <Plus size={16} />
              Añadir prenda
            </Button>
          )}
        </div>
      )}

      {/* Cuadrícula de prendas */}
      <AnimatePresence mode="popLayout">
        {!loading && (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            aria-live="polite"
            aria-label={`${filtered.length} prenda${filtered.length !== 1 ? 's' : ''}`}
          >
            {filtered.map((item, index) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
              >
                <button
                  onClick={() => onItemClick?.(item)}
                  className="w-full text-left group bg-white border border-warm-beige rounded-2xl overflow-hidden hover:shadow-md hover:border-warm-accent/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent"
                >
                  {/* Imagen o avatar fallback */}
                  <div className="aspect-square bg-warm-beige/50 flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Avatar src={null} alt={item.name} size="xl" />
                    )}
                  </div>

                  {/* Información de la prenda */}
                  <div className="p-3 flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-warm-dark truncate leading-tight">
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between gap-1">
                      <Badge label={item.category} variant="default" size="sm" />
                      {item.color && (
                        <span className="text-xs text-warm-muted truncate">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>

      {/* Skeleton de carga */}
      {loading && (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i} className="bg-white border border-warm-beige rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-warm-beige/70" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-3.5 bg-warm-beige rounded-full w-3/4" />
                <div className="h-3 bg-warm-beige rounded-full w-1/2" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Botón Mostrar más */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-6">
          <Button variant="secondary" onClick={onLoadMore} loading={loading}>
            Mostrar más
          </Button>
        </div>
      )}
    </section>
  );
};
