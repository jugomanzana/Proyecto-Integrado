import React from 'react';
import { Shirt } from 'lucide-react';

// ============================================================
// MOLÉCULA: NavBrand
// Logo + nombre de la aplicación. Se usa en la Navbar y
// en la cabecera del formulario de autenticación.
// Combina el átomo Icon (via lucide-react directo) con
// un texto tipográfico del design system.
// ============================================================

type NavBrandSize = 'sm' | 'md' | 'lg';

interface NavBrandProps {
  size?:      NavBrandSize;
  showLabel?: boolean;
  className?: string;
}

const sizeConfig: Record<NavBrandSize, {
  iconSize: number;
  iconPadding: string;
  textClass: string;
  iconBg: string;
}> = {
  sm: {
    iconSize:    18,
    iconPadding: 'p-1.5',
    textClass:   'text-base font-semibold',
    iconBg:      'bg-warm-beige',
  },
  md: {
    iconSize:    22,
    iconPadding: 'p-2',
    textClass:   'text-xl font-semibold',
    iconBg:      'bg-warm-beige',
  },
  lg: {
    iconSize:    28,
    iconPadding: 'p-3',
    textClass:   'text-2xl font-bold',
    iconBg:      'bg-warm-beige',
  },
};

export const NavBrand: React.FC<NavBrandProps> = ({
  size       = 'md',
  showLabel  = true,
  className  = '',
}) => {
  const { iconSize, iconPadding, textClass, iconBg } = sizeConfig[size];

  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      <div className={[iconBg, iconPadding, 'rounded-full flex items-center justify-center'].join(' ')}>
        <Shirt size={iconSize} className="text-warm-brown" aria-hidden="true" />
      </div>
      {showLabel && (
        <span className={[textClass, 'text-warm-dark tracking-tight'].join(' ')}>
          MyWardrobe
        </span>
      )}
    </div>
  );
};
