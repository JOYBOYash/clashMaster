
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
import { useState, useMemo } from "react";
import { titleCase } from "@/lib/utils";

import villageData from '@/lib/raw-defenses-buildings-resources-others.json';
import armyData from '@/lib/raw-troops-heroes-equipment-spells.json';

// Type definitions matching the JSON structure
interface ItemLevel {
    level: number;
    // other properties are not needed for the survey form
}

interface BuildingItem {
    name: string;
    category: string;
    levels: ItemLevel[];
}

interface ArmyItem {
    name: string;
    category: string;
    levels: number[]; // The army data uses a simple array of numbers for levels
}

// A unified type for processing
interface ProcessedItem {
    name: string;
    maxLevel: number;
}

// Function to process building data
const processBuildingData = (data: { buildings: BuildingItem[] }): Record<string, ProcessedItem[]> => {
    const processed: Record<string, ProcessedItem[]> = {};
    data.buildings.forEach(item => {
        if (!processed[item.category]) {
            processed[item.category] = [];
        }
        processed[item.category].push({
            name: item.name,
            maxLevel: item.levels.length,
        });
    });
    return processed;
};

// Function to process army data
const processArmyData = (data: ArmyItem[]): Record<string, ProcessedItem[]> => {
    const processed: Record<string, ProcessedItem[]> = {};
    data.forEach(item => {
        if (item.category === "equipment") return; // Exclude equipment for now
        
        const categoryName = titleCase(item.category);
        if (!processed[categoryName]) {
            processed[categoryName] = [];
        }
        processed[categoryName].push({
            name: item.name,
            maxLevel: Math.max(...item.levels),
        });
    });
    return processed;
};

const allData = {
    "Village": processBuildingData(villageData),
    "Army": processArmyData(armyData),
};

const generateSchema = () => {
    const schemaShape: { [key: string]: z.ZodNumber } = {};
    Object.values(allData).forEach(section => {
        Object.values(section).flat().forEach(item => {
            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            schemaShape[fieldName] = z.number().min(0).max(item.maxLevel);
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

    const { control, handleSubmit, watch } = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues,
    });

    const onSubmit = async (data: SurveyFormValues) => {
        setIsLoading(true);
        console.log("Form Data:", data);

        // Simulate a network request
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
                                            
                                            return (
                                            <div key={fieldName} className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <Label htmlFor={fieldName.toString()}>{titleCase(item.name.replace(/_/g, ' '))}</Label>
                                                    <span className="text-sm font-medium text-primary w-10 text-center">{watchedValue}</span>
                                                </div>
                                                <Controller
                                                    name={fieldName}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Slider
                                                            id={fieldName.toString()}
                                                            min={0}
                                                            max={item.maxLevel}
                                                            step={1}
                                                            value={[field.value as number]}
                                                            onValueChange={(value) => field.onChange(value[0])}
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
