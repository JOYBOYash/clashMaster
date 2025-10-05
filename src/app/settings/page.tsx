
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { deleteUserData } from '@/lib/firebase-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Moon, Sun, Trash2, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleDeleteAccount = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be signed in to delete your account.' });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserData(user.uid);
      // Also clear local data on account deletion
      localStorage.removeItem('playerData');
      localStorage.removeItem('villageExportData');
      localStorage.removeItem('maxTroopSpace');
      localStorage.removeItem('maxSpellSpace');
      localStorage.removeItem('clanTag');
      
      toast({
        title: 'Account Data Deleted',
        description: 'All your stored data has been successfully deleted.',
      });
      
      await signOut(); // This will redirect to home
      
    } catch (error) {
      console.error("Failed to delete user data:", error);
      toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not delete your account data.' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Settings</CardTitle>
          <CardDescription>Manage your application and account settings.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes.
              </p>
            </div>
            <div className="flex items-center gap-2">
                <Sun className="h-6 w-6"/>
                 <Switch
                    id="dark-mode"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    aria-label="Toggle dark mode"
                />
                <Moon className="h-6 w-6"/>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive text-xl sm:text-2xl">Danger Zone</CardTitle>
          <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4 gap-4">
                <div className="space-y-1.5 flex-grow">
                    <Label className="text-base text-destructive">Delete Account Data</Label>
                    <p className="text-sm text-muted-foreground pr-4">
                        Permanently delete all your saved armies, strategies, and local settings from our servers and your browser.
                    </p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto shrink-0">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible. All of your saved army compositions and AI strategies will be permanently deleted from our database. Your local player data and settings will also be cleared from this browser. Your authentication account will remain, but all associated application data will be gone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Yes, delete my data
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
