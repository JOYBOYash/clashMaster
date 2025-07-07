
"use client";

import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Hammer } from 'lucide-react';
import { UpgradeCard } from './upgrade-card';

interface UpgradeStatusProps {
  buildings: Building[];
}

export function UpgradeStatus({ buildings }: UpgradeStatusProps) {
  const upgradingBuildings = buildings.filter(b => b.isUpgrading);

  const handleComplete = (buildingId: string) => {
    // This function would ideally trigger a state update to refresh the UI
    console.log(`Upgrade for ${buildingId} marked as complete.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <Hammer className="mr-2 h-6 w-6 text-primary" />
            Active Upgrades
        </CardTitle>
        <CardDescription>What your builders are working on.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upgradingBuildings.length > 0 ? (
          upgradingBuildings.map(b => (
            <UpgradeCard key={b.id} building={b} onComplete={() => handleComplete(b.id)} />
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="font-semibold">All builders are free!</p>
            <p className="text-sm">Time to start a new upgrade.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
