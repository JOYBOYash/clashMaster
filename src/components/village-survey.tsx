
"use client";

import { useState, useMemo, useEffect } from 'react';
import { getItemsForTownHall, getMaxLevelForItem, getBuildingCountsForTownHall, singleInstanceBuildings, buildingUnlockLevels, GameItem } from '@/lib/game-data';
import type { VillageState, Building, Troop, Hero, Pet, Equipment } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SurveyProgress } from './survey-progress';
import { Dna, Gem, Swords, Shield, Coins, Library, Home, ChevronRight, ChevronLeft, Hammer, FlaskConical, Warehouse, BrickWall, ChevronsUp, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import Image from 'next/image';
import { heroAvatarAssets, getBuildingImagePathByLevel } from '@/lib/image-paths';
import { buildingNameToType } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface VillageSurveyProps {
  onSurveyComplete: (data: VillageState) => void;
}

const surveyStepTexts: Record<string, string> = {
    default: "Let's start with the heart of your village—the Town Hall!",
    keyBuildings: "These core buildings define your village's capabilities.",
    armyCamps: "The bigger the camp, the bigger the army. Simple!",
    storages: "You can't spend what you can't hold. Let's log your storage capacity.",
    collectors: "Passive income is the best income. How are your collectors doing?",
    defenses: "A good offense is a good defense... but a great defense is even better!",
    walls: "The backbone of your defense. Tell me about your walls.",
    troops: "Time to review your forces. Every troop level counts.",
    heroes: "The most powerful units in the game. Let's see how your legends are progressing.",
};


export function VillageSurvey({ onSurveyComplete }: VillageSurveyProps) {
  const [townHallLevel, setTownHallLevel] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAvatar, setCurrentAvatar] = useState(heroAvatarAssets[0]);
  
  const assignedWallCount = useMemo(() => {
    return Object.keys(levels)
        .filter(key => key.startsWith('wall-'))
        .reduce((sum, key) => sum + (levels[key] || 0), 0);
  }, [levels]);

  const surveySteps = useMemo(() => {
    if (!townHallLevel) return [{ id: 'townHall', title: 'Town Hall Level', icon: Home, items: [] }];

    const stepConfig = [
      { id: 'townHall', title: 'Town Hall Level', icon: Home, items: [] },
      { id: 'keyBuildings', title: 'Key Buildings', icon: Library, items: singleInstanceBuildings.filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'armyCamps', title: 'Army Camps', icon: Swords, items: ['Army Camp'] },
      { id: 'storages', title: 'Resource Storages', icon: Warehouse, items: ['Gold Storage', 'Elixir Storage', 'Dark Elixir Storage'].filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'collectors', title: 'Resource Collectors', icon: Coins, items: ['Gold Mine', 'Elixir Collector', 'Dark Elixir Drill'].filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'defenses', title: 'Defenses', icon: Shield, items: Object.keys(getBuildingCountsForTownHall(townHallLevel)).filter(b => buildingNameToType[b] === 'defensive' && !singleInstanceBuildings.includes(b) && buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'walls', title: 'Walls', icon: BrickWall, items: ['Wall'] },
      { id: 'troops', title: 'Troops & Spells', icon: Dna, items: getItemsForTownHall(townHallLevel, ['troop', 'spell']) },
      { id: 'heroes', title: 'Heroes, Pets & Equipment', icon: Gem, items: getItemsForTownHall(townHallLevel, ['hero', 'pet', 'equipment']) },
    ];
    return stepConfig.filter(step => step.items.length > 0 || step.id === 'townHall');
  }, [townHallLevel]);
  
  const currentStepConfig = surveySteps[currentStep];
  const currentText = surveyStepTexts[currentStepConfig.id as keyof typeof surveyStepTexts] || surveyStepTexts.default;


  useEffect(() => {
    setCurrentAvatar(heroAvatarAssets[currentStep % heroAvatarAssets.length]);
  }, [currentStep]);

  const handleLevelChange = (key: string, value: number, maxLevel: number) => {
    if (value >= 0 && value <= maxLevel) {
      setLevels(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const handleWallCountChange = (level: number, count: number) => {
    if (!townHallLevel) return;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const totalCount = buildingCounts['Wall'] || 0;
    const numericCount = Math.max(0, Math.min(count, totalCount));
    const inputKey = `wall-${level}`;
    
    const otherWallsCount = Object.keys(levels)
        .filter(key => key.startsWith('wall-') && key !== inputKey)
        .reduce((sum, key) => sum + (levels[key] || 0), 0);
    
    const cappedCount = Math.min(numericCount, totalCount - otherWallsCount);

    setLevels(prev => ({ ...prev, [inputKey]: cappedCount }));
  }

  const setAllToMax = (items: (string | GameItem)[], type: 'building' | 'item') => {
    if (!townHallLevel) return;
    const newLevels = { ...levels };
    if (type === 'building') {
      (items as string[]).forEach(buildingName => {
        const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
        const count = singleInstanceBuildings.includes(buildingName) ? 1 : (buildingCounts[buildingName] || 0);
        const maxLevel = getMaxLevelForItem(buildingName, townHallLevel);
        for(let i=0; i<count; i++) {
            const inputKey = `${buildingName}-${i}`;
            newLevels[inputKey] = maxLevel;
        }
      });
    } else {
        (items as GameItem[]).forEach(item => {
            const inputKey = `${item.type}-${item.name}`;
            const maxLevel = getMaxLevelForItem(item.name, townHallLevel);
            newLevels[inputKey] = maxLevel;
        });
    }
    setLevels(newLevels);
  };

  const renderBuildingInputs = (buildingName: string) => {
    if (!townHallLevel) return null;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const count = singleInstanceBuildings.includes(buildingName) ? 1 : (buildingCounts[buildingName] || 0);
    if(count === 0) return null;

    const maxLevel = getMaxLevelForItem(buildingName, townHallLevel);
    
    return (
      <div key={buildingName} className="space-y-6">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground text-xl text-center">{buildingName}</h4>
             {maxLevel > 1 && (
                <Button size="sm" variant="outline" onClick={() => setAllToMax([buildingName], 'building')}>
                    <ChevronsUp className='mr-2' /> Set to Max
                </Button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, i) => {
            const inputKey = `${buildingName}-${i}`;
            const currentLevel = levels[inputKey] ?? 1;
            const imagePath = getBuildingImagePathByLevel(buildingName, currentLevel);
            return (
              <div key={inputKey} className="p-3 border rounded-xl bg-background/50 flex flex-col items-center text-center gap-3">
                 { count > 1 && <Label htmlFor={inputKey} className="text-sm font-semibold text-muted-foreground">#{i + 1}</Label> }
                 <div className="relative w-24 h-24">
                    <Image src={imagePath} alt={`${buildingName} level ${currentLevel}`} fill className="object-contain" unoptimized />
                 </div>
                 <div className='w-full space-y-2'>
                    <p className='font-bold text-lg text-primary'>Level {currentLevel}</p>
                    <Slider
                      id={inputKey}
                      min={1}
                      max={maxLevel}
                      step={1}
                      value={[currentLevel]}
                      onValueChange={(value) => handleLevelChange(inputKey, value[0], maxLevel)}
                      disabled={maxLevel <= 1}
                    />
                     <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Lvl 1</span>
                        <span>Lvl {maxLevel}</span>
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
    const currentLevel = levels[inputKey] ?? 0;

    return(
       <div key={inputKey} className="space-y-3 p-3 rounded-lg border bg-background/50">
            <Label htmlFor={inputKey} className="text-base font-semibold">{item.name}</Label>
            <div className="flex items-center gap-4">
                <Slider
                    id={inputKey}
                    min={0}
                    max={maxLevel}
                    step={1}
                    value={[currentLevel]}
                    onValueChange={(value) => handleLevelChange(inputKey, value[0], maxLevel)}
                    disabled={maxLevel <= 1}
                />
                <Input
                    type="number"
                    min="0"
                    max={maxLevel}
                    value={currentLevel}
                    onChange={(e) => handleLevelChange(inputKey, parseInt(e.target.value) || 0, maxLevel)}
                    className="w-20 text-center font-bold"
                />
            </div>
             <div className='flex justify-between text-xs text-muted-foreground'>
                <span>Lvl 0</span>
                <span>Lvl {maxLevel}</span>
             </div>
       </div>
    )
  };

  const renderItemGroup = (items: GameItem[], title?: string) => {
    if (!townHallLevel || items.length === 0) return null;

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                {title && <h3 className="text-xl font-headline mb-2">{title}</h3>}
                <Button size="sm" variant="outline" onClick={() => setAllToMax(items, 'item')}>
                    <ChevronsUp className='mr-2' /> Set to Max
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
    const isError = assignedWallCount > totalCount;
    const remainingWalls = totalCount - assignedWallCount;

    return (
        <div className="space-y-4">
            <Alert variant={isError ? 'destructive' : 'default'} className='sticky top-0 z-10'>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Wall Assignment</AlertTitle>
                <AlertDescription>
                   Total Walls: <span className="font-bold">{totalCount}</span> |
                   Assigned: <span className="font-bold">{assignedWallCount}</span> |
                   Remaining: <span className={cn("font-bold", remainingWalls < 0 ? 'text-destructive-foreground' : '')}>{remainingWalls}</span>
                    {isError && <span className="font-bold text-destructive-foreground ml-4">You have assigned more walls than available!</span>}
                </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Array.from({ length: maxLevel }, (_, i) => i + 1).map(level => {
                    const inputKey = `wall-${level}`;
                    const currentCount = levels[inputKey] || 0;
                    return (
                        <div key={inputKey} className="space-y-3 p-3 rounded-lg border bg-background/50">
                            <div className='flex items-center gap-4'>
                                <Image src={getBuildingImagePathByLevel('Wall', level)} alt={`Wall level ${level}`} width={48} height={48} className="rounded-md" unoptimized />
                                <Label htmlFor={inputKey} className="text-base font-semibold flex-1">Level {level} Walls</Label>
                                <Input
                                    id={`${inputKey}-input`}
                                    type="number"
                                    min="0"
                                    max={totalCount}
                                    value={currentCount}
                                    onChange={(e) => handleWallCountChange(level, parseInt(e.target.value) || 0)}
                                    className="w-24 text-center font-bold"
                                />
                            </div>
                            <Slider
                                id={inputKey}
                                min={0}
                                max={totalCount - (assignedWallCount - currentCount)}
                                step={1}
                                value={[currentCount]}
                                onValueChange={(value) => handleWallCountChange(level, value[0])}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    )
  }


  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, surveySteps.length - 1));
  }
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }

  const handleSubmit = async () => {
    if (!townHallLevel) return;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const wallCount = buildingCounts['Wall'] || 0;
    if (assignedWallCount > wallCount) {
        alert("You have assigned more walls than you have at this Town Hall level. Please correct the counts before submitting.");
        return;
    }

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: Hero[] = [];
    const pets: Pet[] = [];
    const equipment: Equipment[] = [];
    
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

    const maxWallLevel = getMaxLevelForItem('Wall', townHallLevel);
    let assignedWallPieces = 0;
    for (let level = 1; level <= maxWallLevel; level++) {
        const key = `wall-${level}`;
        const countForLevel = levels[key] || 0;
        for (let i = 0; i < countForLevel; i++) {
            if (assignedWallPieces >= wallCount) break;
            buildings.push({
                id: `Wall-${level}-${assignedWallPieces}`, name: 'Wall', level, maxLevel: maxWallLevel,
                type: buildingNameToType['Wall'] || 'other', base: 'home', isUpgrading: false
            });
            assignedWallPieces++;
        }
    }
    // Add remaining walls as level 1
    for (let i = assignedWallPieces; i < wallCount; i++) {
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
                troops.push({ id: key, name: item.name, level, maxLevel, village: 'home' });
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

  const renderContent = () => {
    if (!townHallLevel) {
       return (
        <div className='flex flex-col items-center gap-4 my-auto'>
            <Image src={getBuildingImagePathByLevel('Town Hall', 1)} alt="Town Hall" width={150} height={150} unoptimized/>
             <Slider
                min={1}
                max={17}
                step={1}
                defaultValue={[1]}
                onValueChange={(v) => {
                    const newLevel = v[0];
                    setTownHallLevel(newLevel);
                    setLevels({});
                }}
             />
             <p className='text-3xl font-bold font-headline text-primary'>Town Hall 1</p>
        </div>
       )
    }

    if (townHallLevel && currentStep === 0) {
        return (
             <div className='flex flex-col items-center gap-4 my-auto'>
                <Image src={getBuildingImagePathByLevel('Town Hall', townHallLevel)} alt={`Town Hall level ${townHallLevel}`} width={150} height={150} unoptimized/>
                 <Slider
                    min={1}
                    max={17}
                    step={1}
                    value={[townHallLevel]}
                    onValueChange={(v) => {
                        const newLevel = v[0];
                        setTownHallLevel(newLevel);
                        setLevels({});
                    }}
                 />
                 <p className='text-3xl font-bold font-headline text-primary'>Town Hall {townHallLevel}</p>
            </div>
        )
    }

    switch (currentStepConfig.id) {
      case 'walls':
        return renderWallInputs();
      case 'troops':
        return (
            <div className='space-y-8'>
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['troop']), "Troops")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['spell']), "Spells")}
            </div>
        )
      case 'heroes':
          return (
            <div className='space-y-8'>
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['hero']), "Heroes")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['pet']), "Pets")}
                {renderItemGroup(getItemsForTownHall(townHallLevel!, ['equipment']), "Equipment")}
            </div>
          )
      default:
        return <div className='space-y-8'>{(currentStepConfig.items as string[]).map(item => renderBuildingInputs(item as string))}</div>;
    }
  }


  return (
    <div className="w-full flex-grow flex items-center justify-center p-0 bg-background">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-0 h-full lg:h-[90vh] lg:max-h-[800px] lg:rounded-xl lg:shadow-2xl lg:border bg-card">
        
        <div className="lg:col-span-2 flex-col items-center justify-center bg-muted/30 p-8 lg:p-12 lg:rounded-l-xl hidden lg:flex">
            <div className="w-64 h-64 relative">
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

        <div className="flex flex-col col-span-1 lg:col-span-3 h-full">
            <Card className="border-0 shadow-none rounded-none lg:rounded-r-xl flex flex-col flex-grow h-full">
              <CardHeader className='shrink-0'>
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
              <ScrollArea className="flex-grow h-0">
                <CardContent className="p-6">
                    {renderContent()}
                </CardContent>
              </ScrollArea>
              <CardFooter className="flex justify-between mt-auto border-t pt-6 bg-card sticky bottom-0 shrink-0">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                    <ChevronLeft /> Back
                </Button>
                {currentStep < surveySteps.length - 1 ? (
                  <Button onClick={handleNext} disabled={!townHallLevel}>
                    Next <ChevronRight />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!townHallLevel || assignedWallCount > (getBuildingCountsForTownHall(townHallLevel || 0)['Wall'] || 0)} className="bg-green-600 hover:bg-green-700">
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

    