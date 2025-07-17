
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
    build: { townHall: number; [key: string]: any };
    levels: BuildingLevel[];
}

interface ArmyItem {
    name: string;
    category: string;
    unlock: { hall: number; [key: string]: any };
    levels: number[];
}

interface ProcessedItem {
    name: string;
    data: BuildingItem | ArmyItem;
}

// Pre-filter hero altars
const filteredVillageBuildings = villageData.buildings.filter(item => !item.name.includes("Altar"));

const allData: Record<string, Record<string, ProcessedItem[]>> = {
    "Village": {},
    "Army": {}
};

filteredVillageBuildings.forEach(item => {
    if (!allData.Village[item.category]) {
        allData.Village[item.category] = [];
    }
    allData.Village[item.category].push({ name: item.name, data: item as BuildingItem });
});

armyData.forEach(item => {
    if (item.category === "equipment") return;
    const categoryName = titleCase(item.category);
    if (!allData.Army[categoryName]) {
        allData.Army[categoryName] = [];
    }
    allData.Army[categoryName].push({ name: item.name, data: item as ArmyItem });
});


const generateSchema = () => {
    const schemaShape: { [key: string]: z.ZodNumber } = {};
    Object.values(allData).forEach(section => {
        Object.values(section).flat().forEach(item => {
            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            let maxLevel = 0;
            if ('build' in item.data) { // It's a BuildingItem
                maxLevel = (item.data as BuildingItem).levels.length;
            } else if ('dps' in item.data) { // It's a Hero item
                 maxLevel = (item.data as any).dps.length;
            } else { // It's a regular ArmyItem
                maxLevel = (item.data as ArmyItem).levels.length;
            }
            schemaShape[fieldName] = z.number().min(0).max(maxLevel > 0 ? maxLevel : 100); // Set a high max for safety if 0
        });
    });
    return z.object(schemaShape);
};

export function VillageSurvey() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const surveySchema = useMemo(() => generateSchema(), []);
    type SurveyFormValues = z.infer<typeof surveySchema>;
    
    const defaultValues = useMemo(() => {
       const defaults: { [key: string]: number } = {};
       Object.values(allData).forEach(section => {
           Object.values(section).flat().forEach(item => {
               const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
               defaults[fieldName] = 0;
           });
       });
       return defaults as SurveyFormValues;
    }, []);

    const { control, handleSubmit, watch, setValue, getValues } = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues,
    });
    
    const townHallLevel = watch('town_hall');

    const isUnlockedAtTownHall = useCallback((item: ProcessedItem, thLevel: number): boolean => {
        if (item.name === "Town Hall") return true;
        if ('build' in item.data) { // BuildingItem
            return item.data.build.townHall <= thLevel;
        } else if ('unlock' in item.data) { // ArmyItem or Hero
            return item.data.unlock.hall <= thLevel;
        }
        return false;
    }, []);

    const getMaxLevelForTownHall = useCallback((item: ProcessedItem, thLevel: number): number => {
        if (!isUnlockedAtTownHall(item, thLevel)) return 0;
        
        if (item.name === "Town Hall") {
             return (item.data as BuildingItem).levels.length;
        }

        if ('build' in item.data) { // It's a BuildingItem from villageData
            const building = item.data as BuildingItem;
            const availableLevels = building.levels.filter(l => l.townHall <= thLevel);
            return availableLevels.length > 0 ? Math.max(...availableLevels.map(l => l.level)) : 0;
        } else { // It's an ArmyItem from armyData
            const armyUnit = item.data as ArmyItem;
            // For heroes, levels array is TownHall requirements per level
            let maxLevel = 0;
            for (let i = 0; i < armyUnit.levels.length; i++) {
                if (armyUnit.levels[i] <= thLevel) {
                    maxLevel = i + 1;
                } else {
                    break;
                }
            }
            return maxLevel;
        }
    }, [isUnlockedAtTownHall]);
    
    useEffect(() => {
        const currentValues = getValues();
        Object.entries(allData).forEach(([sectionTitle, categories]) => {
            Object.values(categories).flat().forEach(item => {
                if (item.name === "Town Hall") return;
                
                const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() as keyof SurveyFormValues;
                const maxLevel = getMaxLevelForTownHall(item, townHallLevel);
                const currentValue = currentValues[fieldName] as number;

                if (currentValue > maxLevel) {
                    setValue(fieldName, maxLevel);
                }
            });
        });
    }, [townHallLevel, getValues, setValue, getMaxLevelForTownHall]);


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
            {Object.entries(allData).map(([sectionTitle, categories]) => (
                <div key={sectionTitle}>
                    <h2 className="text-2xl font-headline font-bold mb-4">{sectionTitle}</h2>
                    <Accordion type="multiple" className="w-full space-y-2">
                        {Object.entries(categories).map(([categoryName, items]) => (
                            <AccordionItem value={categoryName} key={categoryName} className="border-b-0 rounded-lg bg-card/50 px-4">
                                <AccordionTrigger className="text-lg font-headline hover:no-underline">{categoryName}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-4">
                                        {items.map((item) => {
                                            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() as keyof SurveyFormValues;
                                            const watchedValue = watch(fieldName);
                                            const maxLevel = getMaxLevelForTownHall(item, townHallLevel);
                                            const isUnlocked = isUnlockedAtTownHall(item, townHallLevel);

                                            if (!isUnlocked) return null;
                                            
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
                                                            disabled={item.name !== 'Town Hall' && maxLevel === 0}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )})}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
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
