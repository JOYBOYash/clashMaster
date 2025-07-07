"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { TroopGuide } from '@/components/troop-guide';
import type { VillageState } from '@/lib/constants';
import { VillageSurvey } from './village-survey';

export function ClashTrackDashboard() {
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  const handleDataLoaded = (newState: VillageState) => {
    setVillageState(newState);
  };
  
  if (!villageState) {
    return <VillageSurvey onDataLoaded={handleDataLoaded} />;
  }

  return (
    <>
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
          <TabsTrigger value="home">Home Village</TabsTrigger>
          <TabsTrigger value="troops">Army Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-6">
          <VillageView base="home" villageState={villageState} />
        </TabsContent>
         <TabsContent value="troops" className="mt-6">
          <TroopGuide villageState={villageState} />
        </TabsContent>
      </Tabs>
    </>
  );
}
