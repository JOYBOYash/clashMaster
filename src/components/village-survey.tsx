
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
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { allEntities, isUnlocked, getMaxLevelForTownHall, Entity } from '@/lib/game-data';
import { titleCase } from "@/lib/utils";

const generateSchema = () => {
    const schemaShape: { [key: string]: z.ZodNumber } = {};
    allEntities.forEach(item => {
        const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        schemaShape[fieldName] = z.number().min(0).max(item.maxLevel);
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
        allEntities.forEach(item => {
            const fieldName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            defaults[fieldName] = item.name === "Town Hall" ? 1 : 0;
        });
        return defaults as SurveyFormValues;
    }, []);

    const { control, handleSubmit, watch, setValue, getValues } = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues,
    });

    const playerState = watch();
    const townHallLevel = playerState.town_hall || 1;

    useEffect(() => {
        const currentValues = getValues();
        allEntities.forEach(entity => {
            if (entity.name === "Town Hall") return;

            const fieldName = entity.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() as keyof SurveyFormValues;
            const maxLevel = getMaxLevelForTownHall(entity, townHallLevel);
            const currentValue = currentValues[fieldName] as number;

            if (!isUnlocked(entity, playerState)) {
                 if (currentValue !== 0) setValue(fieldName, 0);
            } else if (currentValue > maxLevel) {
                setValue(fieldName, maxLevel);
            }
        });
    }, [playerState, townHallLevel, getValues, setValue]);

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

    const categorizedEntities = useMemo(() => {
        const categories: { [key: string]: Entity[] } = {};
        allEntities.forEach(entity => {
            if (entity.name === "Town Hall") return;
            if (!categories[entity.category]) {
                categories[entity.category] = [];
            }
            categories[entity.category].push(entity);
        });
        return Object.entries(categories).sort(([a], [b]) => a.localeCompare(b));
    }, []);
    
    const townHallEntity = allEntities.find(e => e.name === "Town Hall")!;

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
                            <span className="text-lg font-medium text-primary w-24 text-center">{townHallLevel} / {townHallEntity.maxLevel}</span>
                        </div>
                        <Controller
                            name="town_hall"
                            control={control}
                            render={({ field }) => (
                                <Slider
                                    id="town_hall"
                                    min={1}
                                    max={townHallEntity.maxLevel}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                />
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

            <Accordion type="multiple" className="w-full space-y-2">
                {categorizedEntities.map(([categoryName, items]) => {
                     const isCategoryVisible = items.some(item => isUnlocked(item, playerState));
                     if (!isCategoryVisible) return null;

                    return (
                        <AccordionItem value={categoryName} key={categoryName} className="border-b-0 rounded-lg bg-card/50 px-4">
                            <AccordionTrigger className="text-lg font-headline hover:no-underline">{categoryName}</AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-4">
                                    {items.map((item) => {
                                        if (!isUnlocked(item, playerState)) return null;

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
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
            
            <div className="flex justify-end pt-6">
                <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save My Village Progress
                </Button>
            </div>
        </form>
    );
}

    