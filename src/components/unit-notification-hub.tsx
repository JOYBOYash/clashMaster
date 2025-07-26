
'use client';

import { useNotifications } from '@/context/notification-context';
import { AnimatePresence } from 'framer-motion';
import { UnitNotificationItem } from './unit-notification-item';

export function UnitNotificationHub() {
  // This component's logic has been moved to NotificationProvider to simplify the tree.
  // The provider now directly renders the list of notifications.
  // This hub component is kept to avoid breaking imports but can be fully removed later.
  return null;
}
