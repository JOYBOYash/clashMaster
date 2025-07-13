
"use client";

import { useAuth } from "@/context/auth-context";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, villageState } = useAuth();
  
  // Show header only if user is logged in AND has completed the survey
  const showHeader = !loading && user && villageState;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="container w-full h-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
