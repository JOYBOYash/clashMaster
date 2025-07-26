
"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { useEffect } from "react";
import { getPlayer } from "@/lib/coc-api";
import { UnitNotificationHub } from "./unit-notification-hub";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isSignInPage = pathname === '/sign-in';
  const isNotFoundPage = pathname === '/not-found'; // Next.js doesn't route to /not-found, but we can check if a page component indicates it's a 404. Let's make the logic simpler.
  
  // Pages that should NOT have the main header
  const noHeaderPages = ['/sign-in'];

  const showHeader = user && !noHeaderPages.includes(pathname);

  useEffect(() => {
    const refreshPlayerData = async () => {
      const storedData = localStorage.getItem('playerData');
      if (storedData) {
        try {
          const player = JSON.parse(storedData);
          if (player.tag) {
            console.log(`Refreshing data for ${player.tag}...`);
            const updatedPlayer = await getPlayer(player.tag);
            localStorage.setItem('playerData', JSON.stringify(updatedPlayer));
            console.log('Player data refreshed.');
          }
        } catch (error) {
          console.error("Failed to refresh player data:", error);
        }
      }
    };
    if (user) {
      refreshPlayerData();
    }
  }, [user]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
      <main className={cn(
        "flex-grow flex flex-col items-stretch",
        isSignInPage && 'items-center justify-center'
      )}>
        <div className={cn(
          "w-full h-full",
          // The landing page should be full-width, other pages can have a container
          !isSignInPage && user && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
            {children}
        </div>
      </main>
      <Toaster />
      <UnitNotificationHub />
    </div>
  );
}
