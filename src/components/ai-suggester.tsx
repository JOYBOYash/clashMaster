"use client";

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestUpgrades, SuggestUpgradesInput, SuggestUpgradesOutput } from '@/ai/flows/suggest-upgrades';
import type { VillageState } from '@/lib/constants';

interface AiSuggesterProps {
  villageState: VillageState;
}

export function AiSuggester({ villageState }: AiSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestUpgrades = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const input: SuggestUpgradesInput = {
        townHallLevel: villageState.townHallLevel,
        builderHallLevel: villageState.builderHallLevel,
        availableResources: villageState.resources,
        buildingsUnderUpgrade: villageState.buildings
          .filter(b => b.isUpgrading)
          .map(b => b.name),
        allBuildings: villageState.buildings.map(b => ({
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
        title: 'Error',
        description: 'Could not fetch upgrade suggestions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          AI Upgrade Advisor
        </CardTitle>
        <CardDescription>
          Get intelligent upgrade recommendations based on your current village progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSuggestUpgrades} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Suggest Upgrades'
          )}
        </Button>

        {suggestions && suggestions.suggestedUpgrades.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg font-headline">Top Recommendations:</h3>
            <ul className="list-disc pl-5 space-y-2 text-foreground/90">
              {suggestions.suggestedUpgrades.map((s, index) => (
                <li key={index}>
                  <strong className="text-primary">{s.buildingName}:</strong> {s.reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {suggestions && suggestions.suggestedUpgrades.length === 0 && (
            <p className="mt-6 text-muted-foreground">No suggestions available at the moment. Your builders might be busy!</p>
        )}
      </CardContent>
    </Card>
  );
}
