
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wand2, FlaskConical, Droplet, Zap, Skull } from 'lucide-react';
import type { VillageState } from '@/lib/constants';
import { suggestArmy, type SuggestArmyInput, type SuggestArmyOutput } from '@/ai/flows/suggest-army';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

const defaultImagePath = 'https://placehold.co/128x128.png';
const nameToPathMap: Record<string, string> = {
    'Archer': '/assets/_troops/elixir/archer.png',
    'Baby Dragon': '/assets/_troops/elixir/baby-dragon.png',
    'Balloon': '/assets/_troops/elixir/balloon.png',
    'Barbarian': '/assets/_troops/elixir/barbarian.png',
    'Dragon Rider': '/assets/_troops/elixir/dragon-rider.png',
    'Dragon': '/assets/_troops/elixir/dragon.png',
    'Electro Dragon': '/assets/_troops/elixir/electro-dragon.png',
    'Electro Titan': '/assets/_troops/elixir/electro-titan.png',
    'Giant': '/assets/_troops/elixir/giant.png',
    'Goblin': '/assets/_troops/elixir/goblin.png',
    'Healer': '/assets/_troops/elixir/healer.png',
    'Miner': '/assets/_troops/elixir/miner.png',
    'P.E.K.K.A': '/assets/_troops/elixir/pekka.png',
    'Root Rider': '/assets/_troops/elixir/root-rider.png',
    'Thrower': '/assets/_troops/elixir/thrower.png',
    'Wall Breaker': '/assets/_troops/elixir/wall-breaker.png',
    'Wizard': '/assets/_troops/elixir/wizard.png',
    'Yeti': '/assets/_troops/elixir/yeti.png',
    'Apprentice Warden': '/assets/_troops/dark-elixir/apprentice-warden.png',
    'Bowler': '/assets/_troops/dark-elixir/bowler.png',
    'Druid': '/assets/_troops/dark-elixir/druid.png',
    'Golem': '/assets/_troops/dark-elixir/golem.png',
    'Headhunter': '/assets/_troops/dark-elixir/head-hunter.png',
    'Hog Rider': '/assets/_troops/dark-elixir/hog-rider.png',
    'Ice Golem': '/assets/_troops/dark-elixir/ice-golem.png',
    'Lava Hound': '/assets/_troops/dark-elixir/lava-hound.png',
    'Minion': '/assets/_troops/dark-elixir/minion.png',
    'Valkyrie': '/assets/_troops/dark-elixir/valkyrie.png',
    'Witch': '/assets/_troops/dark-elixir/witch.png',
    'Bat Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Bat.png',
    'Earthquake Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Earthquake.png',
    'Haste Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Haste.png',
    'Poison Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Poison.png',
    'Skeleton Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Skeleton.png',
    'Overgrowth Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Overgrowth.png',
    'Clone Spell': '/assets/_spells/elixir/Icon_HV_Spell_Clone.png',
    'Freeze Spell': '/assets/_spells/elixir/Icon_HV_Spell_Freeze_new.png',
    'Healing Spell': '/assets/_spells/elixir/Icon_HV_Spell_Heal.png',
    'Invisibility Spell': '/assets/_spells/elixir/Icon_HV_Spell_Invisibility.png',
    'Jump Spell': '/assets/_spells/elixir/Icon_HV_Spell_Jump.png',
    'Lightning Spell': '/assets/_spells/elixir/Icon_HV_Spell_Lightning_new.png',
    'Rage Spell': '/assets/_spells/elixir/Icon_HV_Spell_Rage.png',
    'Recall Spell': '/assets/_spells/elixir/Icon_HV_Spell_Recall.png',
    'Revive Spell': '/assets/_spells/elixir/Icon_HV_Spell_Revive.png',
};

interface TroopGuideProps {
    villageState: VillageState;
}

export function TroopGuide({ villageState }: TroopGuideProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<SuggestArmyOutput | null>(null);
    const { toast } = useToast();

    const homeItems = (villageState.troops || []).filter(t => t.village === 'home');
    const homeTroopsForAI = homeItems.filter(t => t.id.startsWith('troop-'));

    const elixirTroops = homeItems.filter(t => t.id.startsWith('troop-') && t.elixirType === 'regular').sort((a,b) => a.name.localeCompare(b.name));
    const darkTroops = homeItems.filter(t => t.id.startsWith('troop-') && t.elixirType === 'dark').sort((a,b) => a.name.localeCompare(b.name));
    const elixirSpells = homeItems.filter(t => t.id.startsWith('spell-') && t.elixirType === 'regular').sort((a,b) => a.name.localeCompare(b.name));
    const darkSpells = homeItems.filter(t => t.id.startsWith('spell-') && t.elixirType === 'dark').sort((a,b) => a.name.localeCompare(b.name));
    
    const troopCategories = [
        { title: 'Elixir Troops', data: elixirTroops, icon: Droplet },
        { title: 'Dark Elixir Troops', data: darkTroops, icon: FlaskConical },
        { title: 'Elixir Spells', data: elixirSpells, icon: Zap },
        { title: 'Dark Elixir Spells', data: darkSpells, icon: Skull }
    ].filter(c => c.data.length > 0);

    const handleSuggestArmy = async () => {
        setIsLoading(true);
        setSuggestion(null);

        try {
            const input: SuggestArmyInput = {
                townHallLevel: villageState.townHallLevel,
                troops: homeTroopsForAI.map(t => ({ name: t.name, level: t.level })),
            };
            const result = await suggestArmy(input);
            setSuggestion(result);
        } catch (error) {
            console.error("Failed to get army suggestion:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch army suggestion. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <Card className='themed-card'>
                <CardHeader>
                    <CardTitle className="font-headline">AI Army Advisor</CardTitle>
                    <CardDescription>Get a powerful army composition suggestion based on your troop levels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSuggestArmy} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                        Suggest Army Composition
                    </Button>

                    {suggestion && (
                        <Alert className="mt-6 bg-background/50">
                            <AlertTitle className="font-headline flex items-center">
                                <Wand2 className="mr-2" />
                                {suggestion.armyName}
                            </AlertTitle>
                            <AlertDescription>
                                <p className="mb-4">{suggestion.description}</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {suggestion.units.map((unit, index) => (
                                        <li key={index}><strong>{unit.count}x</strong> {unit.name}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card className='themed-card'>
                <CardHeader>
                    <CardTitle className="font-headline">Army Compendium</CardTitle>
                    <CardDescription>An overview of all your unlocked troops and spells.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={troopCategories.map(c => c.title)} className="w-full">
                        {troopCategories.map(({ title, data, icon: Icon }) => (
                            <AccordionItem value={title} key={title} className="border-green-500/20">
                                <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className='text-xl font-headline tracking-wide'>{title}</span>
                                        <span className="text-sm font-normal text-muted-foreground">({data.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2">
                                        {data.map(item => {
                                            const imagePath = nameToPathMap[item.name] || defaultImagePath;
                                            return (
                                                <div key={item.id} className="p-3 rounded-xl border bg-card/60 hover:shadow-lg transition-shadow flex flex-col gap-2 hover:-translate-y-1">
                                                    <Image
                                                        src={imagePath}
                                                        alt={item.name}
                                                        width={128}
                                                        height={128}
                                                        className="rounded-md self-center aspect-square object-contain bg-muted/20"
                                                        unoptimized
                                                    />
                                                    <div className="text-center mt-1">
                                                        <p className="font-bold text-card-foreground">{item.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Level {item.level} / {item.maxLevel}
                                                        </p>
                                                    </div>
                                                    <Progress value={(item.level / item.maxLevel) * 100} className="h-2" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
