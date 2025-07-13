
"use client";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { VillageSurvey } from './village-survey';
import type { VillageState } from "@/lib/constants";
import { VillageView } from "./village-view";
import { redirect } from "next/navigation";

interface AuthWrapperProps {
  children: (villageState?: VillageState) => React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading, villageState, saveVillageState } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (user) {
    if (villageState) {
        redirect('/upgrades');
    }
    return <VillageSurvey onSurveyComplete={saveVillageState} />;
  }

  return <>{children()}</>;
}
