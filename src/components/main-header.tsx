
"use client";

import Link from "next/link";
import { CircleUser, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import { MainNav } from '../app/main-nav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { appLogoPath } from "@/lib/image-paths";

export function MainHeader() {
  const { user, signOut } = useAuth();
  const homeHref = user ? '/' : '/'; // Always go to landing page

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={homeHref} className="mr-8 flex items-center">
          <Image src={appLogoPath} alt="ProBuilder Logo" width={32} height={32} unoptimized />
          <span className="sr-only">ProBuilder Home</span>
        </Link>
        
        {user && <MainNav />}
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal font-headline">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground font-body">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer font-headline">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
                <Link href="/sign-in">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
