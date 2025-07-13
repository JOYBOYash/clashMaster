
"use client";

import { useState, useEffect } from 'react';
import { Lightbulb, Loader2, Shield, Sword, Coins, Building, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { suggestUpgrades, SuggestUpgradesInput, SuggestUpgradesOutput } from '@/ai/flows/suggest-upgrades';
import type { VillageState, Building as BuildingType } from '@/lib/constants';
import { Skeleton } from './ui/skeleton';
import Image, { type StaticImageData } from 'next/image';
import { heroAvatarAssets } from '@/lib/image-paths';

interface AiSuggesterProps {
  villageState: VillageState;
  base: 'home' | 'builder';
}

const iconMap: Record<string, React.ElementType> = {
  defensive: Shield,
  army: Sword,
  resource: Coins,
  other: Building,
  hero: Heart,
  default: Lightbulb
};


export function AiSuggester({ villageState, base }: AiSuggesterProps) {
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<StaticImageData | null>(null);

  useEffect(() => {
      // This will only run on the client, preventing hydration mismatch
      setAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  }, []);

  const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);
  
  const getSuggestionType = (name: string): string => {
    if (villageState.buildings.find(b => b.name === name)) return villageState.buildings.find(b => b.name === name)!.type;
    if (villageState.heroes.find(h => h.name === name)) return 'hero';
    if (villageState.pets.find(p => p.name === name)) return 'hero'; // Represent pets with heart icon for simplicity
    if (villageState.equipment.find(e => e.name === name)) return 'army'; // Represent equipment with sword icon
    return 'default';
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
          buildingsUnderUpgrade: buildingsForBase
            .filter(b => b.isUpgrading)
            .map(b => b.name),
          allBuildings: buildingsForBase.map(b => ({
            name: b.name,
            level: b.level,
            maxLevel: b.maxLevel,
            type: b.type,
          })),
          allHeroes: base === 'home' ? villageState.heroes.map(h => ({ name: h.name, level: h.level })) : [],
          allPets: base === 'home' ? villageState.pets.map(p => ({ name: p.name, level: p.level })) : [],
          allEquipment: base === 'home' ? villageState.equipment.map(e => ({ name: e.name, level: e.level })) : [],
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villageState, base]);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-4 p-4 rounded-lg border bg-background/50">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/20">
      <CardHeader className="flex flex-row items-center gap-4">
        {avatar && <Image src={avatar} alt="Hero Avatar" width={80} height={80} className="rounded-full border-4 border-primary/50" />}
        <div className='flex-1'>
          <CardTitle className="flex items-center font-headline text-2xl">
            <Lightbulb className="mr-3 h-8 w-8 text-accent" />
            AI Upgrade Advisor
          </CardTitle>
          <CardDescription>
            Your top 3 personalized recommendations for the {base === 'home' ? 'Home Village' : 'Builder Base'}.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && renderSkeleton()}

        {!isLoading && suggestions && suggestions.suggestedUpgrades.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestions.suggestedUpgrades.map((s, index) => {
              const suggestionType = getSuggestionType(s.buildingName);
              const Icon = iconMap[suggestionType] || iconMap['default'];
              return (
                 <div key={index} className="flex flex-col gap-4 p-4 rounded-xl border bg-card/80 hover:bg-muted/50 transition-colors hover:shadow-lg hover:-translate-y-1">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-card-foreground font-headline tracking-wide">{s.buildingName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.reason}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!isLoading && (!suggestions || suggestions.suggestedUpgrades.length === 0) && (
          <div className="text-center py-8">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No suggestions available right now.</p>
            <p className="text-sm text-muted-foreground/80">Your builders might be busy or you're already a maxed-out legend!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
