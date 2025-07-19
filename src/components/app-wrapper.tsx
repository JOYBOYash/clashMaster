
"use client";

import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
<<<<<<< HEAD
  const isSignInPage = usePathname() === '/sign-in';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {user && <MainHeader />}
=======
  const pathname = usePathname();
  const isSignInPage = pathname === '/sign-in';

  // Show the header for any logged-in user, unless they are on the sign-in page.
  const showHeader = user && !isSignInPage;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
      <main className={cn(
        "flex-grow flex flex-col items-stretch",
        isSignInPage && 'items-center justify-center'
      )}>
        <div className={cn(
          "w-full h-full",
<<<<<<< HEAD
          // The landing page should be full-width, other pages can have a container
          !isSignInPage && user && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
=======
          // The landing page and sign-in page are full-width.
          // The dashboard gets a container.
          !isSignInPage && user && pathname === '/dashboard' && "container mx-auto px-4 sm:px-6 lg:px-8 py-8"
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
        )}>
            {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
