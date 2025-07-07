
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { AccountSettings } from '@/components/account-settings';
import { TroopGuide } from '@/components/troop-guide';
import { type VillageState, DEMO_VILLAGE_STATE, ALL_BUILDINGS_CONFIG, ALL_TROOPS_CONFIG, type Building, type Troop } from '@/lib/constants';
import { PlayerTagForm } from './player-tag-form';

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
    // Construct a comprehensive state object so the editor is fully populated.
    const fullBuildings: Building[] = ALL_BUILDINGS_CONFIG.map((config, index) => {
      const existing = DEMO_VILLAGE_STATE.buildings.find(b => b.name === config.name && b.base === config.base);
      return {
        id: `${config.name.replace(/\s/g, '')}-${config.base}-${index}`,
        name: config.name,
        level: existing?.level ?? 1,
        maxLevel: config.maxLevel,
        type: config.type,
        base: config.base,
        isUpgrading: existing?.isUpgrading ?? false,
        upgradeEndTime: existing?.upgradeEndTime,
      };
    });

    const fullTroops: Troop[] = ALL_TROOPS_CONFIG.map((config, index) => {
      const existing = DEMO_VILLAGE_STATE.troops.find(t => t.name === config.name && t.village === config.village);
      return {
        id: `${config.name.replace(/\s/g, '')}-${config.village}-${index}`,
        name: config.name,
        level: existing?.level ?? 0,
        maxLevel: config.maxLevel,
        village: config.village,
        elixirType: config.elixirType,
      };
    });

    const manualState: VillageState = {
      townHallLevel: DEMO_VILLAGE_STATE.townHallLevel,
      builderHallLevel: DEMO_VILLAGE_STATE.builderHallLevel,
      buildings: fullBuildings,
      troops: fullTroops,
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
