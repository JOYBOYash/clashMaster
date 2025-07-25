
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [hasPlayerData, setHasPlayerData] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('playerData');
    setHasPlayerData(!!data);
  }, [pathname]); // Re-check when route changes

  const routes = [
     { href: '/dashboard', label: 'Dashboard' },
     { href: '/war-council', label: 'War Council' },
  ];

  if (!hasPlayerData) {
      routes.push({ href: '/survey', label: 'Survey' });
  }

  return (
    <nav
      className={cn("hidden md:flex items-center justify-center h-full", className)}
      {...props}
    >
      <ul className="flex items-center justify-center h-full gap-2">
        {routes.map((route) => {
          const isActive = pathname.startsWith(route.href);

          return (
             <li key={route.href} className="h-full flex items-center">
                <Link
                  href={route.href}
                  className={cn(
                    "relative h-full flex items-center justify-center px-4 text-sm font-bold tracking-wider uppercase transition-colors duration-300 ease-in-out text-primary/70 hover:text-primary",
                    isActive && "text-primary"
                  )}
                >
                  {route.label}
                   {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_theme(colors.primary)]"></span>
                  )}
                </Link>
             </li>
          );
        })}
      </ul>
    </nav>
  );
}
