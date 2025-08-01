
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/upgrades', label: 'Upgrades' },
    { href: '/army-guide', label: 'Army Guide' },
    { href: '/explore', label: 'Explore' },
    { href: '/survey', label: 'Survey' },
  ];

  return (
    <nav
      className={cn("hidden items-center space-x-4 md:flex lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary font-headline",
            pathname.startsWith(route.href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
