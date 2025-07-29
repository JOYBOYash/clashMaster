
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
import { Moon, Sun, Trash2, RefreshCcw, Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [playerJson, setPlayerJson] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('villageExportData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPlayerJson(JSON.stringify(parsedData, null, 2));
      } catch {
        // If it's not valid JSON, just show the raw string
        setPlayerJson(storedData);
      }
    }
  }, []);

  const handleClearLocalData = () => {
    localStorage.removeItem('villageExportData');
    setPlayerJson('');
    toast({
      title: 'Local Village Data Cleared',
      description: 'Your manual village export data has been cleared.',
    });
  };

  const handleSavePlayerData = () => {
    try {
      // Validate that the input is valid JSON
      const parsedData = JSON.parse(playerJson);
      if (!parsedData.tag || !parsedData.buildings) {
          throw new Error("JSON is missing required 'tag' or 'buildings' properties.");
      }
      localStorage.setItem('villageExportData', playerJson);
      toast({
        title: 'Village Data Saved',
        description: 'Your village export data has been saved locally.',
      });
      router.push('/upgrades');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Invalid JSON',
        description: error.message || 'The data you entered is not valid JSON. Please correct it and try again.',
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be signed in to delete your account.' });
      return;
    }
    setIsDeleting(true);
    try {
      await deleteUserData(user.uid);
      toast({
        title: 'Account Data Deleted',
        description: 'All your stored data has been successfully deleted.',
      });
      await signOut(); // Sign out after deleting data
      router.push('/');
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
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your application and account settings.</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Village Data Management</CardTitle>
          <CardDescription>
            Manually manage your village data using the game's JSON export. This data is used by the Upgrades page. 
            Alternatively, you can fetch live data from the <Button variant="link" className="p-0 h-auto" asChild><Link href="/survey">Survey</Link></Button> page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="player-json">Village Export JSON</Label>
                <Textarea 
                    id="player-json"
                    value={playerJson}
                    onChange={(e) => setPlayerJson(e.target.value)}
                    rows={10}
                    placeholder='Paste your village export JSON here. You can get this from the in-game settings under "More Settings" -> "Export Village".'
                />
            </div>
            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handleClearLocalData}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Clear Data
                </Button>
                 <Button onClick={handleSavePlayerData}>
                    <Save className="mr-2 h-4 w-4" />
                    Save and Analyze
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>This action is permanent and cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div className="space-y-0.5">
                    <Label className="text-base text-destructive">Delete Account Data</Label>
                    <p className="text-sm text-muted-foreground">
                        Permanently delete all your saved armies and strategies from our servers.
                    </p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action is irreversible. All of your saved army compositions and AI strategies will be permanently deleted. Your user authentication will remain, but all associated data will be gone.
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
