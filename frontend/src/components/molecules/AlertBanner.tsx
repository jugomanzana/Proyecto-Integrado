import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

// ============================================================
// MOLÉCULA: AlertBanner
// Bandera de notificación para mensajes de error, éxito,
// advertencia e información. Reemplaza el div ad-hoc
// de bg-red-50 en LoginView.
// ============================================================

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertBannerProps {
  variant?:    AlertVariant;
  message:     string;
  dismissible?: boolean;
  onDismiss?:  () => void;
  className?:  string;
}

const config: Record<AlertVariant, {
  bg: string;
  border: string;
  text: string;
  Icon: React.FC<{ className?: string }>;
}> = {
  error: {
    bg:     'bg-status-error/10',
    border: 'border-status-error/30',
    text:   'text-status-error',
    Icon:   ({ className }) => <XCircle className={className} size={16} />,
  },
  success: {
    bg:     'bg-status-success/10',
    border: 'border-status-success/30',
    text:   'text-status-success',
    Icon:   ({ className }) => <CheckCircle className={className} size={16} />,
  },
  warning: {
    bg:     'bg-status-warning/10',
    border: 'border-status-warning/30',
    text:   'text-status-warning',
    Icon:   ({ className }) => <AlertTriangle className={className} size={16} />,
  },
  info: {
    bg:     'bg-status-info/10',
    border: 'border-status-info/30',
    text:   'text-status-info',
    Icon:   ({ className }) => <Info className={className} size={16} />,
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  variant     = 'error',
  message,
  dismissible = false,
  onDismiss,
  className   = '',
}) => {
  const { bg, border, text, Icon } = config[variant];

  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className={[
          'flex items-start gap-2 px-4 py-3 rounded-xl border text-sm',
          bg, border, text, className,
        ].join(' ')}
      >
        <Icon className="mt-0.5 shrink-0" />
        <span className="flex-1 leading-snug">{message}</span>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Cerrar notificación"
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
