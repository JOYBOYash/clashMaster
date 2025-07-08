"use client";

import { Castle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function MainHeader() {
  const { villageState, clearVillageState } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Castle className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">
            Clash Master
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {villageState && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your saved village data from this browser and you will need to complete the survey again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearVillageState} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>
                    Yes, start over
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </header>
  );
}
