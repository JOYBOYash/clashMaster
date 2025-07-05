"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { AccountSettings } from '@/components/account-settings';
import { initialVillageState, type VillageState } from '@/lib/constants';

export function ClashTrackDashboard() {
  const [villageState, setVillageState] = useState<VillageState>(initialVillageState);

  const handleUpdate = (newState: VillageState) => {
    setVillageState(newState);
    // Here you could also persist the state to localStorage
  };

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
        <TabsTrigger value="home">Home Village</TabsTrigger>
        <TabsTrigger value="builder">Builder Base</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-6">
        <VillageView base="home" villageState={villageState} />
      </TabsContent>
      <TabsContent value="builder" className="mt-6">
        <VillageView base="builder" villageState={villageState} />
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        <AccountSettings villageState={villageState} onUpdate={handleUpdate} />
      </TabsContent>
    </Tabs>
  );
}
