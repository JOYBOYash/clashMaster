
"use client";

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Shield, Sword, Coins, SlidersHorizontal, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestUpgrades, SuggestUpgradesInput, SuggestUpgradesOutput } from '@/ai/flows/suggest-upgrades';
import type { VillageState, Building as BuildingType } from '@/lib/constants';
import { Skeleton } from './ui/skeleton';

interface AiSuggesterProps {
  villageState: VillageState;
  base: 'home' | 'builder';
}

const iconMap: Record<BuildingType['type'], React.ElementType> = {
  defensive: Shield,
  army: Sword,
  resource: Coins,
  other: Building,
  offensive: Sword, // Fallback for offensive type
};

export function AiSuggester({ villageState, base }: AiSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

  const getBuildingType = (name: string): BuildingType['type'] => {
    const building = buildingsForBase.find(b => b.name === name);
    return building?.type || 'other';
  };

  useEffect(() => {
    const handleSuggestUpgrades = async () => {
      if (!villageState) return;
      setIsLoading(true);
      setSuggestions(null);
      try {
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
        setSuggestions({ suggestedUpgrades: [] });
      } finally {
        setIsLoading(false);
      }
    };

    handleSuggestUpgrades();
  }, [villageState.townHallLevel, villageState.builderHallLevel, villageState.resources, base, toast]);

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-3 rounded-lg border bg-background/50">
          <Skeleton className="w-10 h-10 rounded-md" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <Lightbulb className="mr-2 h-6 w-6 text-accent" />
          AI Upgrade Advisor
        </CardTitle>
        <CardDescription>
          Top 3 personalized recommendations for your {base === 'home' ? 'Home Village' : 'Builder Base'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && renderSkeleton()}

        {!isLoading && suggestions && suggestions.suggestedUpgrades.length > 0 && (
          <div className="space-y-4">
            {suggestions.suggestedUpgrades.map((s, index) => {
              const buildingType = getBuildingType(s.buildingName);
              const Icon = iconMap[buildingType] || Building;
              return (
                 <div key={index} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="p-2 bg-primary/10 rounded-md mt-1">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-card-foreground">{s.buildingName}</p>
                    <p className="text-sm text-muted-foreground">{s.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!isLoading && (!suggestions || suggestions.suggestedUpgrades.length === 0) && (
          <p className="text-sm text-muted-foreground text-center py-4">No suggestions available. Your builders might be busy or you're already a maxed-out legend!</p>
        )}
      </CardContent>
    </Card>
  );
}
