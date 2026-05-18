import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  X 
} from 'lucide-react';
import type { NotificationType } from '../../context/NotificationContext';

interface NotificationToastProps {
  id: string;
  type: NotificationType;
  message: string;
  onClose: (id: string) => void;
}

const config = {
  success: {
    icon: CheckCircle,
    color: 'text-status-success',
    bg: 'bg-status-success/10',
    border: 'border-status-success/20',
  },
  error: {
    icon: XCircle,
    color: 'text-status-error',
    bg: 'bg-status-error/10',
    border: 'border-status-error/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-status-warning',
    bg: 'bg-status-warning/10',
    border: 'border-status-warning/20',
  },
  info: {
    icon: Info,
    color: 'text-status-info',
    bg: 'bg-status-info/10',
    border: 'border-status-info/20',
  },
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ id, type, message, onClose }) => {
  const { icon: Icon, color, bg, border } = config[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className={`
        flex items-center gap-3 p-4 pr-10 rounded-2xl border shadow-xl backdrop-blur-md
        ${bg} ${border} ${color}
        max-w-md w-full relative pointer-events-auto
      `}
    >
      <Icon size={20} className="shrink-0" />
      <p className="text-sm font-medium leading-tight">{message}</p>
      
      <button
        onClick={() => onClose(id)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors"
        aria-label="Cerrar"
      >
        <X size={16} className="opacity-60" />
      </button>
    </motion.div>
  );
};
