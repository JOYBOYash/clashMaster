
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
    'Barbarian': 'https://static.wikia.nocookie.net/clashofclans/images/0/05/Barbarian-avatar.png',
    'Archer': 'https://static.wikia.nocookie.net/clashofclans/images/c/c5/Archer-avatar.png',
    'Giant': 'https://static.wikia.nocookie.net/clashofclans/images/2/2b/Giant-avatar.png',
    'Goblin': 'https://static.wikia.nocookie.net/clashofclans/images/e/ea/Goblin-avatar.png',
    'Wall Breaker': 'https://static.wikia.nocookie.net/clashofclans/images/1/19/Wall_Breaker-avatar.png',
    'Balloon': 'https://static.wikia.nocookie.net/clashofclans/images/7/79/Balloon-avatar.png',
    'Wizard': 'https://static.wikia.nocookie.net/clashofclans/images/d/d2/Wizard-avatar.png',
    'Healer': 'https://static.wikia.nocookie.net/clashofclans/images/c/c3/Healer-avatar.png',
    'Dragon': 'https://static.wikia.nocookie.net/clashofclans/images/a/a4/Dragon-avatar.png',
    'Pekka': 'https://static.wikia.nocookie.net/clashofclans/images/e/e2/P.E.K.K.A-avatar.png',
    'Baby Dragon': 'https://static.wikia.nocookie.net/clashofclans/images/5/52/Baby_Dragon-avatar.png',
    'Miner': 'https://static.wikia.nocookie.net/clashofclans/images/a/a7/Miner-avatar.png',
    'Electro Titan': 'https://static.wikia.nocookie.net/clashofclans/images/a/ab/Electro_Titan_info.png',
    'Root Rider': 'https://static.wikia.nocookie.net/clashofclans/images/a/ac/Root_Rider_info.png',
    
    // Dark Elixir Troops
    'Minion': 'https://static.wikia.nocookie.net/clashofclans/images/9/91/Minion-avatar.png',
    'Hog Rider': 'https://static.wikia.nocookie.net/clashofclans/images/9/9d/Hog_Rider-avatar.png',
    'Valkyrie': 'https://static.wikia.nocookie.net/clashofclans/images/0/0e/Valkyrie-avatar.png',
    'Golem': 'https://static.wikia.nocookie.net/clashofclans/images/4/47/Golem-avatar.png',
    'Witch': 'https://static.wikia.nocookie.net/clashofclans/images/6/60/Witch-avatar.png',
    'Lava Hound': 'https://static.wikia.nocookie.net/clashofclans/images/6/63/Lava_Hound-avatar.png',
    'Bowler': 'https://static.wikia.nocookie.net/clashofclans/images/d/d1/Bowler-avatar.png',
    'Ice Golem': 'https://static.wikia.nocookie.net/clashofclans/images/c/c9/Ice_Golem-avatar.png',
    'Headhunter': 'https://static.wikia.nocookie.net/clashofclans/images/f/ff/Headhunter_info.png',
    'Apprentice Warden': 'https://static.wikia.nocookie.net/clashofclans/images/c/c5/Apprentice_Warden_info.png',
    
    // Elixir Spells
    'Lightning Spell': 'https://static.wikia.nocookie.net/clashofclans/images/3/3f/Lightning_Spell_info.png',
    'Healing Spell': 'https://static.wikia.nocookie.net/clashofclans/images/7/77/Healing_Spell_info.png',
    'Rage Spell': 'https://static.wikia.nocookie.net/clashofclans/images/3/3a/Rage_Spell_info.png',
    'Jump Spell': 'https://static.wikia.nocookie.net/clashofclans/images/d/d4/Jump_Spell_info.png',
    'Freeze Spell': 'https://static.wikia.nocookie.net/clashofclans/images/5/5e/Freeze_Spell_info.png',
    'Clone Spell': 'https://static.wikia.nocookie.net/clashofclans/images/6/6a/Clone_Spell_info.png',
    'Invisibility Spell': 'https://static.wikia.nocookie.net/clashofclans/images/b/b8/Invisibility_Spell_info.png',
    'Recall Spell': 'https://static.wikia.nocookie.net/clashofclans/images/e/e4/Recall_Spell_info.png',
    
    // Dark Elixir Spells
    'Poison Spell': 'https://static.wikia.nocookie.net/clashofclans/images/5/56/Poison_Spell_info.png',
    'Earthquake Spell': 'https://static.wikia.nocookie.net/clashofclans/images/a/a7/Earthquake_Spell_info.png',
    'Haste Spell': 'https://static.wikia.nocookie.net/clashofclans/images/c/c8/Haste_Spell_info.png',
    'Skeleton Spell': 'https://static.wikia.nocookie.net/clashofclans/images/a/a1/Skeleton_Spell_info.png',
    'Bat Spell': 'https://static.wikia.nocookie.net/clashofclans/images/3/38/Bat_Spell_info.png',
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
                                                    src={troopImageMap[item.name] || 'https://placehold.co/128x128.png'}
                                                    alt={item.name}
                                                    width={128}
                                                    height={128}
                                                    className="rounded-md self-center aspect-square object-contain bg-muted/20"
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
