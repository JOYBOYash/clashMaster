
"use client";

import { useState, useMemo, useEffect } from 'react';
import { getItemsForTownHall, getMaxLevelForItem, getBuildingCountsForTownHall, singleInstanceBuildings, buildingUnlockLevels, GameItem } from '@/lib/game-data';
import type { VillageState, Building, Troop, Hero, Pet, Equipment } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SurveyProgress } from './survey-progress';
import { Dna, Gem, Swords, Shield, Coins, Library, Home, ChevronRight, ChevronLeft, Hammer, FlaskConical, Warehouse, ChevronsUp, X } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets, nameToPathMap, defaultImagePath } from '@/lib/image-paths';
import { buildingNameToType } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/context/auth-context';

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
    troops: "Time to review your forces. Every troop level counts.",
    heroes: "The most powerful units in the game. Let's see how your legends are progressing.",
};


export function VillageSurvey({ onSurveyComplete }: VillageSurveyProps) {
  const { signOut } = useAuth();
  const [townHallLevel, setTownHallLevel] = useState<number | null>(null);
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [currentAvatar, setCurrentAvatar] = useState(heroAvatarAssets[0]);
  
  const surveySteps = useMemo(() => {
    if (!townHallLevel) return [{ id: 'townHall', title: 'Town Hall Level', icon: Home, items: [] }];

    const stepConfig = [
      { id: 'townHall', title: 'Town Hall Level', icon: Home, items: [] },
      { id: 'keyBuildings', title: 'Key Buildings', icon: Library, items: singleInstanceBuildings.filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'armyCamps', title: 'Army Camps', icon: Swords, items: ['Army Camp'] },
      { id: 'storages', title: 'Resource Storages', icon: Warehouse, items: ['Gold Storage', 'Elixir Storage', 'Dark Elixir Storage'].filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'collectors', title: 'Resource Collectors', icon: Coins, items: ['Gold Mine', 'Elixir Collector', 'Dark Elixir Drill'].filter(b => buildingUnlockLevels[b] <= townHallLevel) },
      { id: 'defenses', title: 'Defenses', icon: Shield, items: Object.keys(getBuildingCountsForTownHall(townHallLevel)).filter(b => buildingNameToType[b] === 'defensive' && !singleInstanceBuildings.includes(b) && buildingUnlockLevels[b] <= townHallLevel) },
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
  
  const setAllBuildingsInCategoryToMax = (buildingNames: string[]) => {
    if (!townHallLevel) return;
    const newLevels = { ...levels };
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);

    buildingNames.forEach(buildingName => {
      const count = singleInstanceBuildings.includes(buildingName) ? 1 : (buildingCounts[buildingName] || 0);
      const maxLevel = getMaxLevelForItem(buildingName, townHallLevel);
      for(let i=0; i<count; i++) {
        const inputKey = `${buildingName}-${i}`;
        newLevels[inputKey] = maxLevel;
      }
    });
    setLevels(newLevels);
  };
  
  const setAllItemsInCategoryToMax = (items: GameItem[]) => {
    if (!townHallLevel) return;
    const newLevels = { ...levels };
    items.forEach(item => {
        const inputKey = `${item.type}-${item.name}`;
        const maxLevel = getMaxLevelForItem(item.name, townHallLevel);
        newLevels[inputKey] = maxLevel;
    });
    setLevels(newLevels);
  };


  const renderBuildingInputs = (buildingName: string) => {
    if (!townHallLevel) return null;
    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
    const count = singleInstanceBuildings.includes(buildingName) ? 1 : (buildingCounts[buildingName] || 0);
    if(count === 0) return null;

    const maxLevel = getMaxLevelForItem(buildingName, townHallLevel);
    const imagePath = nameToPathMap[buildingName] || defaultImagePath;
    
    return (
      <div key={buildingName} className="space-y-6">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold text-foreground text-xl text-center">{buildingName}</h4>
             {maxLevel > 1 && (
                <Button size="sm" variant="outline" onClick={() => setAllBuildingsInCategoryToMax([buildingName])}>
                    <ChevronsUp className='mr-2' /> Set to Max
                </Button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: count }).map((_, i) => {
            const inputKey = `${buildingName}-${i}`;
            const currentLevel = levels[inputKey] ?? 1;
            return (
              <div key={inputKey} className="p-3 border rounded-xl bg-background/50 flex flex-col items-center text-center gap-3">
                 { count > 1 && <Label htmlFor={inputKey} className="text-sm font-semibold text-muted-foreground">#{i + 1}</Label> }
                 <div className="relative w-24 h-24">
                    <Image src={imagePath} alt={`${buildingName}`} fill className="object-contain" unoptimized />
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
            <div className='flex justify-end items-center'>
                {title && <h3 className="text-xl font-headline mb-2 mr-auto">{title}</h3>}
                <Button size="sm" variant="outline" onClick={() => setAllItemsInCategoryToMax(items)}>
                    <ChevronsUp className='mr-2' /> Set All to Max
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {items.map(item => renderSingleItemInput(item))}
            </div>
        </div>
    );
  };
  
  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, surveySteps.length - 1));
  }
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }

  const handleSubmit = async () => {
    if (!townHallLevel) return;

    const buildingCounts = getBuildingCountsForTownHall(townHallLevel);
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

    getItemsForTownHall(townHallLevel, ['troop', 'spell', 'hero', 'pet', 'equipment']).forEach(item => {
        const key = `${item.type}-${item.name}`;
        const level = levels[key] || 0;
        const maxLevel = getMaxLevelForItem(item.name, townHallLevel);

        switch (item.type) {
            case 'troop':
            case 'spell':
                troops.push({ id: key, name: item.name, level, maxLevel, village: 'home', elixirType: 'regular' });
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
            <Image src={nameToPathMap['Town Hall'] || defaultImagePath} alt="Town Hall" width={150} height={150} unoptimized/>
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
                <Image src={`/assets/_town-halls/Town_Hall_${townHallLevel}.png`} alt={`Town Hall level ${townHallLevel}`} width={150} height={150} unoptimized/>
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
        const buildingItems = currentStepConfig.items as string[];
        return (
            <div className='space-y-8'>
                {buildingItems.length > 1 && (
                    <div className='flex justify-end'>
                        <Button variant='outline' onClick={() => setAllBuildingsInCategoryToMax(buildingItems)}>
                            <ChevronsUp className='mr-2' /> Set All to Max
                        </Button>
                    </div>
                )}
                {buildingItems.map(item => renderBuildingInputs(item as string))}
            </div>
        );
    }
  }


  return (
    <div className="w-full flex-grow flex items-center justify-center p-0 bg-background">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-0 h-full lg:h-[90vh] lg:max-h-[800px] lg:rounded-xl lg:shadow-2xl bg-card border-green-500/30">
        
        <div className="lg:col-span-2 flex-col items-center justify-center bg-green-100/30 dark:bg-green-900/10 p-8 lg:p-12 lg:rounded-l-xl hidden lg:flex">
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
            <Card className="border-0 rounded-none lg:rounded-r-xl flex flex-col flex-grow h-full bg-card shadow-none hover:shadow-none transition-none hover:transform-none">
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
              <CardFooter className="flex justify-between items-center mt-auto border-t pt-6 bg-card sticky bottom-0 shrink-0">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                    <ChevronLeft /> Back
                </Button>
                <div className="flex-grow flex justify-center">
                    <Button variant="link" onClick={signOut}>
                        <X className='mr-2' />Cancel Setup
                    </Button>
                </div>
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
