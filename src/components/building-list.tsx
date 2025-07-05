
"use client";

import { useState, useMemo } from 'react';
import type { Building, VillageState } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, Coins, Sword, SlidersHorizontal, ArrowUpCircle } from 'lucide-react';
import { StartUpgradeDialog } from './start-upgrade-dialog';

interface BuildingListProps {
  buildings: Building[];
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

export function BuildingList({ buildings, villageState, onUpdate }: BuildingListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const handleStartUpgradeClick = (building: Building) => {
    setSelectedBuilding(building);
    setDialogOpen(true);
  };
  
  const handleStartUpgrade = (buildingId: string, durationDays: number, durationHours: number, durationMinutes: number) => {
    const totalHours = (durationDays * 24) + durationHours + (durationMinutes / 60);
    const upgradeEndTime = new Date(Date.now() + totalHours * 60 * 60 * 1000).toISOString();
    
    const updatedBuildings = villageState.buildings.map(b => 
      b.id === buildingId 
        ? {
            ...b,
            isUpgrading: true,
            upgradeEndTime: upgradeEndTime,
            upgradeTime: totalHours,
          }
        : b
    );

    onUpdate({ ...villageState, buildings: updatedBuildings });
    setDialogOpen(false);
    setSelectedBuilding(null);
  };

  const groupedBuildings = useMemo(() => {
    const groups: Record<string, Building[]> = {
      defensive: [],
      army: [],
      resource: [],
      other: [],
    };
    buildings.forEach(b => {
      if(groups[b.type]) {
        groups[b.type].push(b);
      }
    });
    return groups;
  }, [buildings]);

  const typeIcons: Record<string, React.ElementType> = {
    defensive: Shield,
    army: Sword,
    resource: Coins,
    other: SlidersHorizontal,
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Village Buildings</CardTitle>
          <CardDescription>View all your buildings and start new upgrades manually.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedBuildings).map(([type, buildingsOfType]) => {
              if (buildingsOfType.length === 0) return null;
              const Icon = typeIcons[type];
              return (
                <AccordionItem value={type} key={type}>
                  <AccordionTrigger className="text-lg font-semibold capitalize">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3 text-primary" />
                      {type} Buildings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {buildingsOfType
                        .sort((a,b) => a.name.localeCompare(b.name))
                        .map(b => (
                        <div key={b.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <div>
                            <p className="font-medium">{b.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Level {b.level} / {b.maxLevel}
                            </p>
                          </div>
                          {b.level < b.maxLevel && !b.isUpgrading && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStartUpgradeClick(b)}
                            >
                                <ArrowUpCircle className="mr-2" />
                                Start Upgrade
                            </Button>
                          )}
                          {b.isUpgrading && (
                              <span className="text-sm text-accent font-semibold">Upgrading...</span>
                          )}
                           {b.level >= b.maxLevel && (
                              <span className="text-sm text-green-600 font-semibold">Max Level</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
      {selectedBuilding && (
        <StartUpgradeDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          building={selectedBuilding}
          onStartUpgrade={handleStartUpgrade}
        />
      )}
    </>
  );
}
