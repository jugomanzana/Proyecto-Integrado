import React from 'react';

// ============================================================
// ÁTOMO: Button
// Unidad mínima de acción. Soporta variantes, tamaños,
// estado loading y disabled.
// ============================================================

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  fullWidth?: boolean;
  children:  React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-warm-dark   text-white       hover:bg-warm-brown  disabled:bg-warm-muted',
  secondary: 'bg-warm-beige  text-warm-dark   hover:bg-warm-beige-dark border border-warm-beige-dark',
  ghost:     'bg-transparent text-warm-brown  hover:text-warm-accent hover:bg-warm-beige/50',
  danger:    'bg-status-error text-white      hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm  rounded-lg',
  md: 'px-5 py-3   text-base rounded-xl',
  lg: 'px-7 py-4   text-lg  rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}) => {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:ring-offset-2 disabled:cursor-not-allowed select-none';

  return (
    <button
      disabled={disabled || loading}
      className={[
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
      )}
      {children}
    </button>
  );
};
