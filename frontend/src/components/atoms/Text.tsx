import React from 'react';

// ============================================================
// ÁTOMO: Text
// Componente tipográfico polimórfico. Renderiza el elemento
// HTML correcto según el contexto sin repetir clases Tailwind.
// ============================================================

type TextTag     = 'p' | 'span' | 'small' | 'label' | 'strong' | 'em' | 'li';
type TextVariant = 'body' | 'caption' | 'label' | 'muted' | 'accent' | 'error';

interface TextProps {
  as?:        TextTag;
  variant?:   TextVariant;
  children:   React.ReactNode;
  className?: string;
  htmlFor?:   string;  // Solo cuando as="label"
}

const variantClasses: Record<TextVariant, string> = {
  body:    'text-base  font-normal  text-warm-dark    leading-relaxed',
  caption: 'text-sm    font-normal  text-warm-brown   leading-normal',
  label:   'text-sm    font-semibold text-warm-brown  tracking-wide',
  muted:   'text-sm    font-normal  text-warm-muted   leading-normal',
  accent:  'text-base  font-medium  text-warm-accent',
  error:   'text-xs    font-normal  text-status-error',
};

export const Text: React.FC<TextProps> = ({
  as        = 'p',
  variant   = 'body',
  children,
  className = '',
  htmlFor,
}) => {
  const Tag = as as React.ElementType;

  return (
    <Tag
      className={[variantClasses[variant], className].join(' ')}
      {...(as === 'label' && htmlFor ? { htmlFor } : {})}
    >
      {children}
    </Tag>
  );
};
