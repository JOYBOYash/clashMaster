
"use client";

import type { VillageState, Building, Troop, Hero, Pet, Equipment, BuildingConfig } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { Home, Hammer } from 'lucide-react';
import { ALL_BUILDINGS_CONFIG, ALL_TROOPS_CONFIG, ALL_HEROES_CONFIG, ALL_PETS_CONFIG, ALL_EQUIPMENT_CONFIG } from '@/lib/constants';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface ManualVillageEditorProps {
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

type Step = 'halls' | 'home_key' | 'home_multi' | 'home_army' | 'builder_key' | 'builder_multi' | 'builder_army' | 'done';

function getBuildingCountForLevel(config: BuildingConfig, level: number): number {
    if (!config.count) {
        return 0;
    }
    const availableLevels = Object.keys(config.count)
                                .map(Number)
                                .filter(thLevel => thLevel <= level);
    if (availableLevels.length === 0) {
        return 0;
    }
    const highestThLevel = Math.max(...availableLevels);
    return config.count[highestThLevel] || 0;
}

export function ManualVillageEditor({ villageState, onUpdate }: ManualVillageEditorProps) {
  const [step, setStep] = useState<Step>('halls');

  const handleLevelChange = (
    id: string,
    newLevel: number,
    itemType: 'building' | 'troop' | 'hero' | 'pet' | 'equipment'
  ) => {
    const safeLevel = isNaN(newLevel) ? 0 : newLevel;
    let updatedState = { ...villageState };

    const updateItem = (items: any[]) => {
      return items.map(item =>
        item.id === id ? { ...item, level: Math.max(0, Math.min(item.maxLevel, safeLevel)) } : item
      );
    };

    switch (itemType) {
      case 'building':
        updatedState.buildings = updateItem(villageState.buildings);
        break;
      case 'troop':
        updatedState.troops = updateItem(villageState.troops);
        break;
      case 'hero':
        updatedState.heroes = updateItem(villageState.heroes);
        break;
      case 'pet':
        updatedState.pets = updateItem(villageState.pets);
        break;
      case 'equipment':
        updatedState.equipment = updateItem(villageState.equipment);
        break;
    }
    onUpdate(updatedState);
  };

  const handleHallLevelChange = (hall: 'townHall' | 'builderHall', newLevel: number) => {
    const safeLevel = isNaN(newLevel) ? 1 : newLevel;
    const key = hall === 'townHall' ? 'townHallLevel' : 'builderHallLevel';
    const max = hall === 'townHall' ? 16 : 10;
    const newHallLevel = Math.max(1, Math.min(max, safeLevel));

    // Re-initialize buildings based on new hall level
    const newBuildings: Building[] = [];
    ALL_BUILDINGS_CONFIG.forEach(config => {
      const isHomeBase = config.base === 'home';
      const currentLevel = isHomeBase ? (hall === 'townHall' ? newHallLevel : villageState.townHallLevel) : (hall === 'builderHall' ? newHallLevel : villageState.builderHallLevel);
      
      if (config.unlockedAt > currentLevel) return;

      const count = getBuildingCountForLevel(config, currentLevel);
      for (let i = 0; i < count; i++) {
        const existingBuilding = villageState.buildings.find(b => b.name === config.name && b.id === `${config.name.replace(/\s/g, '')}-${i}`);
        newBuildings.push({
          id: `${config.name.replace(/\s/g, '')}-${i}`,
          name: config.name,
          level: existingBuilding?.level || (config.name === 'Town Hall' ? newHallLevel : (config.name === 'Builder Hall' ? newHallLevel : 1)),
          maxLevel: config.maxLevel,
          type: config.type,
          base: config.base,
          isUpgrading: false,
        });
      }
    });

    onUpdate({ ...villageState, [key]: newHallLevel, buildings: newBuildings });
  };
  
  const renderInputsForMultiple = (name: string, base: 'home' | 'builder') => {
    const buildings = villageState.buildings.filter(b => b.name === name && b.base === base);
    if (buildings.length === 0) return null;
    
    return (
        <div key={name} className="space-y-4">
            <h4 className="font-semibold">{name}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {buildings.map((building, index) => (
                    <div key={building.id} className="space-y-1.5">
                        <Label htmlFor={building.id} className="text-sm font-medium">Instance {index + 1}</Label>
                        <Input
                            id={building.id}
                            type="number"
                            value={building.level}
                            onChange={(e) => handleLevelChange(building.id, parseInt(e.target.value, 10), 'building')}
                            min={0}
                            max={building.maxLevel}
                            className="w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
  };
  
  const renderInputsForSingle = (items: (Building | Troop | Hero | Pet | Equipment)[], itemType: 'building' | 'troop' | 'hero' | 'pet' | 'equipment') => (
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

  const getBuildings = (base: 'home' | 'builder', isMulti: boolean) => {
    return ALL_BUILDINGS_CONFIG.filter(config => {
        const isCorrectBase = config.base === base;
        const isUnlocked = config.unlockedAt <= (base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel);
        const hasMultiple = (config.count?.[base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel] ?? 1) > 1;
        return isCorrectBase && isUnlocked && (isMulti ? hasMultiple : !hasMultiple);
    }).map(config => config.name);
  };

  const getSingleBuildingsData = (base: 'home' | 'builder') => {
    const names = getBuildings(base, false);
    return villageState.buildings.filter(b => names.includes(b.name) && b.base === base && b.id.endsWith('-0'));
  }

  const sections: Record<Step, {title: string, description: string, content: JSX.Element | null, next: Step | null, prev: Step | null}> = {
    halls: {
        title: "Hall Levels",
        description: "Start by setting your Town Hall and Builder Hall levels. This will determine which buildings are available.",
        content: (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4">
                <div className="space-y-1.5">
                    <Label htmlFor="townHallLevel" className="text-base font-semibold flex items-center"><Home className="w-5 h-5 mr-2" />Town Hall Level</Label>
                    <Input id="townHallLevel" type="number" value={villageState.townHallLevel} onChange={(e) => handleHallLevelChange('townHall', parseInt(e.target.value, 10))} min={1} max={16} />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="builderHallLevel" className="text-base font-semibold flex items-center"><Hammer className="w-5 h-5 mr-2" />Builder Hall Level</Label>
                    <Input id="builderHallLevel" type="number" value={villageState.builderHallLevel} onChange={(e) => handleHallLevelChange('builderHall', parseInt(e.target.value, 10))} min={1} max={10} />
                </div>
            </div>
        ),
        next: 'home_key',
        prev: null
    },
    home_key: {
        title: "Home Village: Key Buildings",
        description: "Set the levels for your main buildings in the Home Village.",
        content: renderInputsForSingle(getSingleBuildingsData('home'), 'building'),
        next: 'home_multi',
        prev: 'halls'
    },
    home_multi: {
        title: "Home Village: Other Buildings",
        description: "Set the levels for each instance of your other buildings.",
        content: <div className="space-y-6">{getBuildings('home', true).map(name => renderInputsForMultiple(name, 'home'))}</div>,
        next: 'home_army',
        prev: 'home_key'
    },
    home_army: {
        title: "Home Village: Army",
        description: "Set the levels for all your troops, spells, heroes, pets, and equipment.",
        content: (
            <div className="space-y-8">
                <div>
                    <h4 className="font-semibold mb-4">Troops & Spells</h4>
                    {renderInputsForSingle(villageState.troops.filter(t => t.village === 'home'), 'troop')}
                </div>
                {villageState.townHallLevel >= 7 && <div><h4 className="font-semibold mb-4">Heroes</h4>{renderInputsForSingle(villageState.heroes.filter(h => h.village === 'home'), 'hero')}</div>}
                {villageState.townHallLevel >= 8 && <div><h4 className="font-semibold mb-4">Hero Equipment</h4>{renderInputsForSingle(villageState.equipment, 'equipment')}</div>}
                {villageState.townHallLevel >= 14 && <div><h4 className="font-semibold mb-4">Hero Pets</h4>{renderInputsForSingle(villageState.pets, 'pet')}</div>}
            </div>
        ),
        next: 'builder_key',
        prev: 'home_multi'
    },
    builder_key: {
        title: "Builder Base: Key Buildings",
        description: "Set the levels for your main buildings in the Builder Base.",
        content: renderInputsForSingle(getSingleBuildingsData('builder'), 'building'),
        next: 'builder_multi',
        prev: 'home_army'
    },
    builder_multi: {
        title: "Builder Base: Other Buildings",
        description: "Set the levels for each instance of your other buildings.",
        content: <div className="space-y-6">{getBuildings('builder', true).map(name => renderInputsForMultiple(name, 'builder'))}</div>,
        next: 'builder_army',
        prev: 'builder_key'
    },
    builder_army: {
        title: "Builder Base: Army",
        description: "Set the levels for your Builder Base troops and heroes.",
        content: (
             <div className="space-y-8">
                <div>
                    <h4 className="font-semibold mb-4">Troops</h4>
                    {renderInputsForSingle(villageState.troops.filter(t => t.village === 'builder'), 'troop')}
                </div>
                {villageState.builderHallLevel >= 5 && <div><h4 className="font-semibold mb-4">Heroes</h4>{renderInputsForSingle(villageState.heroes.filter(h => h.village === 'builder'), 'hero')}</div>}
            </div>
        ),
        next: 'done',
        prev: 'builder_multi'
    },
    done: {
        title: "Setup Complete!",
        description: "You have successfully configured your village. You can close this view or go back to make more changes.",
        content: <p className="text-center text-green-500 font-bold py-8">All levels saved!</p>,
        next: null,
        prev: 'builder_army'
    }
  };

  const currentSection = sections[step];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{currentSection.title}</CardTitle>
        <CardDescription>
          {currentSection.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentSection.content}
      </CardContent>
      <Separator />
      <CardContent className="p-4 flex justify-between items-center">
            <div>
                {currentSection.prev && (
                    <Button variant="outline" onClick={() => setStep(currentSection.prev!)}>Previous</Button>
                )}
            </div>
            <div>
                {currentSection.next && (
                    <Button onClick={() => setStep(currentSection.next!)}>Next</Button>
                )}
                 {step === 'done' && (
                     <Button onClick={() => setStep('halls')}>Start Over</Button>
                )}
            </div>
      </CardContent>
    </Card>
  );
}
