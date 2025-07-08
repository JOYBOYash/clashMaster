
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { gameData } from '@/lib/game-data';
import { type VillageState, type Building, type Troop, buildingNameToType, type Hero } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from './ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dna, Gem, Swords, Shield, Coins, Library, Home, ChevronRight, ChevronLeft, Hammer, FlaskConical, Warehouse } from 'lucide-react';

interface VillageSurveyProps {
  onSurveyComplete: (data: VillageState) => void;
}

const snakeToTitleCase = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// Define categories for splitting the survey
const keyBuildings = ['laboratory', 'barracks', 'dark_barracks', 'spell_factory', 'dark_spell_factory', 'clan_castle', 'workshop', 'pet_house', 'blacksmith'];
const armyCamps = ['army_camp'];
const storageBuildings = ['gold_storage', 'elixir_storage', 'dark_elixir_storage'];
const collectorBuildings = ['gold_mine', 'elixir_collector', 'dark_elixir_drill'];
const defensiveBuildings = [
  'cannon', 'archer_tower', 'mortar', 'air_defense', 'wizard_tower', 'air_sweeper',
  'hidden_tesla', 'bomb_tower', 'x_bow', 'inferno_tower', 'eagle_artillery',
  'scattershot', 'spell_tower', 'monolith'
];
const regularTroops = ["barbarian", "archer", "giant", "goblin", "wall_breaker", "balloon", "wizard", "healer", "dragon", "pekka", "baby_dragon", "miner", "electro_titan", "root_rider"];
const darkTroops = ["minion", "hog_rider", "valkyrie", "golem", "witch", "lava_hound", "bowler", "ice_golem", "headhunter", "apprentice_warden"];
const regularSpells = ["lightning_spell", "healing_spell", "rage_spell", "jump_spell", "freeze_spell", "clone_spell", "invisibility_spell", "recall_spell"];
const darkSpells = ["poison_spell", "earthquake_spell", "haste_spell", "skeleton_spell", "bat_spell"];
const heroes = ['barbarian_king', 'archer_queen', 'grand_warden', 'royal_champion'];

const singleInstanceBuildings = [
    'laboratory', 'spell_factory', 'dark_spell_factory', 'clan_castle', 
    'workshop', 'pet_house', 'blacksmith', 'barracks', 'dark_barracks'
];


