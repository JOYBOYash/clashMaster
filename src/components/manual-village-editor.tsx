
"use client";

import type { VillageState, Building, Troop } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';
import { Home, Hammer, Shield, Sword, Coins, Building as BuildingIcon } from 'lucide-react';

interface ManualVillageEditorProps {
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

export function ManualVillageEditor({ villageState, onUpdate }: ManualVillageEditorProps) {

  const handleBuildingLevelChange = (buildingId: string, newLevel: number) => {
    const updatedBuildings = villageState.buildings.map(b => 
      b.id === buildingId ? { ...b, level: isNaN(newLevel) ? 0 : Math.max(0, Math.min(b.maxLevel, newLevel)) } : b
    );
    onUpdate({ ...villageState, buildings: updatedBuildings });
  };
  
  const handleTroopLevelChange = (troopId: string, newLevel: number) => {
      const updatedTroops = villageState.troops.map(t => 
        t.id === troopId ? { ...t, level: isNaN(newLevel) ? 0 : Math.max(0, Math.min(t.maxLevel, newLevel)) } : t
      );
      onUpdate({ ...villageState, troops: updatedTroops });
  };
  
  const handleHallLevelChange = (hall: 'townHall' | 'builderHall', newLevel: number) => {
      const safeLevel = isNaN(newLevel) ? 1 : newLevel;
      if (hall === 'townHall') {
          onUpdate({...villageState, townHallLevel: Math.max(1, Math.min(16, safeLevel)) });
      } else {
          onUpdate({...villageState, builderHallLevel: Math.max(1, Math.min(10, safeLevel))});
      }
  }

  const groupedBuildings = useMemo(() => {
    const groups: { home: Record<string, Building[]>, builder: Record<string, Building[]> } = {
      home: { defensive: [], army: [], resource: [], other: [] },
      builder: { defensive: [], army: [], resource: [], other: [] },
    };

    villageState.buildings.forEach(b => {
      const base = b.base;
      if (groups[base] && groups[base][b.type]) {
        groups[base][b.type].push(b);
      }
    });

    return groups;
  }, [villageState.buildings]);
  
  const homeTroops = useMemo(() => villageState.troops.filter(t => t.village === 'home'), [villageState.troops]);
  const builderTroops = useMemo(() => villageState.troops.filter(t => t.village === 'builder'), [villageState.troops]);

  const buildingTypeIcons: Record<string, React.ElementType> = {
    defensive: Shield,
    army: Sword,
    resource: Coins,
    other: BuildingIcon,
  };

  const renderBuildingInputs = (buildings: Building[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
      {buildings
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(b => (
        <div key={b.id} className="space-y-1.5">
          <Label htmlFor={b.id} className="text-sm font-medium">{b.name}</Label>
          <Input 
            id={b.id}
            type="number" 
            value={b.level}
            onChange={(e) => handleBuildingLevelChange(b.id, parseInt(e.target.value, 10))}
            min={0}
            max={b.maxLevel}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
  
  const renderTroopInputs = (troops: Troop[]) => (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
      {troops
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(t => (
        <div key={t.id} className="space-y-1.5">
          <Label htmlFor={t.id} className="text-sm font-medium">{t.name}</Label>
          <Input 
            id={t.id}
            type="number" 
            value={t.level}
            onChange={(e) => handleTroopLevelChange(t.id, parseInt(e.target.value, 10))}
            min={0}
            max={t.maxLevel}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Manual Village Editor</CardTitle>
        <CardDescription>
          You can manually set your building and troop levels here. 
          The AI will use this data for its suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/30">
             <div className="space-y-1.5">
              <Label htmlFor="townHallLevel" className="text-base font-semibold flex items-center"><Home className="w-5 h-5 mr-2" />Town Hall Level</Label>
              <Input 
                id="townHallLevel"
                type="number" 
                value={villageState.townHallLevel}
                onChange={(e) => handleHallLevelChange('townHall', parseInt(e.target.value, 10))}
                min={1}
                max={16}
                className="w-full"
              />
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="builderHallLevel" className="text-base font-semibold flex items-center"><Hammer className="w-5 h-5 mr-2" />Builder Hall Level</Label>
              <Input 
                id="builderHallLevel"
                type="number" 
                value={villageState.builderHallLevel}
                onChange={(e) => handleHallLevelChange('builderHall', parseInt(e.target.value, 10))}
                min={1}
                max={10}
                className="w-full"
              />
            </div>
        </div>

        <Accordion type="multiple" defaultValue={['home-village']} className="w-full space-y-4">
            <AccordionItem value="home-village" className="border rounded-lg">
                <AccordionTrigger className="text-xl font-headline flex items-center p-4 hover:no-underline"><Home className="w-6 h-6 mr-3 text-primary" />Home Village</AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Buildings</h4>
                             <Accordion type="multiple" defaultValue={['defensive']} className="w-full space-y-1">
                                {Object.entries(groupedBuildings.home).map(([type, buildings]) => {
                                     if (buildings.length === 0) return null;
                                     const Icon = buildingTypeIcons[type];
                                     return (
                                        <AccordionItem value={type} key={`home-${type}`}>
                                            <AccordionTrigger className="capitalize text-base py-2"><Icon className="w-4 h-4 mr-2 text-muted-foreground" />{type}</AccordionTrigger>
                                            <AccordionContent className="pt-4 border-l ml-2 pl-4">{renderBuildingInputs(buildings)}</AccordionContent>
                                        </AccordionItem>
                                     )
                                })}
                            </Accordion>
                        </div>
                         <div>
                            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Troops</h4>
                             {renderTroopInputs(homeTroops)}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="builder-base" className="border rounded-lg">
                <AccordionTrigger className="text-xl font-headline flex items-center p-4 hover:no-underline"><Hammer className="w-6 h-6 mr-3 text-primary" />Builder Base</AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Buildings</h4>
                             <Accordion type="multiple" defaultValue={['defensive']} className="w-full space-y-1">
                                {Object.entries(groupedBuildings.builder).map(([type, buildings]) => {
                                     if (buildings.length === 0) return null;
                                     const Icon = buildingTypeIcons[type];
                                     return (
                                        <AccordionItem value={type} key={`builder-${type}`}>
                                            <AccordionTrigger className="capitalize text-base py-2"><Icon className="w-4 h-4 mr-2 text-muted-foreground" />{type}</AccordionTrigger>
                                            <AccordionContent className="pt-4 border-l ml-2 pl-4">{renderBuildingInputs(buildings)}</AccordionContent>
                                        </AccordionItem>
                                     )
                                })}
                            </Accordion>
                        </div>
                         <div>
                            <h4 className="font-semibold text-lg mb-4 border-b pb-2">Troops</h4>
                             {renderTroopInputs(builderTroops)}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
