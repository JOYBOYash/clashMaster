
"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";
import { cn } from "@/lib/utils";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, villageState } = useAuth();
  const pathname = usePathname();
  
  const isSurveyPage = pathname === '/survey';
  // Show header only if user is logged in AND has completed the survey
  const showHeader = !loading && user && villageState;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
      <main className={cn(
        "flex-grow flex flex-col",
        isSurveyPage ? 'items-center justify-center' : 'items-stretch' // Use stretch to allow content to fill width
      )}>
        <div className={cn(
          "w-full h-full",
          !isSurveyPage && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
