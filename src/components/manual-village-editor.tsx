
"use client";

import type { VillageState, Building, Troop, Hero, Pet, Equipment } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';
import { Home, Hammer, Shield, Sword, Coins, Gem, Heart, Zap, Building as BuildingIcon } from 'lucide-react';

interface ManualVillageEditorProps {
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

export function ManualVillageEditor({ villageState, onUpdate }: ManualVillageEditorProps) {

  const handleLevelChange = (
    id: string, 
    newLevel: number, 
    itemType: 'building' | 'troop' | 'hero' | 'pet' | 'equipment'
    ) => {
    const safeLevel = isNaN(newLevel) ? 0 : newLevel;
    let updatedState = { ...villageState };

    const updateItem = (items: any[], maxLevel: number) => {
        return items.map(item => 
            item.id === id ? { ...item, level: Math.max(0, Math.min(item.maxLevel, safeLevel)) } : item
        );
    }
    
    switch(itemType) {
        case 'building':
            updatedState.buildings = updateItem(villageState.buildings, 0); // maxLevel is on the item itself
            break;
        case 'troop':
            updatedState.troops = updateItem(villageState.troops, 0);
            break;
        case 'hero':
            updatedState.heroes = updateItem(villageState.heroes, 0);
            break;
        case 'pet':
            updatedState.pets = updateItem(villageState.pets, 0);
            break;
        case 'equipment':
            updatedState.equipment = updateItem(villageState.equipment, 0);
            break;
    }

    onUpdate(updatedState);
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
      home: { defensive: [], army: [], resource: [], other: [], hero: [] },
      builder: { defensive: [], army: [], resource: [], other: [], hero: [] },
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
  const homeHeroes = useMemo(() => villageState.heroes.filter(h => h.village === 'home'), [villageState.heroes]);
  const builderHeroes = useMemo(() => villageState.heroes.filter(h => h.village === 'builder'), [villageState.heroes]);

  const buildingTypeIcons: Record<string, React.ElementType> = {
    defensive: Shield,
    army: Sword,
    resource: Coins,
    hero: Heart,
    other: BuildingIcon,
  };

  const renderInputs = (items: (Building | Troop | Hero | Pet | Equipment)[], itemType: 'building' | 'troop' | 'hero' | 'pet' | 'equipment') => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
      {items
        .sort((a,b) => a.name.localeCompare(b.name))
        .map(item => (
        <div key={item.id} className="space-y-1.5">
          <Label htmlFor={item.id} className="text-sm font-medium">{item.name}</Label>
          <Input 
            id={item.id}
            type="number" 
            value={item.level}
            onChange={(e) => handleLevelChange(item.id, parseInt(e.target.value, 10), itemType)}
            min={0}
            max={item.maxLevel}
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
          You can manually set all your levels here. The AI will use this data for its suggestions.
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
            {/* HOME VILLAGE */}
            <AccordionItem value="home-village" className="border rounded-lg">
                <AccordionTrigger className="text-xl font-headline flex items-center p-4 hover:no-underline"><Home className="w-6 h-6 mr-3 text-primary" />Home Village</AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <Accordion type="multiple" defaultValue={['buildings']} className="w-full space-y-4">
                        <AccordionItem value="buildings">
                            <AccordionTrigger className="text-lg font-semibold">Buildings</AccordionTrigger>
                            <AccordionContent className="pt-4">
                                 <Accordion type="multiple" defaultValue={['defensive']} className="w-full space-y-1">
                                    {Object.entries(groupedBuildings.home).map(([type, buildings]) => {
                                         if (buildings.length === 0) return null;
                                         const Icon = buildingTypeIcons[type];
                                         return (
                                            <AccordionItem value={type} key={`home-bldg-${type}`}>
                                                <AccordionTrigger className="capitalize text-base py-2"><Icon className="w-4 h-4 mr-2 text-muted-foreground" />{type}</AccordionTrigger>
                                                <AccordionContent className="pt-4 border-l ml-2 pl-4">{renderInputs(buildings, 'building')}</AccordionContent>
                                            </AccordionItem>
                                         )
                                    })}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="troops">
                             <AccordionTrigger className="text-lg font-semibold">Troops</AccordionTrigger>
                             <AccordionContent className="pt-4">{renderInputs(homeTroops, 'troop')}</AccordionContent>
                        </AccordionItem>

                        {villageState.townHallLevel >= 7 && (
                             <AccordionItem value="heroes">
                                <AccordionTrigger className="text-lg font-semibold">Heroes</AccordionTrigger>
                                <AccordionContent className="pt-4">{renderInputs(homeHeroes, 'hero')}</AccordionContent>
                            </AccordionItem>
                        )}
                        
                        {villageState.townHallLevel >= 8 && (
                             <AccordionItem value="equipment">
                                <AccordionTrigger className="text-lg font-semibold">Hero Equipment</AccordionTrigger>
                                <AccordionContent className="pt-4">{renderInputs(villageState.equipment, 'equipment')}</AccordionContent>
                            </AccordionItem>
                        )}

                        {villageState.townHallLevel >= 14 && (
                             <AccordionItem value="pets">
                                <AccordionTrigger className="text-lg font-semibold">Pets</AccordionTrigger>
                                <AccordionContent className="pt-4">{renderInputs(villageState.pets, 'pet')}</AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </AccordionContent>
            </AccordionItem>
            
            {/* BUILDER BASE */}
            <AccordionItem value="builder-base" className="border rounded-lg">
                <AccordionTrigger className="text-xl font-headline flex items-center p-4 hover:no-underline"><Hammer className="w-6 h-6 mr-3 text-primary" />Builder Base</AccordionTrigger>
                 <AccordionContent className="p-4 pt-0">
                    <Accordion type="multiple" defaultValue={['buildings']} className="w-full space-y-4">
                        <AccordionItem value="buildings">
                            <AccordionTrigger className="text-lg font-semibold">Buildings</AccordionTrigger>
                            <AccordionContent className="pt-4">
                                 <Accordion type="multiple" defaultValue={['defensive']} className="w-full space-y-1">
                                    {Object.entries(groupedBuildings.builder).map(([type, buildings]) => {
                                         if (buildings.length === 0) return null;
                                         const Icon = buildingTypeIcons[type];
                                         return (
                                            <AccordionItem value={type} key={`builder-bldg-${type}`}>
                                                <AccordionTrigger className="capitalize text-base py-2"><Icon className="w-4 h-4 mr-2 text-muted-foreground" />{type}</AccordionTrigger>
                                                <AccordionContent className="pt-4 border-l ml-2 pl-4">{renderInputs(buildings, 'building')}</AccordionContent>
                                            </AccordionItem>
                                         )
                                    })}
                                </Accordion>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="troops">
                             <AccordionTrigger className="text-lg font-semibold">Troops</AccordionTrigger>
                             <AccordionContent className="pt-4">{renderInputs(builderTroops, 'troop')}</AccordionContent>
                        </AccordionItem>

                        {villageState.builderHallLevel >= 5 && (
                             <AccordionItem value="heroes">
                                <AccordionTrigger className="text-lg font-semibold">Heroes</AccordionTrigger>
                                <AccordionContent className="pt-4">{renderInputs(builderHeroes, 'hero')}</AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

    