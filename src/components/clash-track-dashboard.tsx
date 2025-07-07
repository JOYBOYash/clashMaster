"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VillageView } from '@/components/village-view';
import { TroopGuide } from '@/components/troop-guide';
import { VillageSurvey } from './village-survey';
import { useAuth } from "@/context/auth-context";
import { LoginPage } from "./login-page";
import { Loader2 } from "lucide-react";

export function ClashTrackDashboard() {
  const { user, loading, villageState, saveVillageState } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!villageState) {
    return <VillageSurvey onSurveyComplete={saveVillageState} />;
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
