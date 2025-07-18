
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { titleCase } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import villageData from '@/lib/raw-defenses-buildings-resources-others.json';
import armyData from '@/lib/raw-troops-heroes-equipment-spells.json';

// Type definitions matching the JSON structure
interface BuildingLevel {
    level: number;
    townHall: number;
    [key: string]: any; // Allow other properties
}

interface BuildingItem {
    name: string;
    category: string;
    village: string;
    build: { townHall: number; [key: string]: any };
    levels: BuildingLevel[];
}

interface ArmyItem {
    name: string;
    category: string;
    village: string;
    unlock: { hall?: number; buildingLevel?: number, resource?: string, [key: string]: any };
    levels: number[] | BuildingLevel[];
}

type ProcessedItem = BuildingItem | ArmyItem;

// Pre-filter and process data
const allData: Record<string, Record<string, ProcessedItem[]>> = { "Village": {}, "Army": {} };
const townHallData = villageData.buildings.find(item => item.name === "Town Hall") as BuildingItem;

const filteredVillageBuildings = villageData.buildings.filter(item => item.name !== "Town Hall" && !item.name.includes("Altar"));
const filteredArmyItems = armyData.filter(item => 
    item.village === "home" && 
    !item.name.startsWith("Super") && 
    item.category !== 'equipment'
);

filteredVillageBuildings.forEach(item => {
    if (!allData.Village[item.category]) allData.Village[item.category] = [];
    allData.Village[item.category].push(item as BuildingItem);
});

filteredArmyItems.forEach(item => {
    let categoryName = titleCase(item.category);
    if (item.category === 'troop') {
        categoryName = item.unlock.resource === 'Dark Elixir' ? 'Dark Elixir Troops' : 'Elixir Troops';
    } else if(item.category === 'spell') {
         categoryName = item.unlock.resource === 'Dark Elixir' ? 'Dark Spells' : 'Elixir Spells';
    }
    if (!allData.Army[categoryName]) allData.Army[categoryName] = [];
    allData.Army[categoryName].push(item as ArmyItem);
});

const generateSchema = () => {
    const schemaShape: { [key: string]: z.ZodNumber } = {};
    if (townHallData) {
        schemaShape['town_hall'] = z.number().min(1).max(townHallData.levels.length);
    }
    Object.values(allData).forEach(section => {
        Object.values(section).forEach(category => {
            category.forEach(item => {
                const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                let maxLevel = Array.isArray(item.levels) ? item.levels.length : 0;
                if (item.name === "Barbarian King") maxLevel = 100;
                schemaShape[fieldName] = z.number().min(0).max(maxLevel > 0 ? maxLevel : 100);
            });
        });
    });
    return z.object(schemaShape);
};

const getMinThForCategory = (category: ProcessedItem[]): number => {
    return Math.min(...category.map(item => {
        if ('build' in item) return item.build.townHall;
        if ('unlock' in item && item.unlock.hall) return item.unlock.hall;
        return Infinity;
    }));
};

