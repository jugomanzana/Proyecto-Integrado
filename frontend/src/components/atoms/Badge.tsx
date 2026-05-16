import React from 'react';

// ============================================================
// ÁTOMO: Badge
// Etiqueta visual compacta. Usada para estados de prendas
// (disponible, lavandería, prestado) y categorías.
// ============================================================

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize    = 'sm' | 'md';

interface BadgeProps {
  label:     string;
  variant?:  BadgeVariant;
  size?:     BadgeSize;
  dot?:      boolean;          // Muestra un punto de color antes del texto
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-warm-beige      text-warm-brown',
  accent:  'bg-warm-accent/20  text-warm-accent-dark',
  success: 'bg-status-success/15 text-status-success',
  warning: 'bg-status-warning/15 text-status-warning',
  error:   'bg-status-error/15   text-status-error',
  info:    'bg-status-info/15    text-status-info',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1   text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant   = 'default',
  size      = 'sm',
  dot       = false,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-current"
        />
      )}
      {label}
    </span>
  );
};
