import React from 'react';

// ============================================================
// ÁTOMO: Spinner
// Indicador de carga accesible. Usado en estados asíncronos,
// botones con loading y pantallas de transición.
// ============================================================

type SpinnerSize  = 'sm' | 'md' | 'lg';
type SpinnerColor = 'dark' | 'accent' | 'white' | 'brown';

interface SpinnerProps {
  size?:      SpinnerSize;
  color?:     SpinnerColor;
  label?:     string;           // Texto accesible para screen readers
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-9 h-9 border-[3px]',
};

const colorClasses: Record<SpinnerColor, string> = {
  dark:   'border-warm-dark/20   border-t-warm-dark',
  accent: 'border-warm-accent/20 border-t-warm-accent',
  white:  'border-white/30       border-t-white',
  brown:  'border-warm-brown/20  border-t-warm-brown',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size      = 'md',
  color     = 'accent',
  label     = 'Cargando…',
  className = '',
}) => {
  return (
    <span
      role="status"
      aria-label={label}
      className={[
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className,
      ].join(' ')}
    />
  );
};
