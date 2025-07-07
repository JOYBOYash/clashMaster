"use client";

import { useState } from 'react';
import { gameData } from '@/lib/game-data';
import { type VillageState, type Building, type Troop, buildingNameToType, type Hero } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dna, Gem, Swords, Shield, Coins, Library, Home, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(0);

  const thData = townHallLevel ? gameData.clash_of_clans_data.town_halls[`TH${townHallLevel}` as keyof typeof gameData.clash_of_clans_data.town_halls] : null;

  const handleLevelChange = (key: string, value: string, maxLevel: number) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxLevel) {
      setLevels(prev => ({ ...prev, [key]: numericValue }));
    } else if (value === '') {
      setLevels(prev => ({ ...prev, [key]: 0 }));
    }
  };

  const renderBuildingInputs = (buildingKey: string) => {
    if (!thData) return null;
    const buildingInfo = (thData.buildings as any)[buildingKey] as { count: number, max_level: number } | undefined;
    if (!buildingInfo) return null;

    return (
      <div key={buildingKey} className="space-y-4">
        <h4 className="font-semibold text-foreground text-lg">{snakeToTitleCase(buildingKey)}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: buildingInfo.count }).map((_, i) => {
            const inputKey = `${buildingKey}-${i}`;
            return (
              <div key={inputKey} className="space-y-1.5">
                <Label htmlFor={inputKey} className="text-xs text-muted-foreground">#{i + 1}</Label>
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
        <div key={buildingKey} className="flex items-center justify-between p-2 rounded-md">
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

  const renderTroopLikeInputs = (items: Record<string, { max_level: number }>, type: 'troop' | 'hero' | 'spell') => {
    if (!items || Object.keys(items).length === 0) return <p className="text-sm text-muted-foreground p-2">None available at this Town Hall level.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(items).map(([key, itemInfo]) => {
                const inputKey = `${type}-${key}`;
                return(
                    <div key={inputKey} className="flex items-center justify-between p-1.5 rounded-md">
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
  };

  const surveySteps = [
    {
      id: 'townHall',
      title: 'Town Hall Level',
      description: "Start by selecting your Town Hall level.",
      icon: Home,
      content: () => (
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
      )
    },
    {
      id: 'keyBuildings',
      title: 'Key Buildings',
      description: "Enter the levels for your main buildings.",
      icon: Library,
      content: () => <div className="space-y-2">{keyBuildings.map(renderSingleBuildingInput)}</div>
    },
    {
      id: 'army',
      title: 'Army Camps',
      description: 'Enter the levels for each of your Army Camps.',
      icon: Swords,
      content: () => <div className="space-y-6">{armyBuildings.map(renderBuildingInputs)}</div>
    },
    {
      id: 'defenses',
      title: 'Defenses',
      description: 'Enter the levels for each of your defensive buildings.',
      icon: Shield,
      content: () => <div className="space-y-6">{defensiveBuildings.map(renderBuildingInputs)}</div>
    },
    {
      id: 'resources',
      title: 'Resource Buildings',
      description: 'Enter the levels for your storages and collectors.',
      icon: Coins,
      content: () => <div className="space-y-6">{resourceBuildings.map(renderBuildingInputs)}</div>
    },
    {
      id: 'troops',
      title: 'Troops & Spells',
      description: 'Enter the levels for all your troops and spells.',
      icon: Dna,
      content: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-2">Troops</h3>
                {renderTroopLikeInputs(thData?.army.troops || {}, 'troop')}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2">Spells</h3>
                {renderTroopLikeInputs(thData?.spells.spells || {}, 'spell')}
            </div>
        </div>
      )
    },
    {
      id: 'heroes',
      title: 'Heroes',
      description: "Finally, enter your hero levels.",
      icon: Gem,
      content: () => renderTroopLikeInputs(thData?.heroes || {}, 'hero')
    },
  ];

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, surveySteps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    if (!townHallLevel) return;

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: Hero[] = [];
    
    // Process buildings
    Object.entries(thData?.buildings || {}).forEach(([key, value]) => {
      if (typeof value !== 'object' || !('count' in value) || key === 'total_buildings') return;
      
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

    const processUnit = (unitData: any, type: 'troop' | 'spell' | 'hero') => {
      Object.entries(unitData || {}).forEach(([key, value]) => {
          const unitInfo = value as { max_level: number };
          const unitName = snakeToTitleCase(key);
          const inputKey = `${type}-${key}`;
          const level = levels[inputKey] || 0;
          
          if (type === 'hero') {
            heroes.push({ id: inputKey, name: unitName, level, maxLevel: unitInfo.max_level, village: 'home' });
          } else {
            troops.push({
                id: inputKey,
                name: unitName,
                level,
                maxLevel: unitInfo.max_level,
                village: 'home',
                elixirType: key.includes('dark_') ? 'dark' : 'regular'
            });
          }
      });
    }

    processUnit(thData?.army.troops, 'troop');
    processUnit(thData?.spells.spells, 'spell');
    processUnit(thData?.heroes, 'hero');

    const villageState: VillageState = {
      townHallLevel,
      builderHallLevel: 1, // Focusing on home village
      buildings,
      troops,
      heroes,
      pets: [],
      equipment: [],
    };
    onDataLoaded(villageState);
  };

  const currentSurveyStep = surveySteps[currentStep];
  const Icon = currentSurveyStep.icon;

  return (
    <Card className="max-w-3xl mx-auto mt-8 w-full">
      <CardHeader>
        <div className="w-full space-y-2 mb-4">
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {surveySteps.length}</span>
                <span>{currentSurveyStep.title}</span>
            </div>
            <Progress value={((currentStep + 1) / surveySteps.length) * 100} />
        </div>
        <div className='flex items-center gap-4'>
             <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                <Icon className="w-7 h-7 text-primary" />
            </div>
            <div>
                <CardTitle className="font-headline text-3xl">{currentSurveyStep.title}</CardTitle>
                <CardDescription>{currentSurveyStep.description}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[250px]">
        {(!townHallLevel && currentStep > 0) ? (
            <div className='text-center text-muted-foreground pt-12'>Please select your Town Hall level first.</div>
        ) : currentSurveyStep.content()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ChevronLeft /> Back
        </Button>
        {currentStep < surveySteps.length - 1 ? (
          <Button onClick={handleNext} disabled={!townHallLevel}>
            Next <ChevronRight />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!townHallLevel} className="bg-green-600 hover:bg-green-700">
            Generate My Dashboard
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

    