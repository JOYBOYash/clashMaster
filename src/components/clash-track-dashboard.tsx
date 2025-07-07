
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { AccountSettings } from '@/components/account-settings';
import { TroopGuide } from '@/components/troop-guide';
import { 
    type VillageState, 
    ALL_BUILDINGS_CONFIG, type Building, 
    ALL_TROOPS_CONFIG, type Troop,
    ALL_HEROES_CONFIG, type Hero,
    ALL_PETS_CONFIG, type Pet,
    ALL_EQUIPMENT_CONFIG, type Equipment,
    type BuildingConfig
} from '@/lib/constants';
import { PlayerTagForm } from './player-tag-form';

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

export function ClashTrackDashboard() {
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  const handleDataFetched = (newState: VillageState) => {
    setVillageState(newState);
  };
  
  const handleUpdate = (newState: VillageState) => {
    setVillageState(newState);
  };
  
  const handleReset = () => {
    setVillageState(null);
  };
  
  const handleLoadDemo = () => {
    const demoThLevel = 12;
    const demoBhLevel = 9;

    const fullBuildings: Building[] = [];
    ALL_BUILDINGS_CONFIG.forEach(config => {
      const isHomeBase = config.base === 'home';
      const relevantLevel = isHomeBase ? demoThLevel : demoBhLevel;
      if (config.unlockedAt > relevantLevel) {
        return;
      }
      
      const count = getBuildingCountForLevel(config, relevantLevel);

      for (let i = 0; i < count; i++) {
        fullBuildings.push({
          id: `${config.name.replace(/\s/g, '')}-${i}`,
          name: config.name,
          level: config.name === 'Town Hall' ? demoThLevel : (config.name === 'Builder Hall' ? demoBhLevel : 1),
          maxLevel: config.maxLevel,
          type: config.type,
          base: config.base,
          isUpgrading: false,
        });
      }
    });

    const fullTroops: Troop[] = ALL_TROOPS_CONFIG.map((config, index) => ({
        id: `${config.name.replace(/\s/g, '')}-${config.village}-${index}`,
        name: config.name,
        level: 0,
        maxLevel: config.maxLevel,
        village: config.village,
        elixirType: config.elixirType,
    }));
    
    const fullHeroes: Hero[] = ALL_HEROES_CONFIG.map((config, index) => ({
        id: `${config.name.replace(/\s/g, '')}-${config.village}-${index}`,
        name: config.name,
        level: 0,
        maxLevel: config.maxLevel,
        village: config.village,
    }));
    
    const fullPets: Pet[] = ALL_PETS_CONFIG.map((config, index) => ({
        id: `${config.name.replace(/\s/g, '')}-${index}`,
        name: config.name,
        level: 0,
        maxLevel: config.maxLevel,
    }));

    const fullEquipment: Equipment[] = ALL_EQUIPMENT_CONFIG.map((config, index) => ({
        id: `${config.name.replace(/\s/g, '')}-${index}`,
        name: config.name,
        level: 0,
        maxLevel: config.maxLevel,
    }));

    const manualState: VillageState = {
      townHallLevel: demoThLevel,
      builderHallLevel: demoBhLevel,
      buildings: fullBuildings,
      troops: fullTroops,
      heroes: fullHeroes,
      pets: fullPets,
      equipment: fullEquipment,
    };

    setVillageState(manualState);
  };
  
  if (!villageState) {
    return <PlayerTagForm onDataFetched={handleDataFetched} onLoadDemo={handleLoadDemo} />;
  }

  return (
    <>
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
          <TabsTrigger value="home">Home Village</TabsTrigger>
          <TabsTrigger value="builder">Builder Base</TabsTrigger>
          <TabsTrigger value="troops">Troops</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-6">
          <VillageView base="home" villageState={villageState} onUpdate={handleUpdate} />
        </TabsContent>
        <TabsContent value="builder" className="mt-6">
          <VillageView base="builder" villageState={villageState} onUpdate={handleUpdate} />
        </TabsContent>
         <TabsContent value="troops" className="mt-6">
          <TroopGuide villageState={villageState} />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <AccountSettings 
            villageState={villageState}
            onUpdate={handleUpdate}
            onReset={handleReset} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
