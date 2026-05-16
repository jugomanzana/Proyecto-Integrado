import React from 'react';

// ============================================================
// ÁTOMO: Divider
// Separador visual entre secciones. Soporta texto central
// (útil en login: "or continue with") y orientación.
// ============================================================

interface DividerProps {
  label?:     string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className = '' }) => {
  if (label) {
    return (
      <div className={['flex items-center gap-3', className].join(' ')}>
        <hr className="flex-1 border-warm-beige-dark" />
        <span className="text-xs font-medium text-warm-muted tracking-wider uppercase">
          {label}
        </span>
        <hr className="flex-1 border-warm-beige-dark" />
      </div>
    );
  }

  return <hr className={['border-warm-beige-dark', className].join(' ')} />;
};
