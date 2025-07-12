
"use client";

import { useState, useEffect } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hammer, Clock, CheckCircle } from 'lucide-react';
import { differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
import { Button } from './ui/button';

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
    <Card className="bg-gradient-to-br from-card to-muted/20 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-headline">
          <Hammer className="w-5 h-5 mr-3 text-primary" />
          {building.name} to Level {building.level + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center text-accent-foreground">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            <span className="font-mono text-sm font-semibold tracking-wider">{timeLeft}</span>
          </div>
        </div>
        {isCompleted && (
          <Button onClick={onComplete} className="mt-4 w-full bg-green-600 hover:bg-green-700" size="sm">
            <CheckCircle className="mr-2" />
            Finish Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
