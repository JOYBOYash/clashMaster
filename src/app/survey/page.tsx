
'use client';

import { useState } from 'react';
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

const formSchema = z.object({
  playerTag: z.string().min(4, { message: 'Player tag is required.' }).refine(val => val.startsWith('#'), { message: 'Player tag must start with #' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SurveyPage() {
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<any | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setPlayerData(null);
    try {
      const result = await getPlayer(data.playerTag);
      setPlayerData(result);
      toast({ title: 'Player Found!', description: `Successfully fetched data for ${result.name}.` });
    } catch (error: any) {
      setPlayerData(null); // Clear data on error
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
          <CardDescription>Enter your Clash of Clans player tag to sync your progress. Your server IP must be whitelisted in your developer account.</CardDescription>
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

      {playerData && (
        <Card className="w-full max-w-md mt-8">
            <CardHeader>
                <CardTitle>{playerData.name}</CardTitle>
                <CardDescription>Town Hall {playerData.townHallLevel} &bull; Level {playerData.expLevel}</CardDescription>
            </CardHeader>
            <CardContent>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
                    {JSON.stringify(playerData, null, 2)}
                </pre>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
