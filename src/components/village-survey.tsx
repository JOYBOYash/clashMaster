
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
import { useState } from "react";
import { titleCase } from "@/lib/utils";

import buildingsData from '@/lib/raw-defenses-buildings-resources-others.json';
import armyData from '@/lib/raw-troops-heroes-equipment-spells.json';

type Category = {
    name: string;
    items: {
        name: string;
        maxLevel: number;
    }[];
};

const allData: Record<string, Category[]> = {
    "Village": buildingsData,
    "Army": armyData,
};

// Dynamically create the Zod schema from the data
const generateSchema = () => {
    const schemaShape: { [key: string]: z.ZodNumber } = {};
    Object.values(allData).flat().forEach(category => {
        category.items.forEach(item => {
            const fieldName = item.name.replace(/\s+/g, '_').toLowerCase();
            schemaShape[fieldName] = z.number().min(0).max(item.maxLevel);
        });
    });
    return z.object(schemaShape);
};

const surveySchema = generateSchema();
type SurveyFormValues = z.infer<typeof surveySchema>;

export function VillageSurvey() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, watch } = useForm<SurveyFormValues>({
        resolver: zodResolver(surveySchema),
        defaultValues: Object.values(allData).flat().reduce((acc, category) => {
            category.items.forEach(item => {
                const fieldName = item.name.replace(/\s+/g, '_').toLowerCase();
                // @ts-ignore
                acc[fieldName] = 0;
            });
            return acc;
        }, {}),
    });

    const onSubmit = async (data: SurveyFormValues) => {
        setIsLoading(true);
        console.log("Form Data:", data);

        // Here you would typically save the data to your backend/database
        // For now, we'll just simulate a network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        toast({
            title: "Village Data Saved!",
            description: "Your village information has been updated successfully.",
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {Object.entries(allData).map(([sectionTitle, sectionCategories]) => (
                <div key={sectionTitle}>
                    <h2 className="text-2xl font-headline font-bold mb-4">{sectionTitle}</h2>
                    <Accordion type="multiple" className="w-full">
                        {sectionCategories.map((category) => (
                            <AccordionItem value={category.name} key={category.name}>
                                <AccordionTrigger className="text-lg font-headline">{category.name}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 pt-4">
                                        {category.items.map((item) => {
                                            const fieldName = item.name.replace(/\s+/g, '_').toLowerCase() as keyof SurveyFormValues;
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

            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Progress
                </Button>
            </div>
        </form>
    );
}
