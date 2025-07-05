
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { VillageState } from '@/lib/constants';

interface PlayerTagFormProps {
  onDataFetched: (data: VillageState) => void;
}

const FormSchema = z.object({
  playerTag: z.string().trim().startsWith('#', { message: 'Player Tag must start with #' }).min(4, 'Player Tag is too short.'),
});

export function PlayerTagForm({ onDataFetched }: PlayerTagFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { playerTag: '' },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    setError(null);
    
    // Lazy load the server action
    const { fetchAndProcessVillageData } = await import('@/app/actions');
    const result = await fetchAndProcessVillageData(values.playerTag);

    if (result.success && result.data) {
      onDataFetched(result.data);
    } else {
      setError(result.error || 'An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-headline">Load Your Village</CardTitle>
        <CardDescription>
          Enter your Clash of Clans Player Tag to load your village data automatically.
          You can find your tag in your in-game profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {error && (
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
      </CardContent>
    </Card>
  );
}
