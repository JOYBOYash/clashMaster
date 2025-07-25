
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Dices, Swords, Loader2, Castle, Droplets, FlaskConical, Sparkles, X, ChevronDown, ChevronUp } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getImagePath, superTroopNames, siegeMachineNames } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { suggestWarArmy, type SuggestWarArmyInput, type SuggestWarArmyOutput } from '@/ai/flows/suggest-war-army';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Re-usable card components from dashboard
const HeroCard = ({ hero, ...props }: { hero: any, [key: string]: any }) => (
    <div
      className={cn(
        "group relative aspect-[3/5] w-full max-w-[150px] mx-auto overflow-hidden rounded-lg transition-all duration-300",
        "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent cursor-grab active:cursor-grabbing",
        "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg border-2 border-[hsl(var(--hero-card-border-secondary))] pointer-events-none"></div>
      <div className="absolute inset-2 rounded-sm border border-[hsl(var(--hero-card-border))] pointer-events-none"></div>
      <div className="relative z-10 flex flex-col h-full p-2">
        <div className="flex justify-between items-center text-primary/70">
            <p className="font-headline text-lg font-bold text-shadow-custom">{hero.level}</p>
        </div>
        <div className="relative flex-grow my-1">
            <Image src={getImagePath(hero.name)} alt={hero.name} fill className="object-contain object-bottom drop-shadow-2xl" unoptimized />
        </div>
        <div className="text-center">
            <h3 className="font-headline text-lg text-foreground/90 text-shadow-custom tracking-wider truncate">{hero.name}</h3>
            <Progress value={(hero.level / hero.maxLevel) * 100} className="mt-1 h-1 bg-black/20" />
        </div>
      </div>
    </div>
);

const TroopSpellCard = ({ item, ...props }: { item: any, [key: string]: any }) => {
    const isSuper = superTroopNames.includes(item.name);
    const isSiege = siegeMachineNames.includes(item.name);
    return (
        <div
            className={cn(
                "group relative aspect-[4/5] w-full max-w-[120px] mx-auto overflow-hidden rounded-lg transition-all duration-300",
                "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent cursor-grab active:cursor-grabbing",
                "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
            )}
            {...props}
        >
            <div className="absolute inset-0 rounded-lg border-2 border-[hsl(var(--hero-card-border-secondary))] pointer-events-none"></div>
            <div className="absolute inset-2 rounded-sm border border-[hsl(var(--hero-card-border))] pointer-events-none"></div>
            {(isSuper || isSiege) && (
                <div className="absolute top-1.5 right-1.5 bg-black/30 p-1 rounded-full z-10">
                    {isSuper && <Sparkles className="w-3 h-3 text-orange-400" />}
                    {isSiege && <Castle className="w-3 h-3 text-stone-400" />}
                </div>
            )}
            <div className="relative z-10 flex flex-col h-full p-1.5">
                <div className="relative flex-grow my-1 transition-transform duration-300 group-hover:scale-110">
                    <Image src={getImagePath(item.name)} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
                </div>
                <div className="text-center">
                    <h3 className="font-headline text-base text-foreground/90 text-shadow-custom truncate">{item.name}</h3>
                    <p className="font-bold text-sm text-primary leading-tight">Lvl {item.level}</p>
                    <Progress value={(item.level / item.maxLevel) * 100} className="mt-1 h-0.5 bg-black/20" />
                </div>
            </div>
        </div>
    );
};

const UnitCategory = ({ title, icon, items, type, isOpen, onToggle }: any) => {
    if (!items || items.length === 0) return null;
    
    const handleDragStart = (e: React.DragEvent, item: any, type: string) => {
        e.dataTransfer.setData('item', JSON.stringify({ ...item, type }));
    };

    return (
        <Collapsible open={isOpen} onOpenChange={onToggle} className="space-y-2 border-b">
            <CollapsibleTrigger asChild>
                 <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    {icon}
                    <h4 className="font-headline text-lg flex-grow">{title}</h4>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        {isOpen ? <ChevronUp className="w-5 h-5"/> : <ChevronDown className="w-5 h-5"/>}
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-4">
                    {items.map((item: any) => (
                       type === 'hero' 
                       ? <HeroCard key={item.name} hero={item} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, item, type)} />
                       : <TroopSpellCard key={item.name} item={item} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, item, type)} />
                    ))}
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};


