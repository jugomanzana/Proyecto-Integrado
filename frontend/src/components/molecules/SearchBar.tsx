import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

// ============================================================
// MOLÉCULA: SearchBar
// Campo de búsqueda con icono, botón para limpiar y
// callback onSearch. Usada en el filtrado del armario.
// ============================================================

interface SearchBarProps {
  placeholder?: string;
  value?:       string;
  onChange?:    (value: string) => void;
  onSearch?:    (value: string) => void;  // Dispara al pulsar Enter
  className?:   string;
  id?:          string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Buscar prendas…',
  value: externalValue,
  onChange,
  onSearch,
  className   = '',
  id          = 'search-bar',
}) => {
  // Modo no controlado si no se proporciona value externo
  const [internalValue, setInternalValue] = useState('');
  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch?.(value);
  };

  return (
    <div className={['relative flex items-center w-full', className].join(' ')}>
      {/* Icono lupa */}
      <Search
        size={16}
        aria-hidden="true"
        className="absolute left-3.5 text-warm-muted pointer-events-none"
      />

      <input
        ref={inputRef}
        id={id}
        type="search"
        role="searchbox"
        aria-label={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={[
          'w-full pl-10 pr-9 py-2.5 rounded-xl border border-warm-beige',
          'bg-warm-cream/50 text-warm-dark text-sm placeholder:text-warm-muted',
          'transition-all duration-200 focus:outline-none focus:ring-2',
          'focus:ring-warm-accent focus:bg-white focus:border-transparent',
        ].join(' ')}
      />

      {/* Botón limpiar — solo visible con contenido */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-3 text-warm-muted hover:text-warm-dark transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
