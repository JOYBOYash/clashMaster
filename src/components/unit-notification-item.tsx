
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface Notification {
  id: number;
  name: string;
  image: string;
}

interface UnitNotificationItemProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

export const UnitNotificationItem: React.FC<UnitNotificationItemProps> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 3000); // Notification will stay for 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50, scale: 0.8 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      className="pointer-events-auto flex items-center gap-3 w-fit max-w-xs p-2 pr-4 rounded-full overflow-hidden shadow-lg border border-primary/20"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, hsl(var(--card)) 20%, hsl(var(--card)) 100%)'
      }}
    >
      <div className="relative w-10 h-10 bg-black/20 rounded-full p-1 border-2 border-primary/50">
        <Image src={notification.image} alt={notification.name} fill className="object-contain" unoptimized />
      </div>
      <div className="flex-grow flex flex-col justify-center">
        <p className="text-sm font-bold text-foreground truncate">{notification.name}</p>
        <p className="text-xs text-green-400 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Added to Army
        </p>
      </div>
    </motion.div>
  );
};
