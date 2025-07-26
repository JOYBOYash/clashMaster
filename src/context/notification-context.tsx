
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: number;
  name: string;
  image: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = new Date().getTime();
    setNotifications(current => [...current, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(current => current.filter(n => n.id !== id));
  }, []);

  const value = {
      notifications,
      addNotification,
      removeNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
