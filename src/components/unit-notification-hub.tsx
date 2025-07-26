
'use client';

import { useNotifications } from '@/context/notification-context';
import { AnimatePresence } from 'framer-motion';
import { UnitNotificationItem } from './unit-notification-item';

export function UnitNotificationHub() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed bottom-4 left-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <UnitNotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
