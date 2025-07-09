"use client";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { AuthPage } from "./auth-page";
import { VillageSurvey } from './village-survey';
import type { VillageState } from "@/lib/constants";

interface AuthWrapperProps {
  children: (villageState: VillageState) => React.ReactNode;
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
  
  if (!user) {
    return <AuthPage />;
  }

  if (!villageState) {
    return <VillageSurvey onSurveyComplete={saveVillageState} />;
  }

  return <>{children(villageState)}</>;
}
