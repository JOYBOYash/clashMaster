
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { AccountSettings } from '@/components/account-settings';
import { TroopGuide } from '@/components/troop-guide';
import { type VillageState } from '@/lib/constants';
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
  
  if (!villageState) {
    return <PlayerTagForm onDataFetched={handleDataFetched} />;
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
          <AccountSettings onReset={handleReset} />
        </TabsContent>
      </Tabs>
    </>
  );
}
