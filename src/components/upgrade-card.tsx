
"use client";

import { useState, useEffect } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Hammer, Clock, CheckCircle } from 'lucide-react';
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface UpgradeCardProps {
  building: Building;
  onComplete: () => void;
}

export function UpgradeCard({ building, onComplete }: UpgradeCardProps) {
  const [timeLeft, setTimeLeft] = useState('Calculating...');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!building.isUpgrading || !building.upgradeEndTime) {
      return;
    }

    const upgradeEndTime = new Date(building.upgradeEndTime);

    const calculateState = () => {
        const now = new Date();
        const secondsRemaining = differenceInSeconds(upgradeEndTime, now);

        if (secondsRemaining <= 0) {
            setTimeLeft('Completed!');
            setIsCompleted(true);
            return true; // completed
        }
        
        const duration = intervalToDuration({ start: 0, end: secondsRemaining * 1000 });
        const formattedDuration = formatDuration(duration, { format: ['days', 'hours', 'minutes', 'seconds'] });
        setTimeLeft(formattedDuration.length > 0 ? formattedDuration : "Less than a second");
        return false; // not completed
    };

    if (calculateState()) {
      return; 
    }
    
    const intervalId = setInterval(() => {
        if (calculateState()) {
            clearInterval(intervalId);
        }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [building.isUpgrading, building.upgradeEndTime, onComplete]);

  if (!building.isUpgrading) return null;

  return (
    <Card className="bg-green-100/40 dark:bg-green-900/20 border-green-500/30 overflow-hidden">
        <CardContent className="p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
                 <Badge variant="secondary" className="bg-yellow-400/80 text-yellow-900 border-yellow-500/50">
                    <Hammer className="w-3 h-3 mr-1.5" />
                    UPGRADING
                </Badge>
                <Badge variant="outline" className="border-gray-400/50">
                    <Clock className="w-3 h-3 mr-1.5" />
                    {timeLeft}
                </Badge>
            </div>
            
            <h3 className="font-bold text-lg text-card-foreground font-headline tracking-wide">{building.name} to Level {building.level + 1}</h3>
            <p className="text-sm text-muted-foreground mt-1">This builder is busy working on your village.</p>
            
            {isCompleted && (
            <Button onClick={onComplete} className="mt-4 w-full bg-green-600 hover:bg-green-700 self-end">
                <CheckCircle className="mr-2" />
                Finish Upgrade
            </Button>
            )}
        </CardContent>
    </Card>
  );
}
