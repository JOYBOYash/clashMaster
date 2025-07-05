
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { AccountSettings } from '@/components/account-settings';
import { type VillageState } from '@/lib/constants';
import { PlayerTagForm } from './player-tag-form';

const LOCAL_STORAGE_KEY = 'clashTrackVillageState';

export function ClashTrackDashboard() {
  const [villageState, setVillageState] = useState<VillageState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load state from localStorage on initial render
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        setVillageState(JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const handleDataFetched = (newState: VillageState) => {
    setVillageState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };
  
  const handleUpdate = (newState: VillageState) => {
    setVillageState(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  };
  
  const handleReset = () => {
    setVillageState(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };
  
  if (!isLoaded) {
    return null; // or a loading spinner
  }

  if (!villageState) {
    return <PlayerTagForm onDataFetched={handleDataFetched} />;
  }

  return (
    <>
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
          <AccountSettings villageState={villageState} onUpdate={handleUpdate} onReset={handleReset} />
        </TabsContent>
      </Tabs>
    </>
  );
}
