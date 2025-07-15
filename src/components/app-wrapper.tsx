
"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";
import { cn } from "@/lib/utils";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const isSignInPage = usePathname() === '/sign-in';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <MainHeader />
      <main className={cn(
        "flex-grow flex flex-col items-stretch",
        isSignInPage && 'items-center justify-center'
      )}>
        <div className={cn(
          "w-full h-full",
          !isSignInPage && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
