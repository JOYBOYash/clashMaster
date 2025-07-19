
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import { getPlayer } from '@/lib/coc-api';
import { useAuth } from '@/context/auth-context';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const formSchema = z.object({
  playerTag: z.string().min(4, { message: 'Player tag is required.' }).refine(val => val.startsWith('#'), { message: 'Player tag must start with #' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    try {
      const result = await getPlayer(data.playerTag);
      
      // Save to session storage for immediate use
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('playerData', JSON.stringify(result));
      }
      
      // If user is logged in, save to Firestore
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await setDoc(userDocRef, { 
            playerTag: data.playerTag,
            playerData: result 
          }, { merge: true });
          toast({ title: 'Player Found & Saved!', description: `Successfully synced data for ${result.name} to your profile.` });
        } catch (dbError) {
          console.error("Firestore write error:", dbError);
          toast({
            variant: 'destructive',
            title: 'Could Not Save Data',
            description: 'Player data was found but could not be saved to your profile.',
          });
        }
      } else {
        toast({ title: 'Player Found!', description: `Successfully fetched data for ${result.name}.` });
      }

      router.push('/dashboard');

    } catch (error: any) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('playerData');
      }
      toast({
        variant: 'destructive',
        title: 'Error Fetching Player',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Find Your Village</CardTitle>
          <CardDescription>Enter your Clash of Clans player tag to sync your progress. Make sure your current IP address is whitelisted in your developer account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="playerTag">Player Tag</Label>
              <Input id="playerTag" placeholder="#2PP" {...register('playerTag')} />
              {errors.playerTag && <p className="text-xs text-destructive">{errors.playerTag.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Find Player
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
