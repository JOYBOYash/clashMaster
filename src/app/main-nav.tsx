
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  // All navigation links removed as per the new simplified structure.
  const routes = [
     { href: '/survey', label: 'Take Survey' },
  ];

  if (routes.length === 0) {
    return null; // Return null to render nothing
  }

  return (
    <nav
      className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => {
        if (route.label === 'Take Survey') {
          return (
            <Button key={route.href} asChild variant="outline" size="sm">
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
