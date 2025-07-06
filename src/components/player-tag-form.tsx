
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search, TestTube2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { VillageState } from '@/lib/constants';
import { DEMO_VILLAGE_STATE } from '@/lib/constants';

interface PlayerTagFormProps {
  onDataFetched: (data: VillageState) => void;
}

const FormSchema = z.object({
  playerTag: z.string().trim().startsWith('#', { message: 'Player Tag must start with #' }).min(4, 'Player Tag is too short.'),
});

export function PlayerTagForm({ onDataFetched }: PlayerTagFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiBlocked, setIsApiBlocked] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { playerTag: '#YQJ2GPUY' },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError(null);
    setIsApiBlocked(false);
    
    const { fetchAndProcessVillageData } = await import('@/app/actions');
    const result = await fetchAndProcessVillageData(values.playerTag);

    if (result.success && result.data) {
      onDataFetched(result.data);
    } else {
      if (result.errorCode === 'API_FORBIDDEN') {
        setIsApiBlocked(true);
      }
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };
  
  const handleLoadDemo = () => {
    onDataFetched(DEMO_VILLAGE_STATE);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-headline">{isApiBlocked ? 'API Connection Failed' : 'Load Your Village'}</CardTitle>
        {!isApiBlocked && (
          <CardDescription>
            Enter your Clash of Clans Player Tag to load your village data automatically.
            You can find your tag in your in-game profile.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isApiBlocked ? (
           <div className="space-y-4 text-center">
             <Alert variant="destructive">
                <AlertTitle>API Access Denied</AlertTitle>
                <AlertDescription>
                   We couldn't connect to the Clash of Clans API. This usually happens because of an IP whitelisting issue that can be tricky to solve in a cloud environment.
                </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">You can try again later, or explore the app's features with a sample village.</p>
            <Button onClick={handleLoadDemo} className="w-full">
                <TestTube2 className="mr-2" />
                Load Sample Village
            </Button>
           </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="playerTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="#2P8R28LQU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && !isApiBlocked && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Search className="mr-2" />
                )}
                Load Village
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
