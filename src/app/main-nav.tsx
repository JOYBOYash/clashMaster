
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

<<<<<<< HEAD
  // All navigation links removed as per the new simplified structure.
  const routes = [
     { href: '/survey', label: 'Take Survey' },
  ];

  if (routes.length === 0) {
    return null; // Return null to render nothing
  }

=======
  const routes = [
     { href: '/dashboard', label: 'Dashboard' },
     // The survey is now part of the initial user flow, not a main navigation item.
     // { href: '/survey', label: 'Find Player' },
  ];

>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
  return (
    <nav
      className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)}
      {...props}
    >
<<<<<<< HEAD
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
=======
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
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
    </nav>
  );
}