export function VillageSurvey({ onSurveyComplete }: VillageSurveyProps) {
  const [townHallLevel, setTownHallLevel] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isMaxAllChecked, setIsMaxAllChecked] = useState(false);

  const thData = townHallLevel ? gameData.clash_of_clans_data.town_halls[`TH${townHallLevel}` as keyof typeof gameData.clash_of_clans_data.town_halls] : null;

  const handleLevelChange = (key: string, value: string, maxLevel: number) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxLevel) {
      setLevels(prev => ({ ...prev, [key]: numericValue }));
    } else if (value === '') {
      setLevels(prev => ({ ...prev, [key]: 0 }));
    }
  };

  const setMaxLevel = (key: string, maxLevel: number) => {
    setLevels(prev => ({ ...prev, [key]: maxLevel }));
  };
  
  const surveySteps = [
    { id: 'townHall', title: 'Town Hall Level', icon: Home, content: () => (
        <Select onValueChange={(v) => {setTownHallLevel(parseInt(v)); setLevels({});}}>
          <SelectTrigger className="w-full mt-2 text-base py-6"><SelectValue placeholder="Select your Town Hall level..." /></SelectTrigger>
          <SelectContent>{Array.from({ length: 16 }, (_, i) => i + 1).map(l => <SelectItem key={l} value={String(l)}>Town Hall {l}</SelectItem>)}</SelectContent>
        </Select>
    )},
    { id: 'keyBuildings', title: 'Key Buildings', icon: Library, content: () => <div className="space-y-3">{keyBuildings.map(b => (thData?.buildings as any)[b] ? renderSingleItemInput(b, 'building', (thData.buildings as any)[b]) : null)}</div> },
    { id: 'armyCamps', title: 'Army Camps', icon: Swords, content: () => armyCamps.map(renderBuildingInputs) },
    { id: 'storages', title: 'Resource Storages', icon: Warehouse, content: () => storageBuildings.map(renderBuildingInputs) },
    { id: 'collectors', title: 'Resource Collectors', icon: Coins, content: () => collectorBuildings.map(renderBuildingInputs) },
    { id: 'defenses', title: 'Defenses', icon: Shield, content: () => <div className="space-y-6">{defensiveBuildings.map(renderBuildingInputs)}</div> },
    { id: 'regularTroops', title: 'Regular Troops', icon: Dna, content: () => renderItemGroup("Elixir Troops", regularTroops, 'troop')},
    { id: 'darkTroops', title: 'Dark Troops', icon: Dna, content: () => renderItemGroup("Dark Elixir Troops", darkTroops, 'troop')},
    { id: 'regularSpells', title: 'Regular Spells', icon: FlaskConical, content: () => renderItemGroup("Elixir Spells", regularSpells, 'spell')},
    { id: 'darkSpells', title: 'Dark Spells', icon: FlaskConical, content: () => renderItemGroup("Dark Elixir Spells", darkSpells, 'spell')},
    { id: 'heroes', title: 'Heroes', icon: Gem, content: () => renderItemGroup("Your Heroes", heroes, 'hero') },
  ];

  const handleMaxAllForStep = (checked: boolean | 'indeterminate') => {
    setIsMaxAllChecked(checked === true);

    if (checked !== true || !thData) {
      return;
    }

    const currentStepConfig = surveySteps[currentStep];
    const newLevelsUpdate: Record<string, number> = {};

    const buildingData = thData.buildings as Record<string, { count: number; max_level: number }>;
    const armyData = thData.army.troops as Record<string, { max_level: number }>;
    const spellData = thData.spells.spells as Record<string, { max_level: number }>;
    const heroData = thData.heroes as Record<string, { max_level: number }>;

    const processBuildingKeys = (keys: string[], isSingle: boolean) => {
      keys.forEach(key => {
        const info = buildingData[key];
        if (info) {
          if (isSingle) {
            newLevelsUpdate[`building-${key}`] = info.max_level;
          } else {
            for (let i = 0; i < info.count; i++) {
              newLevelsUpdate[`${key}-${i}`] = info.max_level;
            }
          }
        }
      });
    };
    
    const processItemKeys = (keys: string[], type: 'troop' | 'spell' | 'hero') => {
      const sourceMap = type === 'troop' ? armyData : type === 'spell' ? spellData : heroData;
      keys.forEach(key => {
        const info = (sourceMap as any)?.[key];
        if (info) {
          newLevelsUpdate[`${type}-${key}`] = info.max_level;
        }
      });
    };

    switch (currentStepConfig.id) {
      case 'keyBuildings': processBuildingKeys(keyBuildings, true); break;
      case 'armyCamps': processBuildingKeys(armyCamps, false); break;
      case 'storages': processBuildingKeys(storageBuildings, false); break;
      case 'collectors': processBuildingKeys(collectorBuildings, false); break;
      case 'defenses': processBuildingKeys(defensiveBuildings, false); break;
      case 'regularTroops': processItemKeys(regularTroops, 'troop'); break;
      case 'darkTroops': processItemKeys(darkTroops, 'troop'); break;
      case 'regularSpells': processItemKeys(regularSpells, 'spell'); break;
      case 'darkSpells': processItemKeys(darkSpells, 'spell'); break;
      case 'heroes': processItemKeys(heroes, 'hero'); break;
    }
    
    setLevels(prev => ({ ...prev, ...newLevelsUpdate }));
  };

  const renderBuildingInputs = (buildingKey: string) => {
    if (!thData) return null;
    
    let buildingInfo;
    if (singleInstanceBuildings.includes(buildingKey)) {
        const bKey = Object.keys(thData.buildings).find(k => k.startsWith(buildingKey));
        if (!bKey) return null;
        buildingInfo = (thData.buildings as any)[bKey] as { count: number, max_level: number };
        buildingInfo.count = 1; // Enforce single instance
    } else {
        buildingInfo = (thData.buildings as any)[buildingKey] as { count: number, max_level: number };
    }

    if (!buildingInfo) return null;

    return (
      <div key={buildingKey} className="space-y-4">
        <h4 className="font-semibold text-foreground text-lg">{snakeToTitleCase(buildingKey)}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: buildingInfo.count }).map((_, i) => {
            const inputKey = `${buildingKey}-${i}`;
            return (
              <div key={inputKey} className="space-y-2 p-3 border rounded-lg bg-background/50">
                <Label htmlFor={inputKey} className="text-sm font-semibold">#{i + 1}</Label>
                <div className="flex items-center gap-2">
                    <Input
                      id={inputKey}
                      type="number"
                      min="0"
                      max={buildingInfo.max_level}
                      value={levels[inputKey] ?? ''}
                      onChange={(e) => handleLevelChange(inputKey, e.target.value, buildingInfo.max_level)}
                      placeholder="Lvl"
                      className="w-full"
                    />
                    <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${inputKey}-max`}
                          onCheckedChange={(checked) => { if (checked) setMaxLevel(inputKey, buildingInfo.max_level) }}
                          checked={levels[inputKey] === buildingInfo.max_level}
                        />
                        <Label htmlFor={`${inputKey}-max`} className="text-xs">Max</Label>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderSingleItemInput = (itemKey: string, type: 'building' | 'troop' | 'spell' | 'hero', info: { max_level: number }) => {
     const inputKey = `${type}-${itemKey}`;
     return(
        <div key={inputKey} className="flex items-center justify-between p-2.5 rounded-lg border bg-background/50">
            <Label htmlFor={inputKey} className="text-base">{snakeToTitleCase(itemKey)}</Label>
            <div className="flex items-center gap-3">
                <Input
                  id={inputKey}
                  type="number"
                  min="0"
                  max={info.max_level}
                  value={levels[inputKey] ?? ''}
                  onChange={(e) => handleLevelChange(inputKey, e.target.value, info.max_level)}
                  placeholder="Lvl"
                  className="w-24"
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${inputKey}-max`}
                      onCheckedChange={(checked) => { if (checked) setMaxLevel(inputKey, info.max_level) }}
                      checked={levels[inputKey] === info.max_level}
                    />
                    <Label htmlFor={`${inputKey}-max`} className="text-xs">Max</Label>
                </div>
            </div>
        </div>
     )
  };

  const renderItemGroup = (title: string, itemKeys: string[], type: 'troop' | 'spell' | 'hero') => {
    if (!thData) return null;
    
    const sourceMap = type === 'troop' ? thData.army.troops : type === 'spell' ? thData.spells.spells : thData.heroes;
    
    const availableItems = itemKeys.filter(key => (sourceMap as any)?.[key]);

    if (availableItems.length === 0) return null;

    return (
        <div className='space-y-4'>
            {title && <h3 className="text-xl font-headline mb-2">{title}</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {availableItems.map(key => {
                     const itemInfo = (sourceMap as any)[key];
                     return renderSingleItemInput(key, type, itemInfo);
                })}
            </div>
        </div>
    );
  };
  
  const handleNext = () => {
    setIsMaxAllChecked(false);
    setCurrentStep(prev => Math.min(prev + 1, surveySteps.length - 1));
  }
  const handleBack = () => {
    setIsMaxAllChecked(false);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }

  const handleSubmit = async () => {
    if (!townHallLevel || !thData) return;

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroesList: Hero[] = [];
    
    const buildingData = thData.buildings as Record<string, { count: number; max_level: number }>;

    Object.keys(buildingData).forEach((buildingKey) => {
        if (buildingKey === 'total_buildings') return;
        const buildingInfo = buildingData[buildingKey];
        const isSingle = singleInstanceBuildings.includes(buildingKey);
        const count = isSingle ? 1 : buildingInfo.count;

        for (let i = 0; i < count; i++) {
            const inputKey = isSingle ? `building-${buildingKey}` : `${buildingKey}-${i}`;
            const level = levels[inputKey] || 1;
            const buildingName = snakeToTitleCase(buildingKey);
            buildings.push({
                id: `${buildingName}-${i}`, // Ensure unique ID
                name: buildingName,
                level,
                maxLevel: buildingInfo.max_level,
                type: buildingNameToType[buildingName] || 'other',
                base: 'home',
                isUpgrading: false
            });
        }
    });

    const processItems = (itemMap: Record<string, any>, itemType: 'troop' | 'spell' | 'hero') => {
        Object.keys(itemMap).forEach(key => {
            const itemInfo = itemMap[key];
            const inputKey = `${itemType}-${key}`;
            const level = levels[inputKey] || 0;
            const name = snakeToTitleCase(key);

            if (itemType === 'troop') {
                troops.push({ id: inputKey, name, level, maxLevel: itemInfo.max_level, village: 'home', elixirType: regularTroops.includes(key) ? 'regular' : 'dark' });
            } else if (itemType === 'spell') {
                troops.push({ id: inputKey, name, level, maxLevel: itemInfo.max_level, village: 'home', elixirType: regularSpells.includes(key) ? 'regular' : 'dark' });
            } else if (itemType === 'hero') {
                heroesList.push({ id: inputKey, name, level, maxLevel: itemInfo.max_level, village: 'home' });
            }
        });
    };

    processItems(thData.army.troops, 'troop');
    processItems(thData.spells.spells, 'spell');
    processItems(thData.heroes, 'hero');

    const villageState: VillageState = {
      townHallLevel, builderHallLevel: 1, buildings, troops, heroes: heroesList, pets: [], equipment: [],
    };
    
    onSurveyComplete(villageState);
  };

  const currentSurveyStep = surveySteps[currentStep];
  const Icon = currentSurveyStep.icon;

  return (
    <Card className="max-w-4xl mx-auto mt-8 w-full">
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
                <CardDescription>
                  {currentStep === 0 ? "Select your Town Hall level to begin." : "Enter the levels for the items below."}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px] max-h-[60vh] overflow-y-auto p-6">
        {currentStep > 0 && thData && (
          <div className="flex items-center space-x-2 mb-6 p-3 rounded-md bg-muted sticky top-0 z-10">
            <Checkbox
              id="max-all-step"
              checked={isMaxAllChecked}
              onCheckedChange={handleMaxAllForStep}
            />
            <Label htmlFor="max-all-step" className="font-semibold text-base cursor-pointer">
              Max All for this Step
            </Label>
          </div>
        )}
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
