
"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { TroopGuide } from '@/components/troop-guide';
import type { VillageState } from '@/lib/constants';
import { JsonImporter } from './json-importer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ClashTrackDashboard() {
  const [villageState, setVillageState] = useState<VillageState | null>(null);

  const handleDataLoaded = (newState: VillageState) => {
    setVillageState(newState);
  };
  
  const handleReset = () => {
    setVillageState(null);
  };
  
  if (!villageState) {
    return <JsonImporter onDataLoaded={handleDataLoaded} />;
  }

  return (
    <>
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto">
          <TabsTrigger value="home">Home Village</TabsTrigger>
          <TabsTrigger value="builder">Builder Base</TabsTrigger>
          <TabsTrigger value="troops">Army Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="mt-6">
          <VillageView base="home" villageState={villageState} />
        </TabsContent>
        <TabsContent value="builder" className="mt-6">
          <VillageView base="builder" villageState={villageState} />
        </TabsContent>
         <TabsContent value="troops" className="mt-6">
          <TroopGuide villageState={villageState} />
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-lg mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Load New Data</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline" onClick={handleReset} className="w-full">
                    Import a different Village JSON
                </Button>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
