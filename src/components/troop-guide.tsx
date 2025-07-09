
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

interface TroopGuideProps {
    villageState: VillageState;
}

const troopImageMap: Record<string, string> = {
    // Elixir Troops
    'Barbarian': '/images/troops/barbarian.png',
    'Archer': '/images/troops/archer.png',
    'Giant': '/images/troops/giant.png',
    'Goblin': '/images/troops/goblin.png',
    'Wall Breaker': '/images/troops/wall_breaker.png',
    'Balloon': '/images/troops/balloon.png',
    'Wizard': '/images/troops/wizard.png',
    'Healer': '/images/troops/healer.png',
    'Dragon': '/images/troops/dragon.png',
    'Pekka': '/images/troops/pekka.png',
    'Baby Dragon': '/images/troops/baby_dragon.png',
    'Miner': '/images/troops/miner.png',
    'Electro Titan': '/images/troops/electro_titan.png',
    'Root Rider': '/images/troops/root_rider.png',
    
    // Dark Elixir Troops
    'Minion': '/images/troops/minion.png',
    'Hog Rider': '/images/troops/hog_rider.png',
    'Valkyrie': '/images/troops/valkyrie.png',
    'Golem': '/images/troops/golem.png',
    'Witch': '/images/troops/witch.png',
    'Lava Hound': '/images/troops/lava_hound.png',
    'Bowler': '/images/troops/bowler.png',
    'Ice Golem': '/images/troops/ice_golem.png',
    'Headhunter': '/images/troops/headhunter.png',
    'Apprentice Warden': '/images/troops/apprentice_warden.png',
    
    // Elixir Spells
    'Lightning Spell': '/images/troops/lightning_spell.png',
    'Healing Spell': '/images/troops/healing_spell.png',
    'Rage Spell': '/images/troops/rage_spell.png',
    'Jump Spell': '/images/troops/jump_spell.png',
    'Freeze Spell': '/images/troops/freeze_spell.png',
    'Clone Spell': '/images/troops/clone_spell.png',
    'Invisibility Spell': '/images/troops/invisibility_spell.png',
    'Recall Spell': '/images/troops/recall_spell.png',
    
    // Dark Elixir Spells
    'Poison Spell': '/images/troops/poison_spell.png',
    'Earthquake Spell': '/images/troops/earthquake_spell.png',
    'Haste Spell': '/images/troops/haste_spell.png',
    'Skeleton Spell': '/images/troops/skeleton_spell.png',
    'Bat Spell': '/images/troops/bat_spell.png',
};

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
        <div className="space-y-8">
            <Card>
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
                        <Alert className="mt-6">
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

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Army Compendium</CardTitle>
                    <CardDescription>An overview of all your unlocked troops and spells.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={troopCategories.map(c => c.title)} className="w-full">
                        {troopCategories.map(({ title, data, icon: Icon }) => (
                            <AccordionItem value={title} key={title}>
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
                                        {data.map(item => (
                                            <div key={item.id} className="p-3 rounded-xl border bg-card/60 hover:shadow-lg transition-shadow flex flex-col gap-2 hover:-translate-y-1">
                                                <Image
                                                    src={troopImageMap[item.name] || '/images/troops/default.png'}
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
                                        ))}
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
