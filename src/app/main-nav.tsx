
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
  ];

  return (
    <nav
      className={cn("hidden mx-4 md:flex items-center mx-4 justify-center h-full", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname.startsWith(route.href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
