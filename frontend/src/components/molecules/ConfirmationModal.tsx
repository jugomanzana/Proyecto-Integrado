import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../atoms/Button';

// ============================================================
// MOLÉCULA: ConfirmationModal
// Diálogo premium y animado de confirmación para acciones destructivas
// o críticas (eliminar prendas, outfits o la cuenta).
// ============================================================

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Fondo semi-transparente difuminado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-warm-dark/45 backdrop-blur-sm"
          />

          {/* Tarjeta de Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-warm-beige shadow-xl max-w-md w-full overflow-hidden p-6 md:p-8 z-10 flex flex-col gap-6"
          >
            {/* Cabecera / Icono y Texto */}
            <div className="flex gap-4 items-start">
              {variant === 'danger' && (
                <div className="p-3 bg-status-error/10 text-status-error rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold text-warm-dark leading-tight">{title}</h3>
                <p className="text-sm text-warm-brown leading-relaxed">{message}</p>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 mt-1 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                size="sm"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
