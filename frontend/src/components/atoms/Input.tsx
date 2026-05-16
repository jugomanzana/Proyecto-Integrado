import React from 'react';

// ============================================================
// ÁTOMO: Input
// Campo de texto base del design system. Soporta icono
// prefijo, mensaje de error y estado deshabilitado.
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:     string;
  error?:     string;
  icon?:      React.ReactNode;
  id:         string;  // Obligatorio para accesibilidad label↔input
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  id,
  className = '',
  disabled,
  ...rest
}) => {
  const inputBase =
    'w-full px-4 py-3 rounded-xl border bg-warm-cream/50 text-warm-dark placeholder:text-warm-muted ' +
    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-warm-accent focus:bg-white ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  const borderClass = error
    ? 'border-status-error focus:ring-status-error'
    : 'border-warm-beige';

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold tracking-wide text-warm-brown">
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-muted pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={[
            inputBase,
            borderClass,
            icon ? 'pl-10' : '',
            className,
          ].join(' ')}
          {...rest}
        />
      </div>

      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs text-status-error">
          {error}
        </span>
      )}
    </div>
  );
};
