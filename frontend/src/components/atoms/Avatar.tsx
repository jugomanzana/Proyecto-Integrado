import React from 'react';

// ============================================================
// ÁTOMO: Avatar
// Muestra imagen de prenda o usuario. Fallback a iniciales
// cuando no hay imagen disponible.
// ============================================================

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?:       string | null;
  alt:        string;
  size?:      AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

/** Extrae hasta 2 iniciales de un string (ej. "Hugo Domínguez" → "HD") */
const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size      = 'md',
  className = '',
}) => {
  const base = 'rounded-full object-cover flex-shrink-0 overflow-hidden';

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={[base, sizeClasses[size], className].join(' ')}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={[
        base,
        sizeClasses[size],
        'bg-warm-beige text-warm-brown font-semibold flex items-center justify-center select-none',
        className,
      ].join(' ')}
    >
      {getInitials(alt)}
    </div>
  );
};
