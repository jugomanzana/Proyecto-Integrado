import React from 'react';
import { LucideProps } from 'lucide-react';

// ============================================================
// ÁTOMO: Icon
// Wrapper de iconos de lucide-react con tamaños y colores
// normalizados al design system de MyWardrobe.
// ============================================================

type IconSize  = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconColor = 'dark' | 'brown' | 'muted' | 'accent' | 'white' | 'inherit';

interface IconProps extends Omit<LucideProps, 'size'> {
  icon:      React.FC<LucideProps>;
  size?:     IconSize;
  color?:    IconColor;
  className?: string;
}

const sizeMap: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const colorClasses: Record<IconColor, string> = {
  dark:    'text-warm-dark',
  brown:   'text-warm-brown',
  muted:   'text-warm-muted',
  accent:  'text-warm-accent',
  white:   'text-white',
  inherit: '',
};

export const Icon: React.FC<IconProps> = ({
  icon: LucideIcon,
  size      = 'md',
  color     = 'inherit',
  className = '',
  ...rest
}) => {
  return (
    <LucideIcon
      size={sizeMap[size]}
      aria-hidden="true"
      className={[colorClasses[color], className].join(' ')}
      {...rest}
    />
  );
};
