
"use client";

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestUpgrades, SuggestUpgradesInput, SuggestUpgradesOutput } from '@/ai/flows/suggest-upgrades';
import type { VillageState } from '@/lib/constants';
import { Skeleton } from './ui/skeleton';

interface AiSuggesterProps {
  villageState: VillageState;
  base: 'home' | 'builder';
}

export function AiSuggester({ villageState, base }: AiSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const handleSuggestUpgrades = async () => {
      if (!villageState) return;
      setIsLoading(true);
      setSuggestions(null);
      try {
        const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

        const input: SuggestUpgradesInput = {
          base: base,
          townHallLevel: villageState.townHallLevel,
          builderHallLevel: villageState.builderHallLevel,
          availableResources: villageState.resources,
          buildingsUnderUpgrade: buildingsForBase
            .filter(b => b.isUpgrading)
            .map(b => b.name),
          allBuildings: buildingsForBase.map(b => ({
            name: b.name,
            level: b.level,
            type: b.type,
            upgradeCost: b.upgradeCost || {},
            upgradeTime: b.upgradeTime || 0,
          })),
        };

        const result = await suggestUpgrades(input);
        setSuggestions(result);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        toast({
          variant: 'destructive',
          title: 'AI Advisor Error',
          description: 'Could not fetch upgrade suggestions. Please try again later.',
        });
        // Set an empty state on error to avoid infinite loading
        setSuggestions({ suggestedUpgrades: [] });
      } finally {
        setIsLoading(false);
      }
    };

    handleSuggestUpgrades();
  }, [villageState, base, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          AI Upgrade Advisor
        </CardTitle>
        <CardDescription>
          Top upgrade recommendations for your {base === 'home' ? 'Home Village' : 'Builder Base'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-4/5" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )}

        {!isLoading && suggestions && suggestions.suggestedUpgrades.length > 0 && (
          <ul className="space-y-3 text-foreground/90">
            {suggestions.suggestedUpgrades.map((s, index) => (
              <li key={index} className="text-sm">
                <strong className="text-primary font-semibold">{s.buildingName}:</strong>
                <p className="text-muted-foreground pl-1">{s.reason}</p>
              </li>
            ))}
          </ul>
        )}

        {!isLoading && (!suggestions || suggestions.suggestedUpgrades.length === 0) && (
          <p className="text-sm text-muted-foreground">No suggestions available at the moment. Your builders might be busy or you're already maxed out!</p>
        )}
      </CardContent>
    </Card>
  );
}
