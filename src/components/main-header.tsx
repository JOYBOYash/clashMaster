
"use client";

import Link from "next/link";
import { CircleUser, LogOut, Menu } from 'lucide-react';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { appLogoPath } from "@/lib/image-paths";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function MainHeader() {
  const { user, signOut } = useAuth();
  const homeHref = '/';
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasPlayerData, setHasPlayerData] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('playerData');
    setHasPlayerData(!!data);
  }, [pathname]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader>
                   <Link href={homeHref} className="flex items-center space-x-2" onClick={handleLinkClick}>
                      <Image src={appLogoPath} alt="ProBuilder Logo" width={28} height={28} unoptimized />
                      <h1 className={cn("text-xl font-bold text-primary font-headline")}>
                        ProBuilder
                      </h1>
                    </Link>
                </SheetHeader>
               <div className="flex flex-col gap-4 py-4">
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>Dashboard</Link>
                  <Link href="/war-council" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>War Council</Link>
                  <Link href="/cookbook" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>Cookbook</Link>
                  {!hasPlayerData && (
                    <Link href="/survey" className="text-muted-foreground hover:text-foreground" onClick={handleLinkClick}>Survey</Link>
                  )}
               </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo and Nav */}
        <div className="hidden md:flex flex-1 items-center gap-6">
          <Link href={homeHref} className="flex items-center space-x-2">
            <Image src={appLogoPath} alt="ProBuilder Logo" width={32} height={32} unoptimized />
            <h1 className={cn("text-2xl font-bold text-primary font-headline")}>
              ProBuilder
            </h1>
          </Link>
          <div className="h-8 w-px bg-primary/30"></div>
          <MainNav />
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
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
       <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </header>
  );
}
