import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Sparkles, Save, X, Shirt } from 'lucide-react';
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import type { Prenda } from '../../models/interfaces';

// ============================================================
// ORGANISMO: OutfitGeneratorModal
// Genera sugerencias de outfits inteligentes filtrando por
// temporada y priorizando categorías esenciales:
// Pantalón + [Camiseta|Sudadera] + Zapatos + Accesorio opcional
// ============================================================

type Season = 'Primavera' | 'Verano' | 'Otoño' | 'Invierno';

interface OutfitGeneratorModalProps {
  isOpen: boolean;
  items: Prenda[];
  onClose: () => void;
  onSave: (name: string, itemIds: number[]) => Promise<boolean>;
  loading?: boolean;
}

// ── Utilidades ─────────────────────────────────────────────

/** Detecta la temporada actual según el mes del sistema */
function detectCurrentSeason(): Season {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 3 && month <= 5) return 'Primavera';
  if (month >= 6 && month <= 8) return 'Verano';
  if (month >= 9 && month <= 11) return 'Otoño';
  return 'Invierno';
}

/** Elige un elemento aleatorio de un array o null si está vacío */
function pickRandom<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Filtra prendas que son válidas para la temporada dada */
function filterBySeason(items: Prenda[], season: Season): Prenda[] {
  return items.filter(
    (i) => i.season === season || i.season === 'Todo el año'
  );
}

/**
 * Algoritmo principal de generación de outfit:
 * 1. Filtra por temporada (+ "Todo el año" como comodín)
 * 2. Intenta cubrir las 4 posiciones: Pantalón, Top (Camiseta/Sudadera), Zapatos, Accesorio
 * 3. Si alguna categoría no tiene stock en esa temporada, usa toda la colección como fallback
 */
function generateOutfit(allItems: Prenda[], season: Season): Prenda[] {
  const seasonal = filterBySeason(allItems, season);
  // Para cada categoría: intentamos en seasonal, si no hay, caemos a todo el armario
  const pool = (category: string) => {
    const inSeason = seasonal.filter((i) => i.category === category);
    return inSeason.length ? inSeason : allItems.filter((i) => i.category === category);
  };

  const result: Prenda[] = [];
  const usedIds = new Set<number>();

  const addItem = (item: Prenda | null) => {
    if (item && !usedIds.has(item.id)) {
      result.push(item);
      usedIds.add(item.id);
    }
  };

  // 1. Pantalón (obligatorio si existe)
  addItem(pickRandom(pool('Pantalón')));

  // 2. Top: Camiseta o Sudadera con igual probabilidad, según temporada
  //    En Invierno/Otoño favorecemos ligeramente Sudadera; en Verano/Primavera, Camiseta
  const preferSudadera = season === 'Invierno' || season === 'Otoño';
  const topPrimary = preferSudadera ? 'Sudadera' : 'Camiseta';
  const topFallback = preferSudadera ? 'Camiseta' : 'Sudadera';
  const topItems = pool(topPrimary).length ? pool(topPrimary) : pool(topFallback);
  addItem(pickRandom(topItems));

  // 3. Zapatos (obligatorio si existe)
  addItem(pickRandom(pool('Zapatos')));

  // 4. Accesorio (opcional)
  addItem(pickRandom(pool('Accesorios')));

  return result;
}

// ── Componente ─────────────────────────────────────────────

const SEASONS: Season[] = ['Primavera', 'Verano', 'Otoño', 'Invierno'];

const SEASON_META: Record<Season, { emoji: string; color: string }> = {
  Primavera: { emoji: '🌸', color: 'bg-pink-50  border-pink-200  text-pink-700' },
  Verano: { emoji: '☀️', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  Otoño: { emoji: '🍂', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  Invierno: { emoji: '❄️', color: 'bg-sky-50   border-sky-200   text-sky-700' },
};

export const OutfitGeneratorModal: React.FC<OutfitGeneratorModalProps> = ({
  isOpen,
  items,
  onClose,
  onSave,
  loading = false,
}) => {
  const [season, setSeason] = useState<Season>(detectCurrentSeason);
  const [generated, setGenerated] = useState<Prenda[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleGenerate = useCallback(() => {
    const result = generateOutfit(items, season);
    setGenerated(result);
    setHasGenerated(true);
    if (!outfitName) {
      setOutfitName(`Outfit ${season} ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}`);
    }
  }, [items, season, outfitName]);

  const handleSave = async () => {
    if (!outfitName.trim() || !generated.length) return;
    setSaving(true);
    const success = await onSave(outfitName.trim(), generated.map((i) => i.id));
    setSaving(false);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setGenerated([]);
    setHasGenerated(false);
    setOutfitName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
            className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-warm-beige relative z-10 overflow-hidden"
          >
            {/* Cabecera */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-warm-beige">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-warm-accent/15 rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-warm-accent-dark" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-warm-dark leading-tight">Generador de outfits</h3>
                  <p className="text-xs text-warm-muted">Combinaciones inteligentes de tu armario</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl hover:bg-warm-beige/50 text-warm-muted hover:text-warm-dark transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Selector de temporada */}
              <div className="space-y-2.5">
                <p className="text-sm font-semibold text-warm-dark">¿Para qué temporada?</p>
                <div className="grid grid-cols-4 gap-2">
                  {SEASONS.map((s) => {
                    const meta = SEASON_META[s];
                    const isActive = season === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSeason(s); setHasGenerated(false); }}
                        className={[
                          'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all duration-200 cursor-pointer select-none',
                          isActive
                            ? meta.color + ' shadow-sm scale-[1.03]'
                            : 'bg-warm-cream border-warm-beige text-warm-brown hover:bg-warm-beige/50',
                        ].join(' ')}
                      >
                        <span className="text-xl leading-none">{meta.emoji}</span>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resultado generado */}
              <AnimatePresence mode="wait">
                {hasGenerated && (
                  <motion.div
                    key={generated.map((i) => i.id).join('-')}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    <p className="text-sm font-semibold text-warm-dark">Sugerencia generada</p>
                    {generated.length === 0 ? (
                      <div className="py-8 text-center text-warm-muted text-sm">
                        No hay suficientes prendas en tu armario para generar un outfit.
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {generated.map((item) => (
                          <div key={item.id} className="flex flex-col gap-1.5">
                            <div className="aspect-square rounded-xl overflow-hidden border border-warm-beige bg-warm-cream/50">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Shirt size={20} className="text-warm-beige" strokeWidth={1.5} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-warm-dark truncate leading-tight">{item.name}</p>
                              <p className="text-[10px] text-warm-muted truncate">{item.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Campo nombre + guardar (solo si hay resultado) */}
              <AnimatePresence>
                {hasGenerated && generated.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <FormField
                      id="outfit-name"
                      label="Nombre del outfit"
                      value={outfitName}
                      onChange={(e) => setOutfitName(e.target.value)}
                      placeholder="Ej: Look casual de primavera"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Pie de botones */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-warm-beige bg-warm-cream/30">
              <Button
                type="button"
                variant="secondary"
                onClick={handleGenerate}
                loading={loading}
              >
                <Shuffle size={15} />
                {hasGenerated ? 'Regenerar' : 'Generar outfit'}
              </Button>

              {hasGenerated && generated.length > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleSave}
                  loading={saving}
                  disabled={!outfitName.trim()}
                >
                  <Save size={15} />
                  Guardar outfit
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
