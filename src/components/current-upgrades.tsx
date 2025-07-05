"use client";

import type { Building } from '@/lib/constants';
import { UpgradeCard } from './upgrade-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Hammer } from 'lucide-react';

interface CurrentUpgradesProps {
  buildings: Building[];
}

export function CurrentUpgrades({ buildings }: CurrentUpgradesProps) {
  const upgradesInProgress = buildings.filter(b => b.isUpgrading);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <Hammer className="mr-2 h-6 w-6 text-primary" />
          Active Upgrades
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upgradesInProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgradesInProgress.map(building => (
              <UpgradeCard key={building.id} building={building} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No buildings are currently being upgraded.</p>
        )}
      </CardContent>
    </Card>
  );
}
