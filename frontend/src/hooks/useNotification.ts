import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  const { addNotification, removeNotification, notifications } = context;

  const notify = {
    success: (message: string, duration?: number) => addNotification('success', message, duration),
    error: (message: string, duration?: number) => addNotification('error', message, duration),
    warning: (message: string, duration?: number) => addNotification('warning', message, duration),
    info: (message: string, duration?: number) => addNotification('info', message, duration),
  };

  return { notify, removeNotification, notifications };
};
