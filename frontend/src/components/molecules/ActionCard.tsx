import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// MOLÉCULA: ActionCard
// Tarjeta de acción rápida del Dashboard. Combina un icono
// (emoji o ReactNode), título y descripción opcional.
// Reemplaza los divs ad-hoc de DashboardView.
// ============================================================

interface ActionCardProps {
  icon:         React.ReactNode;
  title:        string;
  description?: string;
  onClick?:     () => void;
  disabled?:    boolean;
  className?:   string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  onClick,
  disabled    = false,
  className   = '',
}) => {
  return (
    <motion.div
      whileHover={!disabled ? { y: -3, boxShadow: '0 8px 24px rgba(62,51,38,0.08)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={!disabled ? onClick : undefined}
      className={[
        'bg-warm-cream/50 border border-warm-beige rounded-2xl p-6',
        'flex flex-col items-center justify-center text-center gap-3 h-40',
        'transition-colors duration-200',
        onClick && !disabled
          ? 'cursor-pointer hover:bg-warm-cream focus:outline-none focus:ring-2 focus:ring-warm-accent'
          : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      <span className="text-3xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-warm-dark text-sm leading-tight">{title}</p>
        {description && (
          <p className="text-xs text-warm-muted mt-1 leading-snug">{description}</p>
        )}
      </div>
    </motion.div>
  );
};
