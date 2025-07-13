
"use client";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import type { VillageState } from "@/lib/constants";

interface AuthWrapperProps {
  children: (villageState: VillageState) => React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading, villageState } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    redirect('/sign-in');
  }

  if (user && !villageState) {
    redirect('/survey');
  }

  // At this point, user is logged in and has village state
  return <>{children(villageState!)}</>;
}