export default function WarCouncilPage() {
    const [player, setPlayer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Army composition state
    const [army, setArmy] = useState<any[]>([]);
    const [spells, setSpells] = useState<any[]>([]);
    const [heroes, setHeroes] = useState<any[]>([]);
    const [siegeMachine, setSiegeMachine] = useState<any | null>(null);

    // AI state
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<SuggestWarArmyOutput | null>(null);

    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        heroes: true,
        elixirTroops: false,
        darkElixirTroops: false,
        superTroops: false,
        siegeMachines: false,
        elixirSpells: false,
        darkElixirSpells: false,
    });
    
    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        const playerData = localStorage.getItem('playerData');
        if (playerData) {
            setPlayer(JSON.parse(playerData));
        }
        setLoading(false);
    }, []);

    const {
        maxTroopSpace,
        maxSpellSpace,
        homeHeroes,
        elixirTroops,
        darkElixirTroops,
        superTroops,
        homeSiegeMachines,
        elixirSpells,
        darkElixirSpells,
    } = useMemo(() => {
        if (!player) {
            return { maxTroopSpace: 0, maxSpellSpace: 0, homeHeroes: [], elixirTroops: [], darkElixirTroops: [], superTroops: [], homeSiegeMachines: [], elixirSpells: [], darkElixirSpells: [] };
        }
    
        const armyCampLevels: { [key: number]: number } = { 1: 20, 2: 30, 3: 35, 4: 40, 5: 45, 6: 50, 7: 55, 8: 60, 9: 65, 10: 70, 11: 75, 12: 80, 13: 85 };
        const spellFactoryLevels: { [key: number]: number } = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 11, 7: 12 };
        const darkSpellFactoryLevels: { [key: number]: number } = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 };
        
        let totalTroopSpace = 0;
        if(player.townHallLevel >= 1) { // Clan castle troops
            const clanCastle = player.buildings?.find((b: any) => b.name === 'Clan Castle');
            if (clanCastle) {
                totalTroopSpace += clanCastle.troopCapacity || 0;
            }
        }
        (player.armyCamps || []).forEach((camp: any) => {
            totalTroopSpace += armyCampLevels[camp.level] || 0;
        });

        let totalSpellSpace = 0;
        const spellFactory = player.buildings?.find((b: any) => b.name === 'Spell Factory');
        if (spellFactory) totalSpellSpace += spellFactoryLevels[spellFactory.level] || 0;
        
        const darkSpellFactory = player.buildings?.find((b: any) => b.name === 'Dark Spell Factory');
        if (darkSpellFactory) totalSpellSpace += darkSpellFactoryLevels[darkSpellFactory.level] || 0;

        const clanCastle = player.buildings?.find((b: any) => b.name === 'Clan Castle');
        if (clanCastle) {
            totalSpellSpace += clanCastle.spellCapacity || 0;
        }

        const allHomeTroops = player.troops.filter((t: any) => t.village === 'home');
        const homeHeroes = player.heroes.filter((h: any) => h.village === 'home' && h.level > 0);
        const homeSpells = player.spells.filter((s: any) => s.village === 'home' && s.level > 0);

        return {
            maxTroopSpace: totalTroopSpace,
            maxSpellSpace: totalSpellSpace,
            homeHeroes,
            elixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Elixir' && !superTroopNames.includes(t.name) && !siegeMachineNames.includes(t.name)),
            darkElixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir' && !superTroopNames.includes(t.name)),
            superTroops: allHomeTroops.filter((t: any) => superTroopNames.includes(t.name) && t.level > 0),
            homeSiegeMachines: allHomeTroops.filter((t: any) => siegeMachineNames.includes(t.name)),
            elixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Elixir'),
            darkElixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir'),
        };
    }, [player]);

    const currentTroopSpace = useMemo(() => army.reduce((acc, t) => acc + (t.housingSpace || 0), 0), [army]);
    const currentSpellSpace = useMemo(() => spells.reduce((acc, s) => acc + (s.housingSpace || 0), 0), [spells]);

    const handleDrop = (e: React.DragEvent, dropZoneType: string) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData('item'));
        const itemType = itemData.type;

        if (itemType !== dropZoneType) {
            toast({ variant: 'destructive', title: 'Invalid Drop', description: `Cannot place a ${itemType} in the ${dropZoneType} slot.` });
            return;
        }

        if(dropZoneType === 'troop') {
            if (currentTroopSpace + itemData.housingSpace <= maxTroopSpace) {
                setArmy(prev => [...prev, itemData]);
            } else {
                toast({ variant: 'destructive', title: 'Troop space full!' });
            }
        } else if (dropZoneType === 'spell') {
             if (currentSpellSpace + itemData.housingSpace <= maxSpellSpace) {
                setSpells(prev => [...prev, itemData]);
            } else {
                toast({ variant: 'destructive', title: 'Spell space full!' });
            }
        } else if (dropZoneType === 'hero') {
            if (heroes.length < 4 && !heroes.find(h => h.name === itemData.name)) {
                setHeroes(prev => [...prev, itemData]);
            } else {
                toast({ variant: 'destructive', title: 'Hero already added or slots are full.' });
            }
        } else if (dropZoneType === 'siege') {
            setSiegeMachine(itemData);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const removeFromArmy = (index: number) => setArmy(prev => prev.filter((_, i) => i !== index));
    const removeFromSpells = (index: number) => setSpells(prev => prev.filter((_, i) => i !== index));
    const removeFromHeroes = (name: string) => setHeroes(prev => prev.filter(h => h.name !== name));
    const removeSiegeMachine = () => setSiegeMachine(null);

    const handleGeneratePlan = async () => {
        if (army.length === 0 && heroes.length === 0) {
            toast({ variant: 'destructive', title: 'Cannot generate plan', description: 'Please add some units to your army.' });
            return;
        }

        setAiLoading(true);
        setAiResult(null);

        const troopCounts = army.reduce((acc, troop) => {
            acc[troop.name] = (acc[troop.name] || 0) + 1;
            return acc;
        }, {});

        const spellCounts = spells.reduce((acc, spell) => {
            acc[spell.name] = (acc[spell.name] || 0) + 1;
            return acc;
        }, {});

        const input: SuggestWarArmyInput = {
            townHallLevel: player.townHallLevel,
            troops: Object.entries(troopCounts).map(([name, quantity]) => ({
                name,
                level: army.find(t => t.name === name)!.level,
                quantity: quantity as number,
            })),
            spells: Object.entries(spellCounts).map(([name, quantity]) => ({
                name,
                level: spells.find(s => s.name === name)!.level,
                quantity: quantity as number,
            })),
            heroes: heroes.map(h => ({ name: h.name, level: h.level })),
            siegeMachine: siegeMachine?.name,
        };

        try {
            const result = await suggestWarArmy(input);
            setAiResult(result);
        } catch (error) {
            console.error("AI suggestion failed:", error);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to generate a strategy.' });
        } finally {
            setAiLoading(false);
        }
    };


    if (loading) return <LoadingSpinner show={true} />;
    if (!player) return (
        <Alert variant="destructive">
          <AlertTitle>Player Data Not Found</AlertTitle>
          <AlertDescription>
            Please visit the survey page to sync your player data first.
            <Button asChild className="ml-4"><a href="/survey">Go to Survey</a></Button>
          </AlertDescription>
        </Alert>
    );

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>War Council</CardTitle>
                    <CardDescription>Assemble your army, plan your attack, and get AI-powered strategic advice.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Army Composition */}
                <div className="space-y-6">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Swords className="w-6 h-6 text-primary" />
                                <span>Army Composition</span>
                            </CardTitle>
                            <CardDescription>Drag units from the right panel and drop them here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Troops */}
                            <div onDrop={(e) => handleDrop(e, 'troop')} onDragOver={handleDragOver}>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-headline text-lg">Troops</h4>
                                    <span className="font-mono text-sm">{currentTroopSpace}/{maxTroopSpace}</span>
                                </div>
                                <div className="grid grid-cols-5 md:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[8rem] border-2 border-dashed">
                                    {army.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <TroopSpellCard item={item} />
                                            <button onClick={() => removeFromArmy(index)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Spells */}
                            <div onDrop={(e) => handleDrop(e, 'spell')} onDragOver={handleDragOver}>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-headline text-lg">Spells</h4>
                                    <span className="font-mono text-sm">{currentSpellSpace}/{maxSpellSpace}</span>
                                </div>
                                <div className="grid grid-cols-5 md:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">
                                    {spells.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <TroopSpellCard item={item} />
                                            <button onClick={() => removeFromSpells(index)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             {/* Heroes & Siege */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div onDrop={(e) => handleDrop(e, 'hero')} onDragOver={handleDragOver}>
                                    <h4 className="font-headline text-lg mb-2">Heroes ({heroes.length}/4)</h4>
                                    <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">
                                        {heroes.map((item, index) => (
                                            <div key={index} className="relative group">
                                                <HeroCard hero={item} />
                                                 <button onClick={() => removeFromHeroes(item.name)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div onDrop={(e) => handleDrop(e, 'siege')} onDragOver={handleDragOver}>
                                    <h4 className="font-headline text-lg mb-2">Siege Machine ({siegeMachine ? 1 : 0}/1)</h4>
                                    <div className="p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed flex justify-center items-center">
                                       {siegeMachine && (
                                            <div className="relative group">
                                                <TroopSpellCard item={siegeMachine} />
                                                 <button onClick={removeSiegeMachine} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                       )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Unit Selection */}
                <div className="space-y-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Unit Selection</CardTitle>
                            <CardDescription>Click to expand a category, then drag your forces to the composition panel on the left.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <UnitCategory title="Heroes" icon={<Sparkles className="text-amber-400"/>} items={homeHeroes} type="hero" isOpen={openSections.heroes} onToggle={() => toggleSection('heroes')} />
                            <UnitCategory title="Elixir Troops" icon={<Droplets className="text-pink-400"/>} items={elixirTroops} type="troop" isOpen={openSections.elixirTroops} onToggle={() => toggleSection('elixirTroops')} />
                            <UnitCategory title="Dark Elixir Troops" icon={<FlaskConical className="text-purple-400"/>} items={darkElixirTroops} type="troop" isOpen={openSections.darkElixirTroops} onToggle={() => toggleSection('darkElixirTroops')}/>
                            <UnitCategory title="Super Troops" icon={<Sparkles className="text-orange-500" />} items={superTroops} type="troop" isOpen={openSections.superTroops} onToggle={() => toggleSection('superTroops')} />
                            <UnitCategory title="Siege Machines" icon={<Castle className="text-stone-500"/>} items={homeSiegeMachines} type="siege" isOpen={openSections.siegeMachines} onToggle={() => toggleSection('siegeMachines')} />
                            <UnitCategory title="Elixir Spells" icon={<Droplets className="text-pink-400"/>} items={elixirSpells} type="spell" isOpen={openSections.elixirSpells} onToggle={() => toggleSection('elixirSpells')} />
                            <UnitCategory title="Dark Elixir Spells" icon={<FlaskConical className="text-purple-400"/>} items={darkElixirSpells} type="spell" isOpen={openSections.darkElixirSpells} onToggle={() => toggleSection('darkElixirSpells')} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* AI Suggestion Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                        <span>AI Strategy</span>
                    </CardTitle>
                    <CardDescription>Get a customized attack plan for the army you've built.</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <Button size="lg" onClick={handleGeneratePlan} disabled={aiLoading}>
                        {aiLoading ? <Loader2 className="mr-2 animate-spin" /> : <Dices className="mr-2" />}
                        Generate Attack Plan
                    </Button>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg min-h-[10rem] text-left">
                        {aiLoading && <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /> <p className="ml-2 text-muted-foreground">AI is thinking...</p></div>}
                        {aiResult && (
                            <div className="space-y-4 prose prose-sm dark:prose-invert max-w-none">
                                <h3 className="font-headline text-xl text-primary">{aiResult.armyName}</h3>
                                <div>
                                    <h4 className="font-bold">Strategy</h4>
                                    <p>{aiResult.strategy}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold">Strengths</h4>
                                    <p>{aiResult.strengths}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold">Weaknesses</h4>
                                    <p>{aiResult.weaknesses}</p>
                                </div>
                            </div>
                        )}
                        {!aiLoading && !aiResult && <p className="text-muted-foreground text-center">AI suggestions will appear here...</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

