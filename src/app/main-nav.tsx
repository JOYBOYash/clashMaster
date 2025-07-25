
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
     ...(!hasPlayerData ? [{ href: '/survey', label: 'Take Survey' }] : [])
  ];

  return (
    <nav
      className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => {
        if (route.label === 'Take Survey' || route.label === 'War Council') {
          return (
            <Button key={route.href} asChild variant="outline" size="sm" className={cn(pathname.startsWith(route.href) && "border-primary text-primary")}>
              <Link href={route.href}>
                {route.label}
              </Link>
            </Button>
          )
        }
        return (
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
        )
      })}
    </nav>
  );
}
