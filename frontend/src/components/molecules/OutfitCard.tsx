import React from 'react';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';

// ============================================================
// MOLÉCULA: OutfitCard
// Tarjeta premium para mostrar un outfit en el listado.
// Genera automáticamente un collage visual 2×2 con las
// primeras 4 imágenes de las prendas que componen el outfit.
// Si hay menos de 4 imágenes, el resto se rellena con un
// placeholder elegante.
// ============================================================

interface OutfitCardProps {
  name:               string;
  description?:       string | null;
  itemCount:          number;
  previewImageUrls?:  string[];
  onClick?:           () => void;
}

const SLOTS = [0, 1, 2, 3];

export const OutfitCard: React.FC<OutfitCardProps> = ({
  name,
  description,
  itemCount,
  previewImageUrls = [],
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(62,51,38,0.10)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      className="bg-white border border-warm-beige rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-warm-accent transition-colors duration-200 hover:border-warm-accent/40 group"
    >
      {/* Collage 2×2 */}
      <div className="grid grid-cols-2 grid-rows-2 aspect-square w-full">
        {SLOTS.map((slot) => {
          const url = previewImageUrls[slot];
          return url ? (
            <div key={slot} className="overflow-hidden">
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ) : (
            <div
              key={slot}
              className="bg-warm-cream/70 flex items-center justify-center border border-warm-beige/40"
            >
              <Shirt size={22} className="text-warm-beige" strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Pie de tarjeta */}
      <div className="px-4 py-3 border-t border-warm-beige">
        <p className="font-semibold text-warm-dark text-sm leading-tight truncate">{name}</p>
        <p className="text-xs text-warm-muted mt-0.5">
          {description || `${itemCount} ${itemCount === 1 ? 'prenda' : 'prendas'}`}
        </p>
      </div>
    </motion.div>
  );
};
