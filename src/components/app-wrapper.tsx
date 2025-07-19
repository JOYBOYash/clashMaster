
"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isSignInPage = pathname === '/sign-in';

  // Show the header for any logged-in user, unless they are on the sign-in page.
  const showHeader = user && !isSignInPage;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
      <main className={cn(
        "flex-grow flex flex-col items-stretch",
        isSignInPage && 'items-center justify-center'
      )}>
        <div className={cn(
          "w-full h-full",
          // The landing page and sign-in page are full-width.
          // The dashboard gets a container.
          !isSignInPage && user && pathname === '/dashboard' && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        )}>
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
