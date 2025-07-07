"use client";

import { useState } from 'react';
import { gameData } from '@/lib/game-data';
import { type VillageState, type Building, type Troop, buildingNameToType } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Dna, Gem, Swords, Shield, Coins, Beaker, Library } from 'lucide-react';
import { titleCase } from '@/lib/utils';

interface VillageSurveyProps {
  onDataLoaded: (data: VillageState) => void;
}

const snakeToTitleCase = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const keyBuildings = ['laboratory', 'barracks', 'dark_barracks', 'spell_factory', 'dark_spell_factory', 'clan_castle', 'workshop', 'pet_house', 'blacksmith'];
const armyBuildings = ['army_camp'];
const resourceBuildings = ['gold_storage', 'elixir_storage', 'dark_elixir_storage', 'gold_mine', 'elixir_collector', 'dark_elixir_drill'];
const defensiveBuildings = [
  'cannon', 'archer_tower', 'mortar', 'air_defense', 'wizard_tower', 'air_sweeper',
  'hidden_tesla', 'bomb_tower', 'x_bow', 'inferno_tower', 'eagle_artillery',
  'scattershot', 'spell_tower', 'monolith'
];

const categoryIcons: Record<string, React.ElementType> = {
  key: Library,
  army: Swords,
  defenses: Shield,
  resources: Coins,
  troops: Dna,
  heroes: Gem,
};

