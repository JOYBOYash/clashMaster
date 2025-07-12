
"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import { MainHeader } from "./main-header";
import { Toaster } from "./ui/toaster";

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Don't show header on the root landing page
  const showHeader = !loading && user && pathname !== '/';

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {showHeader && <MainHeader />}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
