
"use client";

import { useState, useEffect } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Hammer, Clock } from 'lucide-react';
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';

interface UpgradeCardProps {
  building: Building;
}

export function UpgradeCard({ building }: UpgradeCardProps) {
  const [timeLeft, setTimeLeft] = useState('Calculating...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!building.isUpgrading || !building.upgradeEndTime || !building.upgradeTime) {
      return;
    }

    const upgradeEndTime = new Date(building.upgradeEndTime);
    const totalDuration = building.upgradeTime * 3600; // in seconds

    const calculateState = () => {
        const now = new Date();
        const secondsRemaining = differenceInSeconds(upgradeEndTime, now);

        if (secondsRemaining <= 0) {
            setTimeLeft('Completed!');
            setProgress(100);
            return true; // completed
        }
        
        const duration = intervalToDuration({ start: 0, end: secondsRemaining * 1000 });
        setTimeLeft(formatDuration(duration, { format: ['days', 'hours', 'minutes', 'seconds'] }));

        const elapsed = totalDuration - secondsRemaining;
        setProgress(Math.min(100, (elapsed / totalDuration) * 100));
        return false; // not completed
    };

    // Initial state calculation
    if (calculateState()) {
      return; // If already completed, do nothing more
    }
    
    const intervalId = setInterval(() => {
        if (calculateState()) {
            clearInterval(intervalId);
        }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [building]);

  if (!building.isUpgrading) return null;

  return (
    <Card className="bg-card/80 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-headline">
          <Hammer className="w-5 h-5 mr-3 text-primary" />
          {building.name} to Level {building.level + 1}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-accent-foreground">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            <span className="font-mono text-sm font-semibold tracking-wider">{timeLeft}</span>
          </div>
          <Progress value={progress} className="h-3 [&>div]:bg-accent" />
        </div>
      </CardContent>
    </Card>
  );
}
