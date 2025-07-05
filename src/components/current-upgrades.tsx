
"use client";

import type { Building, VillageState } from '@/lib/constants';
import { UpgradeCard } from './upgrade-card';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Hammer } from 'lucide-react';

interface CurrentUpgradesProps {
  buildings: Building[];
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

export function CurrentUpgrades({ buildings, villageState, onUpdate }: CurrentUpgradesProps) {
  const upgradesInProgress = buildings.filter(b => b.isUpgrading);

  const handleCompleteUpgrade = (buildingId: string) => {
    const buildingToUpdate = villageState.buildings.find(b => b.id === buildingId);

    if (!buildingToUpdate) return;

    const updatedBuildings = villageState.buildings.map(b => 
      b.id === buildingId 
        ? {
            ...b,
            level: b.level + 1,
            isUpgrading: false,
            upgradeEndTime: undefined,
            upgradeTime: undefined,
          }
        : b
    );
    
    onUpdate({ ...villageState, buildings: updatedBuildings });
  };


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
              <UpgradeCard 
                key={building.id} 
                building={building}
                onComplete={() => handleCompleteUpgrade(building.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No buildings are currently being upgraded.</p>
        )}
      </CardContent>
    </Card>
  );
}
