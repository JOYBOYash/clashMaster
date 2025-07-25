
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Dices, Swords, Loader2, Castle, Droplets, FlaskConical, Sparkles, X, Users, SpellCheck } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getImagePath, superTroopNames, siegeMachineNames } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { suggestWarArmy, type SuggestWarArmyInput, type SuggestWarArmyOutput } from '@/ai/flows/suggest-war-army';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UnitCard = ({ item, isHero = false, ...props }: { item: any; isHero?: boolean;[key: string]: any }) => {
    const isSuper = superTroopNames.includes(item.name);
    const isSiege = siegeMachineNames.includes(item.name);
    
    return (
        <div
            className={cn(
                "group relative w-full max-w-[120px] mx-auto overflow-hidden rounded-lg transition-all duration-300",
                "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent cursor-grab active:cursor-grabbing",
                "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50",
                isHero ? "aspect-[3/5] max-w-[150px]" : "aspect-[4/5]"
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
                 {isHero && (
                     <div className="flex justify-between items-center text-primary/70 px-1">
                        <p className="font-headline text-lg font-bold text-shadow-custom">{item.level}</p>
                    </div>
                 )}
                <div className="relative flex-grow my-1 transition-transform duration-300 group-hover:scale-110">
                    <Image src={getImagePath(item.name)} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
                </div>
                <div className="text-center">
                    <h3 className="font-headline text-base text-foreground/90 text-shadow-custom truncate">{item.name}</h3>
                    {!isHero && <p className="font-bold text-sm text-primary leading-tight">Lvl {item.level}</p>}
                    <Progress value={(item.level / item.maxLevel) * 100} className="mt-1 h-0.5 bg-black/20" />
                </div>
            </div>
        </div>
    );
};


export default function WarCouncilPage() {
    const [player, setPlayer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [availableUnits, setAvailableUnits] = useState<any>({
        heroes: [], elixirTroops: [], darkElixirTroops: [], superTroops: [], siegeMachines: [], elixirSpells: [], darkElixirSpells: []
    });
    
    const [army, setArmy] = useState<any[]>([]);
    const [spells, setSpells] = useState<any[]>([]);
    const [heroes, setHeroes] = useState<any[]>([]);
    const [siegeMachine, setSiegeMachine] = useState<any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('heroes');

    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<SuggestWarArmyOutput | null>(null);

    useEffect(() => {
        const playerData = localStorage.getItem('playerData');
        if (playerData) {
            setPlayer(JSON.parse(playerData));
        }
        setLoading(false);
    }, []);

    const { maxTroopSpace, maxSpellSpace } = useMemo(() => {
        if (!player) return { maxTroopSpace: 0, maxSpellSpace: 0 };
    
        const troopSpaceFromCamps = (player.armyCamps || []).reduce((acc: number, camp: any) => acc + (camp.troopCapacity || 0), 0);
        const troopSpaceFromCastle = player.clanCastle?.troopCapacity || 0;
        const totalTroopSpace = troopSpaceFromCamps + troopSpaceFromCastle;
    
        const spellSpaceFromFactory = player.spellFactory?.spellCapacity || 0;
        const spellSpaceFromDarkFactory = player.darkSpellFactory?.spellCapacity || 0;
        const spellSpaceFromCastle = player.clanCastle?.spellCapacity || 0;
        const totalSpellSpace = spellSpaceFromFactory + spellSpaceFromDarkFactory + spellSpaceFromCastle;
        
        return {
            maxTroopSpace: totalTroopSpace,
            maxSpellSpace: totalSpellSpace,
        };
    }, [player]);

    useEffect(() => {
        if (!player) return;

        const allHomeTroops = (player.troops || []).filter((t: any) => t.village === 'home' && t.level > 0);
        const homeHeroes = (player.heroes || []).filter((h: any) => h.village === 'home' && h.level > 0);
        const homeSpells = (player.spells || []).filter((s: any) => s.village === 'home' && s.level > 0);

        setAvailableUnits({
            heroes: homeHeroes,
            elixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Elixir' && !superTroopNames.includes(t.name) && !siegeMachineNames.includes(t.name)),
            darkElixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir' && !superTroopNames.includes(t.name)),
            superTroops: allHomeTroops.filter((t: any) => superTroopNames.includes(t.name)),
            siegeMachines: allHomeTroops.filter((t: any) => siegeMachineNames.includes(t.name)),
            elixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Elixir'),
            darkElixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir'),
        });
    }, [player]);

    const currentTroopSpace = useMemo(() => army.reduce((acc, t) => acc + (t.housingSpace || 0), 0) + (siegeMachine?.housingSpace || 0), [army, siegeMachine]);
    const currentSpellSpace = useMemo(() => spells.reduce((acc, s) => acc + (s.housingSpace || 0), 0), [spells]);

    const handleDragStart = (e: React.DragEvent, item: any, origin: string, category: string) => {
        e.dataTransfer.setData('item', JSON.stringify({ ...item, origin, category }));
    };

    const isUnitType = (item: any, type: 'hero' | 'spell' | 'siege' | 'troop') => {
        const { category } = item;
        if (type === 'hero') return category === 'heroes';
        if (type === 'spell') return category === 'elixirSpells' || category === 'darkElixirSpells';
        if (type === 'siege') return category === 'siegeMachines';
        if (type === 'troop') return category === 'elixirTroops' || category === 'darkElixirTroops' || category === 'superTroops';
        return false;
    };
    
    const removeFromArmy = useCallback((name: string, index: number) => {
        const itemToRemove = army[index];
        if (itemToRemove?.name === name) {
            setArmy(prev => prev.filter((_, i) => i !== index));
        }
    }, [army]);
    
    const removeFromSpells = useCallback((name: string, index: number) => {
        const itemToRemove = spells[index];
        if(itemToRemove?.name === name) {
            setSpells(prev => prev.filter((_, i) => i !== index));
        }
    }, [spells]);
    
    const removeFromHeroes = useCallback((name: string) => {
        const heroToRemove = heroes.find(h => h.name === name);
        if (heroToRemove) {
            setHeroes(prev => prev.filter(h => h.name !== name));
            setAvailableUnits((prev:any) => ({ ...prev, heroes: [...prev.heroes, heroToRemove] }));
        }
    }, [heroes]);
    
    const removeSiegeMachine = useCallback(() => {
        if(siegeMachine) {
            setAvailableUnits((prev:any) => ({...prev, siegeMachines: [...prev.siegeMachines, siegeMachine]}));
            setSiegeMachine(null);
        }
    }, [siegeMachine]);


    const handleDrop = (e: React.DragEvent, dropZoneType: string) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData('item'));
        const { name, origin, category, index } = itemData;

        // If dragging from composition back to selection panel
        if (dropZoneType === 'selection') {
            if (origin === 'composition') {
                 if (isUnitType(itemData, 'hero')) removeFromHeroes(name);
                 else if (isUnitType(itemData, 'siege')) removeSiegeMachine();
                 else if (isUnitType(itemData, 'spell')) removeFromSpells(name, index);
                 else removeFromArmy(name, index);
            }
            return;
        }
        
        const unitIsHero = isUnitType(itemData, 'hero');
        const unitIsSpell = isUnitType(itemData, 'spell');
        const unitIsSiege = isUnitType(itemData, 'siege');
        const unitIsTroop = isUnitType(itemData, 'troop');

        if ( (dropZoneType === 'hero' && !unitIsHero) || (dropZoneType === 'spell' && !unitIsSpell) || (dropZoneType === 'siege' && !unitIsSiege) || (dropZoneType === 'troop' && !unitIsTroop) ) {
            toast({ variant: 'destructive', title: 'Invalid Drop', description: `Cannot place that unit in this slot.` });
            return;
        }

        if (dropZoneType === 'troop') {
            if (currentTroopSpace + itemData.housingSpace <= maxTroopSpace) setArmy(prev => [...prev, itemData]);
            else toast({ variant: 'destructive', title: 'Troop space full!' });
        } else if (dropZoneType === 'spell') {
            if (currentSpellSpace + itemData.housingSpace <= maxSpellSpace) setSpells(prev => [...prev, itemData]);
            else toast({ variant: 'destructive', title: 'Spell space full!' });
        } else if (dropZoneType === 'hero') {
            if (heroes.length < 4 && !heroes.find(h => h.name === name)) {
                setHeroes(prev => [...prev, itemData]);
                setAvailableUnits((prev: any) => ({...prev, heroes: prev.heroes.filter((h:any) => h.name !== name)}));
            } else {
                toast({ variant: 'destructive', title: 'Hero already added or slots are full.' });
            }
        } else if (dropZoneType === 'siege') {
            if (siegeMachine) {
                 setAvailableUnits((prev:any) => ({...prev, siegeMachines: [...prev.siegeMachines, siegeMachine]}));
            }
            setSiegeMachine(itemData);
            setAvailableUnits((prev: any) => ({...prev, siegeMachines: prev.siegeMachines.filter((s:any) => s.name !== name)}));
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const handleGeneratePlan = async () => {
        if (army.length === 0 && heroes.length === 0) {
            toast({ variant: 'destructive', title: 'Cannot generate plan', description: 'Please add some units to your army.' });
            return;
        }

        setAiLoading(true); setAiResult(null);

        const troopCounts = army.reduce((acc, troop) => ({ ...acc, [troop.name]: (acc[troop.name] || 0) + 1 }), {});
        const spellCounts = spells.reduce((acc, spell) => ({ ...acc, [spell.name]: (acc[spell.name] || 0) + 1 }), {});

        const getUnitLevel = (collection: any[], name: string) => collection.find(u => u.name === name)?.level || 0;

        const input: SuggestWarArmyInput = {
            townHallLevel: player.townHallLevel,
            troops: Object.entries(troopCounts).map(([name, quantity]) => ({
                name,
                level: getUnitLevel(player.troops, name),
                quantity: quantity as number,
            })),
            spells: Object.entries(spellCounts).map(([name, quantity]) => ({
                name,
                level: getUnitLevel(player.spells, name),
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
          <AlertDescription>Please visit the survey page to sync your player data first. <Button asChild className="ml-4"><a href="/survey">Go to Survey</a></Button></AlertDescription>
        </Alert>
    );

    const selectionCategories = [
        { value: 'heroes', label: 'Heroes', icon: <Sparkles className="text-amber-400"/> },
        { value: 'elixirTroops', label: 'Elixir Troops', icon: <Droplets className="text-pink-400"/> },
        { value: 'darkElixirTroops', label: 'Dark Elixir Troops', icon: <FlaskConical className="text-purple-400"/> },
        { value: 'superTroops', label: 'Super Troops', icon: <Sparkles className="text-orange-500" /> },
        { value: 'siegeMachines', label: 'Siege Machines', icon: <Castle className="text-stone-500"/> },
        { value: 'elixirSpells', label: 'Elixir Spells', icon: <SpellCheck className="text-sky-400"/> },
        { value: 'darkElixirSpells', label: 'Dark Elixir Spells', icon: <SpellCheck className="text-indigo-400"/> },
    ];
    
    return (
        <div className="space-y-8">
            <Card><CardHeader><CardTitle>War Council</CardTitle><CardDescription>Assemble your army, plan your attack, and get AI-powered strategic advice.</CardDescription></CardHeader></Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card className="sticky top-20">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Swords className="w-6 h-6 text-primary" /><span>Army Composition</span></CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div onDrop={(e) => handleDrop(e, 'troop')} onDragOver={handleDragOver}><div className="flex justify-between items-center mb-2"><h4 className="font-headline text-lg flex items-center gap-2"><Users /> Troops</h4><span className="font-mono text-sm">{currentTroopSpace}/{maxTroopSpace}</span></div><div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[8rem] border-2 border-dashed">{army.map((item, index) => (<div key={`${item.name}-${index}`} className="relative group"><UnitCard item={item} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, { ...item, index }, 'composition', item.category)}/><button onClick={() => removeFromArmy(item.name, index)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>))}</div></div>
                        <div onDrop={(e) => handleDrop(e, 'spell')} onDragOver={handleDragOver}><div className="flex justify-between items-center mb-2"><h4 className="font-headline text-lg flex items-center gap-2"><SpellCheck /> Spells</h4><span className="font-mono text-sm">{currentSpellSpace}/{maxSpellSpace}</span></div><div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">{spells.map((item, index) => (<div key={`${item.name}-${index}`} className="relative group"><UnitCard item={item} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, { ...item, index }, 'composition', item.category)} /><button onClick={() => removeFromSpells(item.name, index)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>))}</div></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div onDrop={(e) => handleDrop(e, 'hero')} onDragOver={handleDragOver}><h4 className="font-headline text-lg mb-2">Heroes ({heroes.length}/4)</h4><div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">{heroes.map((item) => (<div key={item.name} className="relative group"><UnitCard item={item} isHero draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, item, 'composition', 'heroes')} /><button onClick={() => removeFromHeroes(item.name)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>))}</div></div>
                            <div onDrop={(e) => handleDrop(e, 'siege')} onDragOver={handleDragOver}><h4 className="font-headline text-lg mb-2">Siege Machine ({siegeMachine ? 1 : 0}/1)</h4><div className="p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed flex justify-center items-center">{siegeMachine && (<div className="relative group"><UnitCard item={siegeMachine} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, siegeMachine, 'composition', 'siegeMachines')} /><button onClick={removeSiegeMachine} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>)}</div></div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                     <Card onDrop={(e) => handleDrop(e, 'selection')} onDragOver={handleDragOver}>
                        <CardHeader>
                            <CardTitle>Unit Selection</CardTitle>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                <SelectContent>
                                    {selectionCategories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            <div className="flex items-center gap-2">{cat.icon} {cat.label}</div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="space-y-1">
                             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2 pb-4 max-h-[50vh] overflow-y-auto">
                                {availableUnits[selectedCategory]?.map((item: any) => (
                                    <UnitCard
                                        key={item.name}
                                        item={item}
                                        isHero={selectedCategory === 'heroes'}
                                        draggable
                                        onDragStart={(e: React.DragEvent) => handleDragStart(e, item, 'selection', selectedCategory)}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary" /><span>AI Strategy</span></CardTitle>
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
                                <div><h4 className="font-bold">Strategy</h4><p>{aiResult.strategy}</p></div>
                                <div><h4 className="font-bold">Strengths</h4><p>{aiResult.strengths}</p></div>
                                <div><h4 className="font-bold">Weaknesses</h4><p>{aiResult.weaknesses}</p></div>
                            </div>
                        )}
                        {!aiLoading && !aiResult && <p className="text-muted-foreground text-center">AI suggestions will appear here...</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