export function VillageSurvey({ onDataLoaded }: VillageSurveyProps) {
  const [townHallLevel, setTownHallLevel] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});

  const handleLevelChange = (key: string, value: string, maxLevel: number) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxLevel) {
      setLevels(prev => ({ ...prev, [key]: numericValue }));
    } else if (value === '') {
      setLevels(prev => ({ ...prev, [key]: 0 }));
    }
  };

  const handleSubmit = () => {
    if (!townHallLevel) return;

    const thData = gameData.clash_of_clans_data.town_halls[`TH${townHallLevel}` as keyof typeof gameData.clash_of_clans_data.town_halls];
    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: any[] = [];
    const pets: any[] = [];
    const equipment: any[] = [];
    
    // Process buildings
    Object.entries(thData.buildings).forEach(([key, value]) => {
      if (typeof value !== 'object' || !('count' in value)) return;
      
      const buildingInfo = value as { count: number; max_level: number };
      const buildingName = snakeToTitleCase(key);

      for (let i = 0; i < buildingInfo.count; i++) {
        const inputKey = `${key}-${i}`;
        const level = levels[inputKey] || 1;
        
        buildings.push({
          id: inputKey,
          name: buildingName,
          level: level,
          maxLevel: buildingInfo.max_level,
          type: buildingNameToType[buildingName] || 'other',
          base: 'home',
          isUpgrading: false,
        });
      }
    });

    // Process Troops & Spells
    Object.entries(thData.army.troops).forEach(([key, value]) => {
        const troopInfo = value as { max_level: number };
        const troopName = snakeToTitleCase(key);
        const inputKey = `troop-${key}`;
        
        troops.push({
            id: inputKey,
            name: troopName,
            level: levels[inputKey] || 0,
            maxLevel: troopInfo.max_level,
            village: 'home',
            elixirType: 'regular' // This is a simplification, would need better mapping
        });
    });

     Object.entries(thData.spells.spells || {}).forEach(([key, value]) => {
        const spellInfo = value as { max_level: number };
        const spellName = snakeToTitleCase(key);
        const inputKey = `troop-${key}`; // Treat spells as troops for simplicity in form
        
        troops.push({
            id: inputKey,
            name: spellName,
            level: levels[inputKey] || 0,
            maxLevel: spellInfo.max_level,
            village: 'home',
            elixirType: 'regular' // This is a simplification
        });
    });


    // Process Heroes
     Object.entries(thData.heroes).forEach(([key, value]) => {
        const heroInfo = value as { max_level: number };
        const heroName = snakeToTitleCase(key);
        const inputKey = `hero-${key}`;

        heroes.push({
            id: inputKey,
            name: heroName,
            level: levels[inputKey] || 0,
            maxLevel: heroInfo.max_level,
            village: 'home'
        });
     });


    const villageState: VillageState = {
      townHallLevel,
      builderHallLevel: 1, // Focusing on home village
      buildings,
      troops,
      heroes,
      pets,
      equipment,
    };
    onDataLoaded(villageState);
  };
  
  const thData = townHallLevel ? gameData.clash_of_clans_data.town_halls[`TH${townHallLevel}` as keyof typeof gameData.clash_of_clans_data.town_halls] : null;

  const renderBuildingInputs = (buildingKey: string) => {
    if (!thData) return null;
    const buildingInfo = (thData.buildings as any)[buildingKey] as { count: number, max_level: number } | undefined;
    if (!buildingInfo) return null;

    return (
      <div key={buildingKey} className="space-y-3 p-1">
        <h4 className="font-semibold text-foreground">{snakeToTitleCase(buildingKey)}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: buildingInfo.count }).map((_, i) => {
            const inputKey = `${buildingKey}-${i}`;
            return (
              <div key={inputKey} className="space-y-1.5">
                <Label htmlFor={inputKey} className="text-xs text-muted-foreground">{snakeToTitleCase(buildingKey)} #{i + 1}</Label>
                <Input
                  id={inputKey}
                  type="number"
                  min="0"
                  max={buildingInfo.max_level}
                  value={levels[inputKey] || ''}
                  onChange={(e) => handleLevelChange(inputKey, e.target.value, buildingInfo.max_level)}
                  placeholder="Level"
                  className="w-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderSingleBuildingInput = (buildingKey: string) => {
     if (!thData) return null;
     const buildingInfo = (thData.buildings as any)[buildingKey] as { count: number, max_level: number } | undefined;
     if (!buildingInfo || buildingInfo.count === 0) return null;
     
     const inputKey = `${buildingKey}-0`;

     return(
        <div key={buildingKey} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
            <Label htmlFor={inputKey} className="text-base">{snakeToTitleCase(buildingKey)}</Label>
            <Input
              id={inputKey}
              type="number"
              min="0"
              max={buildingInfo.max_level}
              value={levels[inputKey] || ''}
              onChange={(e) => handleLevelChange(inputKey, e.target.value, buildingInfo.max_level)}
              placeholder="Lvl"
              className="w-24"
            />
        </div>
     )
  };

  const renderTroopLikeInputs = (items: Record<string, { max_level: number }>, type: 'troop' | 'hero') => {
    if (Object.keys(items).length === 0) return <p className="text-sm text-muted-foreground p-2">None available at this Town Hall level.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(items).map(([key, itemInfo]) => {
                const inputKey = `${type}-${key}`;
                return(
                    <div key={inputKey} className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted/50">
                        <Label htmlFor={inputKey} className="text-base">{snakeToTitleCase(key)}</Label>
                        <Input
                          id={inputKey}
                          type="number"
                          min="0"
                          max={itemInfo.max_level}
                          value={levels[inputKey] || ''}
                          onChange={(e) => handleLevelChange(inputKey, e.target.value, itemInfo.max_level)}
                          placeholder="Lvl"
                          className="w-24"
                        />
                    </div>
                )
            })}
        </div>
    )
  }
  
  const renderAccordionCategory = (title: string, buildingKeys: string[]) => {
    if (!thData) return null;
    const availableBuildings = buildingKeys.filter(key => (thData.buildings as any)[key]);
    if (availableBuildings.length === 0) return null;
    
    const Icon = categoryIcons[title.toLowerCase()] || Beaker;

    return (
        <AccordionItem value={title}>
            <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className='text-xl font-headline tracking-wide'>{title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
                {availableBuildings.map(renderBuildingInputs)}
            </AccordionContent>
        </AccordionItem>
    );
  };
  
  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Create Your Village Profile</CardTitle>
        <CardDescription>Start by selecting your Town Hall level to configure your village buildings and troops.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-lg font-semibold">Town Hall Level</Label>
          <Select onValueChange={(value) => setTownHallLevel(parseInt(value, 10))}>
            <SelectTrigger className="w-full mt-2 text-base py-6">
              <SelectValue placeholder="Select your Town Hall level..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 17 }, (_, i) => i + 1).map(level => (
                <SelectItem key={level} value={String(level)}>Town Hall {level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {thData && (
          <Accordion type="multiple" className="w-full space-y-2">
            <AccordionItem value="key-buildings">
              <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
                 <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Library className="w-5 h-5 text-primary" />
                    </div>
                    <span className='text-xl font-headline tracking-wide'>Key Buildings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-2">
                {keyBuildings.map(renderSingleBuildingInput)}
              </AccordionContent>
            </AccordionItem>
            
            {renderAccordionCategory("Army", armyBuildings)}
            {renderAccordionCategory("Defenses", defensiveBuildings)}
            {renderAccordionCategory("Resources", resourceBuildings)}
            
            <AccordionItem value="troops">
              <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
                 <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Dna className="w-5 h-5 text-primary" />
                    </div>
                    <span className='text-xl font-headline tracking-wide'>Troops & Spells</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-2">
                {renderTroopLikeInputs({...thData.army.troops, ...thData.spells.spells}, 'troop')}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="heroes">
              <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
                 <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Gem className="w-5 h-5 text-primary" />
                    </div>
                    <span className='text-xl font-headline tracking-wide'>Heroes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-2">
                {renderTroopLikeInputs(thData.heroes, 'hero')}
              </AccordionContent>
            </AccordionItem>


          </Accordion>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!townHallLevel} className="w-full text-lg py-6">
          Generate My Village Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}