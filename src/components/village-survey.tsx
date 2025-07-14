
"use client";

import { useState, useMemo, useEffect } from 'react';
import { getItemsForTownHall, getMaxLevelForItem, getBuildingCountsForTownHall, singleInstanceBuildings, buildingUnlockLevels, GameItem, getElixirTypeForItem } from '@/lib/game-data';
import type { VillageState, Building, Troop, Hero, Pet, Equipment } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from './ui/checkbox';
import { SurveyProgress } from './survey-progress';
import { Dna, Gem, Swords, Shield, Coins, Library, Home, ChevronRight, ChevronLeft, Hammer, FlaskConical, Warehouse, BrickWall, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets } from '@/lib/image-paths';
import { buildingNameToType } from '@/lib/constants';

interface VillageSurveyProps {
  onSurveyComplete: (data: VillageState) => void;
}

const snakeToTitleCase = (str: string) => str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export function VillageSurvey({ onSurveyComplete }: VillageSurveyProps) {
  const [townHallLevel, setTownHallLevel] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isMaxAllChecked, setIsMaxAllChecked] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(heroAvatarAssets[0]);

  const surveySteps = useMemo(() => {
    if (!townHallLevel) return [{ id: 'townHall', title: 'Town Hall Level', icon: Home, items: [], text: "Let's start with the heart of your village—the Town Hall!" }];

    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    
    return [
      { id: 'townHall', title: 'Town Hall Level', icon: Home, items: [], text: "Let's start with the heart of your village—the Town Hall!" },
      { id: 'keyBuildings', title: 'Key Buildings', icon: Library, items: singleInstanceBuildings.filter(b => buildingUnlockLevels[b] <= townHallLevel), text: "These core buildings define your village's capabilities." },
      { id: 'armyCamps', title: 'Army Camps', icon: Swords, items: ['Army Camp'], text: "The bigger the camp, the bigger the army. Simple!" },
      { id: 'storages', title: 'Resource Storages', icon: Warehouse, items: ['Gold Storage', 'Elixir Storage', 'Dark Elixir Storage'].filter(b => buildingUnlockLevels[b] <= townHallLevel), text: "You can't spend what you can't hold. Let's log your storage capacity." },
      { id: 'collectors', title: 'Resource Collectors', icon: Coins, items: ['Gold Mine', 'Elixir Collector', 'Dark Elixir Drill'].filter(b => buildingUnlockLevels[b] <= townHallLevel), text: "Passive income is the best income. How are your collectors doing?" },
      { id: 'defenses', title: 'Defenses', icon: Shield, items: Object.keys(buildingCounts).filter(b => buildingNameToType[b] === 'defensive' && !singleInstanceBuildings.includes(b) && buildingUnlockLevels[b] <= townHallLevel), text: "A good offense is a good defense... but a great defense is even better!" },
      { id: 'walls', title: 'Walls', icon: BrickWall, items: ['Wall'], text: "The backbone of your defense. Tell me about your walls." },
      { id: 'troops', title: 'Troops & Spells', icon: Dna, items: getItemsForTownHall(townHallLevel, ['troop', 'spell']), text: "Time to review your forces. Every troop level counts." },
      { id: 'heroes', title: 'Heroes, Pets & Equipment', icon: Gem, items: getItemsForTownHall(townHallLevel, ['hero', 'pet', 'equipment']), text: "The most powerful units in the game. Let's see how your legends are progressing." },
    ];
  }, [townHallLevel]);
  
  const currentStepConfig = surveySteps[currentStep];

  useEffect(() => {
    setCurrentAvatar(heroAvatarAssets[currentStep % heroAvatarAssets.length]);
  }, [currentStep]);

  const assignedCount = useMemo(() => {
    if (!townHallLevel || currentStepConfig.id !== 'walls') return 0;
    return Object.keys(levels)
        .filter(key => key.startsWith('wall-'))
        .reduce((sum, key) => sum + (levels[key] || 0), 0);
  }, [levels, townHallLevel, currentStepConfig.id]);

  const handleLevelChange = (key: string, value: string, maxLevel: number) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= maxLevel) {
      setLevels(prev => ({ ...prev, [key]: numericValue }));
    } else if (value === '') {
       setLevels(prev => {
        const newLevels = { ...prev };
        delete newLevels[key];
        return newLevels;
      });
    }
  };

  const setMaxLevel = (key: string, maxLevel: number) => {
    setLevels(prev => ({ ...prev, [key]: maxLevel }));
  };

  const handleMaxAllForStep = (checked: boolean | 'indeterminate') => {
    setIsMaxAllChecked(checked === true);
    if (!townHallLevel) return;

    if (!currentStepConfig) return;

    const newLevelsUpdate: Record<string, number> = {};
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);

    if (currentStepConfig.id === 'walls') {
      // Special handling for walls
    } else if (['keyBuildings', 'armyCamps', 'storages', 'collectors', 'defenses'].includes(currentStepConfig.id)) {
        currentStepConfig.items.forEach((buildingName: string | GameItem) => {
            const name = typeof buildingName === 'string' ? buildingName : buildingName.name;
            const count = singleInstanceBuildings.includes(name) ? 1 : (buildingCounts[name] || 0);
            const maxLevel = getMaxLevelForItem(name, townHallLevel);

            for(let i = 0; i < count; i++) {
                const inputKey = `${name}-${i}`;
                newLevelsUpdate[inputKey] = checked ? maxLevel : 0;
            }
        });
    } else if (['troops', 'heroes'].includes(currentStepConfig.id)) {
        currentStepConfig.items.forEach(item => {
            const gameItem = item as GameItem;
            const maxLevel = getMaxLevelForItem(gameItem.name, townHallLevel);
            const inputKey = `${gameItem.type}-${gameItem.name}`;
            newLevelsUpdate[inputKey] = checked ? maxLevel : 0;
        });
    }
    
    setLevels(prev => ({ ...prev, ...newLevelsUpdate }));
  };

  const renderBuildingInputs = (buildingName: string) => {
    if (!townHallLevel) return null;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const count = singleInstanceBuildings.includes(buildingName) ? 1 : (buildingCounts[buildingName] || 0);
    if(count === 0) return null;

    const maxLevel = getMaxLevelForItem(buildingName, townHallLevel);
    
    return (
      <div key={buildingName} className="space-y-4">
        <h4 className="font-semibold text-foreground text-lg">{buildingName}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: count }).map((_, i) => {
            const inputKey = `${buildingName}-${i}`;
            return (
              <div key={inputKey} className="space-y-2 p-3 border rounded-lg bg-background/50">
                { count > 1 && <Label htmlFor={inputKey} className="text-sm font-semibold">#{i + 1}</Label> }
                <div className="flex items-center gap-2">
                    <Input
                      id={inputKey}
                      type="number"
                      min="0"
                      max={maxLevel}
                      value={levels[inputKey] ?? ''}
                      onChange={(e) => handleLevelChange(inputKey, e.target.value, maxLevel)}
                      placeholder={`Lvl (Max ${maxLevel})`}
                      className="w-full"
                    />
                    <div className="flex items-center space-x-2 shrink-0">
                        <Checkbox
                          id={`${inputKey}-max`}
                          onCheckedChange={(checked) => { if (checked) setMaxLevel(inputKey, maxLevel) }}
                          checked={levels[inputKey] === maxLevel}
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

  const renderSingleItemInput = (item: GameItem) => {
    if (!townHallLevel) return null;
    const inputKey = `${item.type}-${item.name}`;
    const maxLevel = getMaxLevelForItem(item.name, townHallLevel);

    return(
       <div key={inputKey} className="flex items-center justify-between p-2.5 rounded-lg border bg-background/50">
           <Label htmlFor={inputKey} className="text-base">{item.name}</Label>
           <div className="flex items-center gap-3">
               <Input
                 id={inputKey}
                 type="number"
                 min="0"
                 max={maxLevel}
                 value={levels[inputKey] ?? ''}
                 onChange={(e) => handleLevelChange(inputKey, e.target.value, maxLevel)}
                 placeholder={`Lvl (Max ${maxLevel})`}
                 className="w-32"
               />
               <div className="flex items-center space-x-2 shrink-0">
                   <Checkbox
                     id={`${inputKey}-max`}
                     onCheckedChange={(checked) => { if (checked) setMaxLevel(inputKey, maxLevel) }}
                     checked={levels[inputKey] === maxLevel}
                   />
                   <Label htmlFor={`${inputKey}-max`} className="text-xs">Max</Label>
               </div>
           </div>
       </div>
    )
  };

  const renderItemGroup = (items: GameItem[], title?: string) => {
    if (!townHallLevel) return null;
    if (items.length === 0) return null;

    return (
        <div className='space-y-4'>
            {title && <h3 className="text-xl font-headline mb-2">{title}</h3>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {items.map(item => renderSingleItemInput(item))}
            </div>
        </div>
    );
  };
  
  const renderWallInputs = () => {
    if (!townHallLevel) return null;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const totalCount = buildingCounts['Wall'] || 0;
    const maxLevel = getMaxLevelForItem('Wall', townHallLevel);

    const isError = assignedCount > totalCount;

    return (
        <div className="space-y-4">
            <Alert variant={isError ? 'destructive' : 'default'}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Wall Assignment</AlertTitle>
                <AlertDescription>
                    Assigned: <span className="font-bold">{assignedCount}</span> / <span className="font-bold">{totalCount}</span>
                    {isError && <span className="font-bold text-destructive-foreground ml-4">You have assigned more walls than available!</span>}
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => {
                    const inputKey = `wall-${level}`;
                    return (
                        <div key={inputKey} className="flex items-center justify-between p-2.5 rounded-lg border bg-background/50">
                            <Label htmlFor={inputKey} className="text-base">Level {level} Walls</Label>
                            <Input
                                id={inputKey}
                                type="number"
                                min="0"
                                max={totalCount}
                                value={levels[inputKey] ?? ''}
                                onChange={(e) => handleLevelChange(inputKey, e.target.value, totalCount)}
                                placeholder="Count"
                                className="w-28"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
  }

  const handleNext = () => {
    setIsMaxAllChecked(false);
    setCurrentStep(prev => Math.min(prev + 1, surveySteps.length - 1));
  }
  const handleBack = () => {
    setIsMaxAllChecked(false);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }

  const handleSubmit = async () => {
    if (!townHallLevel) return;

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: Hero[] = [];
    const pets: Pet[] = [];
    const equipment: Equipment[] = [];
    
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);

    Object.keys(buildingUnlockLevels).forEach(name => {
      if (buildingUnlockLevels[name] > townHallLevel || name === 'Wall') return;

      const count = singleInstanceBuildings.includes(name) ? 1 : (buildingCounts[name] || 0);
      for (let i = 0; i < count; i++) {
        const inputKey = `${name}-${i}`;
        const level = levels[inputKey] || 1;
        const maxLevel = getMaxLevelForItem(name, townHallLevel);
        buildings.push({
          id: inputKey, name: name, level: level, maxLevel: maxLevel,
          type: buildingNameToType[name] || 'other', base: 'home', isUpgrading: false
        });
      }
    });

    const wallCount = buildingCounts['Wall'] || 0;
    const maxWallLevel = getMaxLevelForItem('Wall', townHallLevel);
    let assignedWallCount = 0;
    for (let level = 1; level <= maxWallLevel; level++) {
        const key = `wall-${level}`;
        const countForLevel = levels[key] || 0;
        for (let i = 0; i < countForLevel; i++) {
            buildings.push({
                id: `Wall-${level}-${i}`, name: 'Wall', level, maxLevel: maxWallLevel,
                type: buildingNameToType['Wall'] || 'other', base: 'home', isUpgrading: false
            });
            assignedWallCount++;
        }
    }
    for (let i = 0; i < (wallCount - assignedWallCount); i++) {
        buildings.push({
            id: `Wall-1-unassigned-${i}`, name: 'Wall', level: 1, maxLevel: maxWallLevel,
            type: buildingNameToType['Wall'] || 'other', base: 'home', isUpgrading: false
        });
    }

    getItemsForTownHall(townHallLevel, ['troop', 'spell', 'hero', 'pet', 'equipment']).forEach(item => {
        const key = `${item.type}-${item.name}`;
        const level = levels[key] || 0;
        const maxLevel = getMaxLevelForItem(item.name, townHallLevel);

        switch (item.type) {
            case 'troop':
            case 'spell':
                troops.push({ id: key, name: item.name, level, maxLevel, village: 'home', elixirType: getElixirTypeForItem(item.name) });
                break;
            case 'hero':
                heroes.push({ id: key, name: item.name, level, maxLevel, village: 'home' });
                break;
            case 'pet':
                pets.push({ id: key, name: item.name, level, maxLevel });
                break;
            case 'equipment':
                equipment.push({ id: key, name: item.name, level, maxLevel });
                break;
        }
    });

    const villageState: VillageState = {
      townHallLevel, builderHallLevel: 1, buildings, troops, heroes, pets, equipment,
    };
    
    onSurveyComplete(villageState);
  };
  
  const Icon = currentStepConfig.icon;
  const currentText = currentStepConfig.text || "Just a few questions to build your village's blueprint!";


  const renderContent = () => {
    if (!townHallLevel && currentStep > 0) {
      return <div className='text-center text-muted-foreground pt-12'>Please select your Town Hall level first.</div>;
    }
    switch (currentStepConfig.id) {
      case 'townHall':
        return <Select onValueChange={(v) => { setTownHallLevel(parseInt(v)); setLevels({}); }}>
          <SelectTrigger className="w-full mt-2 text-base py-6"><SelectValue placeholder="Select your Town Hall level..." /></SelectTrigger>
          <SelectContent>{Array.from({ length: 16 }, (_, i) => i + 1).map(l => <SelectItem key={l} value={String(l)}>Town Hall {l}</SelectItem>)}</SelectContent>
        </Select>;
      case 'walls':
        return renderWallInputs();
      case 'troops':
        return (
            <>
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['troop']), "Troops")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['spell']), "Spells")}
            </>
        )
      case 'heroes':
          return (
            <>
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['hero']), "Heroes")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['pet']), "Pets")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['equipment']), "Equipment")}
            </>
          )
      default:
        return (currentStepConfig.items as (string | GameItem)[]).map(item => 
          typeof item === 'string' ? renderBuildingInputs(item) : renderSingleItemInput(item)
        );
    }
  }


  return (
    <div className="w-full h-full flex items-center justify-center p-0">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-screen lg:min-h-0 lg:rounded-xl lg:shadow-2xl lg:border bg-card">
        
        <div className="flex flex-col items-center justify-center bg-muted/30 p-8 lg:p-12 order-1 lg:order-none">
            <div className="w-32 h-32 lg:w-64 lg:h-64 relative">
                <Image 
                    src={currentAvatar}
                    alt="Hero Avatar"
                    fill
                    className="object-contain animate-float"
                    unoptimized
                />
            </div>
            <p className="text-center text-muted-foreground mt-8 text-lg font-headline max-w-sm">{currentText}</p>
        </div>

        <div className="flex flex-col order-none lg:order-1">
            <Card className="border-0 shadow-none rounded-none flex flex-col flex-grow">
              <CardHeader>
                <div className="w-full mb-4">
                  <SurveyProgress currentStep={currentStep} totalSteps={surveySteps.length} />
                </div>
                <div className='flex items-center gap-4'>
                     <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                        <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-3xl">{currentStepConfig.title}</CardTitle>
                        <CardDescription>
                          {currentStep === 0 ? "Select your Town Hall level to begin." : "Enter the levels for the items below."}
                        </CardDescription>
                    </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow min-h-[300px] max-h-[65vh] overflow-y-auto p-6 space-y-6">
                {currentStep > 0 && townHallLevel && currentStepConfig.id !== 'walls' && (
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
                {renderContent()}
              </CardContent>
              <CardFooter className="flex justify-between mt-auto">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                    <ChevronLeft /> Back
                </Button>
                {currentStep < surveySteps.length - 1 ? (
                  <Button onClick={handleNext} disabled={!townHallLevel}>
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!townHallLevel} className="bg-green-600 hover:bg-green-700">
                    Generate My Blueprint
                  </Button>
                )}
              </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
