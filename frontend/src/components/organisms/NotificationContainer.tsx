import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotification } from '../../hooks/useNotification';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none items-end">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <NotificationToast
            key={n.id}
            id={n.id}
            type={n.type}
            message={n.message}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
