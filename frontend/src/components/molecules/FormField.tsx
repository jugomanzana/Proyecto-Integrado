import React from 'react';
import { Input } from '../atoms/Input';

// ============================================================
// MOLÉCULA: FormField
// Combina Label + Input + mensaje de ayuda/error en una
// unidad de formulario cohesiva y accesible.
// Diferencia con el átomo Input: FormField añade un helper
// text opcional y gestiona el layout vertical del campo.
// ============================================================

interface FormFieldProps {
  id:          string;
  label:       string;
  type?:       React.InputHTMLAttributes<HTMLInputElement>['type'];
  value:       string;
  onChange:    (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?:       string;
  helper?:      string;         // Texto de ayuda bajo el campo (no error)
  icon?:        React.ReactNode;
  required?:    boolean;
  disabled?:    boolean;
  autoComplete?: string;
  maxLength?:   number;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type        = 'text',
  value,
  onChange,
  placeholder,
  error,
  helper,
  icon,
  required    = false,
  disabled    = false,
  autoComplete,
  maxLength   = 50, // Límite por defecto para evitar inyecciones masivas
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {/* El átomo Input ya renderiza el label y el error */}
      <Input
        id={id}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
        icon={icon}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />

      {/* Helper text — solo visible si no hay error */}
      {helper && !error && (
        <p className="text-xs text-warm-muted mt-0.5 pl-1">
          {helper}
        </p>
      )}
    </div>
  );
};