export function VillageSurvey() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const surveySchema = useMemo(() => generateSchema(), []);
    type SurveyFormValues = z.infer<typeof surveySchema>;
    
    const defaultValues = useMemo(() => {
       const defaults: { [key: string]: number } = {'town_hall': 1};
        Object.values(allData).forEach(section => {
           Object.values(section).forEach(category => {
               category.forEach(item => {
                   const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                   defaults[fieldName] = 0;
               });
           });
       });
       return defaults as SurveyFormValues;
    }, []);

    const { control, handleSubmit, watch, setValue, getValues } = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues,
    });
    
    const townHallLevel = watch('town_hall');
    const barracksLevel = watch('barracks');
    const darkBarracksLevel = watch('dark_barracks');

    const isUnlocked = useCallback((item: ProcessedItem, thLevel: number): boolean => {
        if (item.name === "Town Hall") return true;
        if ('build' in item) return item.build.townHall <= thLevel;
        if ('unlock' in item) {
            if (item.unlock.hall && item.unlock.hall > thLevel) return false;
            
            if (item.unlock.buildingLevel) {
                 const requiredBuildingLevel = item.unlock.resource === 'Dark Elixir' ? darkBarracksLevel : barracksLevel;
                 return item.unlock.buildingLevel <= requiredBuildingLevel;
            }
            return true;
        }
        return false;
    }, [barracksLevel, darkBarracksLevel]);

    const getMaxLevelForTownHall = useCallback((item: ProcessedItem, thLevel: number): number => {
         if (item.name === "Town Hall") return (item as BuildingItem).levels.length;
        if ('build' in item) {
            const building = item as BuildingItem;
            const availableLevels = building.levels.filter(l => l.townHall <= thLevel);
            return availableLevels.length > 0 ? Math.max(...availableLevels.map(l => l.level)) : 0;
        } else {
            const armyUnit = item as ArmyItem;
            if (Array.isArray(armyUnit.levels) && typeof armyUnit.levels[0] === 'number') {
                let maxLevel = 0;
                for (let i = 0; i < armyUnit.levels.length; i++) {
                    if ((armyUnit.levels as number[])[i] <= thLevel) maxLevel = i + 1;
                    else break;
                }
                return maxLevel;
            } else if (Array.isArray(armyUnit.levels)) {
                 const availableLevels = (armyUnit.levels as BuildingLevel[]).filter(l => l.townHall <= thLevel);
                 return availableLevels.length > 0 ? Math.max(...availableLevels.map(l => l.level)) : 0;
            }
        }
        return 0;
    }, []);
    
    useEffect(() => {
        const currentValues = getValues();
        Object.values(allData).forEach(section => {
            Object.values(section).forEach(category => {
                category.forEach(item => {
                    const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() as keyof SurveyFormValues;
                    const maxLevel = getMaxLevelForTownHall(item, townHallLevel);
                    const currentValue = currentValues[fieldName] as number;
                    
                    if (!isUnlocked(item, townHallLevel)) {
                        if (currentValue !== 0) setValue(fieldName, 0);
                    } else if (currentValue > maxLevel) {
                        setValue(fieldName, maxLevel);
                    }
                });
            });
        });
    }, [townHallLevel, barracksLevel, darkBarracksLevel, getValues, setValue, getMaxLevelForTownHall, isUnlocked]);


    const onSubmit = async (data: SurveyFormValues) => {
        setIsLoading(true);
        console.log("Form Data:", data);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        toast({
            title: "Village Data Saved!",
            description: "Your village information has been updated successfully.",
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Card className="shadow-lg border-primary/20">
                <CardHeader>
                    <CardTitle>Town Hall Level</CardTitle>
                    <CardDescription>Start by selecting your Town Hall level. This will determine what buildings and upgrades are available below.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="town_hall" className="text-lg">Town Hall</Label>
                            <span className="text-lg font-medium text-primary w-24 text-center">{townHallLevel} / {townHallData.levels.length}</span>
                        </div>
                        <Controller
                            name="town_hall"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    id="town_hall"
                                    min={1}
                                    max={townHallData.levels.length}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            {Object.entries(allData).map(([sectionTitle, categories]) => (
                <div key={sectionTitle}>
                    <h2 className="text-2xl font-headline font-bold mb-4">{sectionTitle}</h2>
                    <Accordion type="multiple" className="w-full space-y-2">
                        {Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)).map(([categoryName, items]) => {
                            if (townHallLevel < getMinThForCategory(items)) return null;

                            return (
                                <AccordionItem value={categoryName} key={categoryName} className="border-b-0 rounded-lg bg-card/50 px-4">
                                    <AccordionTrigger className="text-lg font-headline hover:no-underline">{categoryName}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-4">
                                            {items.map((item) => {
                                                if (!isUnlocked(item, townHallLevel)) return null;

                                                const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() as keyof SurveyFormValues;
                                                const watchedValue = watch(fieldName);
                                                const maxLevel = getMaxLevelForTownHall(item, townHallLevel);
                                                
                                                return (
                                                <div key={fieldName} className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <Label htmlFor={fieldName.toString()}>{titleCase(item.name.replace(/_/g, ' '))}</Label>
                                                        <span className="text-sm font-medium text-primary w-16 text-center">{watchedValue} / {maxLevel}</span>
                                                    </div>
                                                    <Controller
                                                        name={fieldName}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Slider
                                                                id={fieldName.toString()}
                                                                min={0}
                                                                max={maxLevel}
                                                                step={1}
                                                                value={[field.value as number]}
                                                                onValueChange={(value) => field.onChange(value[0])}
                                                                disabled={maxLevel === 0}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            )})}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </div>
            ))}

            <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save My Village Progress
                </Button>
            </div>
        </form>
    );
}
