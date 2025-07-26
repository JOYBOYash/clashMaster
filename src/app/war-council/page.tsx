
'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Dices, Swords, Loader2, Castle, Droplets, FlaskConical, Sparkles, X, Users, SpellCheck, Settings, CheckCircle, Bookmark } from 'lucide-react';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getImagePath, superTroopNames, siegeMachineNames } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { suggestWarArmy, type SuggestWarArmyInput, type SuggestWarArmyOutput } from '@/ai/flows/suggest-war-army';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/context/auth-context';
import { saveArmyComposition, saveAIStrategy } from '@/lib/firebase-service';

const UnitCard = ({ item, isHero = false, ...props }: { item: any; isHero?: boolean;[key: string]: any }) => {
    const isSuper = superTroopNames.includes(item.name);
    const isSiege = siegeMachineNames.includes(item.name);
    
    return (
        <div
            className={cn(
                "group relative w-full mx-auto overflow-hidden rounded-lg transition-all duration-300",
                "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent",
                "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50",
                isHero ? "aspect-[3/5] max-w-[120px]" : "aspect-[4/5] max-w-[100px]"
            )}
            {...props}
        >
            <div className="absolute inset-0 rounded-lg border-2 border-[hsl(var(--hero-card-border-secondary))] pointer-events-none"></div>
            <div className="absolute inset-2 rounded-sm border border-[hsl(var(--hero-card-border))] pointer-events-none"></div>

            {(isSuper || isSiege) && (
                <div className="absolute top-1.5 right-1.5 bg-black/30 p-1 rounded-full z-10">
                    {isSuper && <Sparkles className="w-3 h-3 text-orange-400" />}
                    {isSiege && <Castle className="w-3 h-3 text-stone-500" />}
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
                    <h3 className="font-headline text-sm md:text-base text-foreground/90 text-shadow-custom truncate">{item.name}</h3>
                    {!isHero && <p className="font-bold text-xs md:text-sm text-primary leading-tight">Lvl {item.level}</p>}
                    <Progress value={(item.level / item.maxLevel) * 100} className="mt-1 h-0.5 bg-black/20" />
                </div>
            </div>
        </div>
    );
};

const CompositionUnitCard = ({ item, count, onRemove }: { item: any; count: number; onRemove: () => void }) => {
    return (
        <div className="relative group cursor-pointer" onClick={onRemove}>
             <div className="aspect-square bg-black/20 rounded-md p-1 border border-border transition-all hover:border-primary/80 hover:scale-105">
                <Image src={getImagePath(item.name)} alt={item.name} width={64} height={64} unoptimized className="w-full h-full object-contain" />
            </div>
             <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
                {count}
            </div>
            <button className="absolute -top-1 -right-1 z-20 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3" />
            </button>
        </div>
    );
};

const StrategyStep = ({ step }: { step: any }) => {
    const hasImage = step.unitName && step.unitName !== 'General';
    const imagePath = hasImage ? getImagePath(step.unitName) : '';

    return (
        <div className="flex items-start gap-4 py-3">
            {hasImage && (
                 <div className="relative shrink-0 w-16 h-16 bg-black/20 rounded-md p-1 border border-border">
                    <Image src={imagePath} alt={step.unitName} fill className="object-contain" unoptimized />
                </div>
            )}
            {!hasImage && (
                 <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-black/20 rounded-md border border-border">
                    <CheckCircle className="w-8 h-8 text-primary/50" />
                 </div>
            )}
            <div className="flex-grow">
                <h5 className="font-bold font-headline">{step.title}</h5>
                <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
        </div>
    )
}


export default function WarCouncilPage() {
    const { user } = useAuth();
    const [player, setPlayer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const [maxTroopSpace, setMaxTroopSpace] = useState(300);
    const [maxSpellSpace, setMaxSpellSpace] = useState(11);
    const [armyNameToSave, setArmyNameToSave] = useState('');
    const [loadedArmyId, setLoadedArmyId] = useState<string | null>(null);

    const [availableUnits, setAvailableUnits] = useState<any>({
        heroes: [], elixirTroops: [], darkElixirTroops: [], superTroops: [], siegeMachines: [], elixirSpells: [], darkElixirSpells: []
    });
    
    const [army, setArmy] = useState<Record<string, { unit: any, quantity: number }>>({});
    const [spells, setSpells] = useState<Record<string, { unit: any, quantity: number }>>({});
    const [heroes, setHeroes] = useState<any[]>([]);
    const [siegeMachine, setSiegeMachine] = useState<any | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('heroes');

    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState<SuggestWarArmyOutput | null>(null);

    const pressTimer = useRef<NodeJS.Timeout>();

    const loadComposition = useCallback((composition: any) => {
        if (!composition || !availableUnits || availableUnits.heroes.length === 0) return;

        setLoadedArmyId(composition.id || null);
        const allPlayerUnits = [
            ...availableUnits.heroes, ...availableUnits.elixirTroops, ...availableUnits.darkElixirTroops,
            ...availableUnits.superTroops, ...availableUnits.siegeMachines, ...availableUnits.elixirSpells,
            ...availableUnits.darkElixirSpells
        ];

        const newArmy: Record<string, { unit: any, quantity: number }> = {};
        composition.troops?.forEach((troop: any) => {
            const unitData = allPlayerUnits.find(u => u.name === troop.name);
            if (unitData) newArmy[troop.name] = { unit: unitData, quantity: troop.quantity };
        });
        setArmy(newArmy);

        const newSpells: Record<string, { unit: any, quantity: number }> = {};
        composition.spells?.forEach((spell: any) => {
            const unitData = allPlayerUnits.find(u => u.name === spell.name);
            if (unitData) newSpells[spell.name] = { unit: unitData, quantity: spell.quantity };
        });
        setSpells(newSpells);
        
        let availableHeroes = [...availableUnits.heroes];
        const newHeroes: any[] = [];
        composition.heroes?.forEach((hero: any) => {
            const heroIndex = availableHeroes.findIndex(h => h.name === hero.name);
            if (heroIndex !== -1) {
                newHeroes.push(availableHeroes.splice(heroIndex, 1)[0]);
            }
        });
        setHeroes(newHeroes);

        let availableSiegeMachines = [...availableUnits.siegeMachines];
         if (siegeMachine) {
            availableSiegeMachines.push(siegeMachine);
        }

        if (composition.siegeMachine) {
            const smIndex = availableSiegeMachines.findIndex((s:any) => s.name === composition.siegeMachine.name);
            if (smIndex !== -1) {
                setSiegeMachine(availableSiegeMachines[smIndex]);
                availableSiegeMachines.splice(smIndex, 1);
            }
        } else {
            setSiegeMachine(null);
        }

        setAvailableUnits((prev: any) => ({ ...prev, heroes: availableHeroes, siegeMachines: availableSiegeMachines }));
        toast({ title: "Army Loaded", description: `"${composition.name}" is ready.` });

    }, [availableUnits, toast, siegeMachine]);

    useEffect(() => {
        const playerData = localStorage.getItem('playerData');
        const savedTroopSpace = localStorage.getItem('maxTroopSpace');
        const savedSpellSpace = localStorage.getItem('maxSpellSpace');

        if (playerData) {
            setPlayer(JSON.parse(playerData));
        }
        if (savedTroopSpace) {
            setMaxTroopSpace(parseInt(savedTroopSpace, 10));
        }
        if (savedSpellSpace) {
            setMaxSpellSpace(parseInt(savedSpellSpace, 10));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('maxTroopSpace', maxTroopSpace.toString());
    }, [maxTroopSpace]);

    useEffect(() => {
        localStorage.setItem('maxSpellSpace', maxSpellSpace.toString());
    }, [maxSpellSpace]);


    useEffect(() => {
        if (!player) return;

        const allHomeTroops = (player.troops || []).filter((t: any) => t.village === 'home' && t.level > 0);
        const homeHeroes = (player.heroes || []).filter((h: any) => h.village === 'home' && h.level > 0);
        const homeSpells = (player.spells || []).filter((s: any) => s.village === 'home' && s.level > 0);

        setAvailableUnits({
            heroes: homeHeroes,
            elixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Elixir' && !superTroopNames.includes(t.name) && !siegeMachineNames.includes(t.name)),
            darkElixirTroops: allHomeTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir' && !superTroopNames.includes(t.name)),
            superTroops: allHomeTroops.filter((t: any) => superTroopNames.includes(t.name) && t.level > 0),
            siegeMachines: allHomeTroops.filter((t: any) => siegeMachineNames.includes(t.name)),
            elixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Elixir'),
            darkElixirSpells: homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir'),
        });
    }, [player]);

    useEffect(() => {
        const compositionToLoad = localStorage.getItem('loadArmyComposition');
        if (compositionToLoad && availableUnits.heroes.length > 0) {
            try {
                const parsedComp = JSON.parse(compositionToLoad);
                loadComposition(parsedComp);
            } catch (e) {
                console.error("Failed to parse or load composition:", e);
            } finally {
                localStorage.removeItem('loadArmyComposition');
            }
        }
    }, [availableUnits, loadComposition]);


    const currentTroopSpace = useMemo(() => {
        const armySpace = Object.values(army).reduce((acc, { unit, quantity }) => acc + (unit.housingSpace * quantity), 0);
        const siegeSpace = siegeMachine?.housingSpace || 0;
        return armySpace + siegeSpace;
    }, [army, siegeMachine]);

    const currentSpellSpace = useMemo(() => {
        return Object.values(spells).reduce((acc, { unit, quantity }) => acc + (unit.housingSpace * quantity), 0);
    }, [spells]);

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
    
    const removeFromArmy = useCallback((name: string) => {
        setLoadedArmyId(null);
        setArmy(prev => {
            const newArmy = { ...prev };
            if (newArmy[name]) {
                newArmy[name].quantity -= 1;
                if (newArmy[name].quantity <= 0) {
                    delete newArmy[name];
                }
            }
            return newArmy;
        });
    }, []);
    
    const removeFromSpells = useCallback((name: string) => {
        setLoadedArmyId(null);
         setSpells(prev => {
            const newSpells = { ...prev };
            if (newSpells[name]) {
                newSpells[name].quantity -= 1;
                if (newSpells[name].quantity <= 0) {
                    delete newSpells[name];
                }
            }
            return newSpells;
        });
    }, []);
    
    const removeFromHeroes = useCallback((name: string) => {
        setLoadedArmyId(null);
        const heroToRemove = heroes.find(h => h.name === name);
        if (heroToRemove) {
            setHeroes(prev => prev.filter(h => h.name !== name));
            setAvailableUnits((prev:any) => ({ ...prev, heroes: [...prev.heroes, heroToRemove].sort((a,b) => a.name.localeCompare(b.name)) }));
        }
    }, [heroes]);
    
    const removeSiegeMachine = useCallback(() => {
        setLoadedArmyId(null);
        if(siegeMachine) {
            setAvailableUnits((prev:any) => ({...prev, siegeMachines: [...prev.siegeMachines, siegeMachine].sort((a,b) => a.name.localeCompare(b.name))}));
            setSiegeMachine(null);
        }
    }, [siegeMachine]);


    const addUnit = useCallback((itemData: any) => {
        setLoadedArmyId(null);
        const { name } = itemData;

        if (isUnitType(itemData, 'troop')) {
            if (currentTroopSpace + itemData.housingSpace > maxTroopSpace) {
                toast({ variant: 'destructive', title: 'Troop space full!' });
                return false;
            }
            setArmy(prev => {
                const newArmy = { ...prev };
                if (newArmy[name]) {
                    newArmy[name].quantity += 1;
                } else {
                    newArmy[name] = { unit: itemData, quantity: 1 };
                }
                return newArmy;
            });
        } else if (isUnitType(itemData, 'spell')) {
             if (currentSpellSpace + itemData.housingSpace > maxSpellSpace) {
                toast({ variant: 'destructive', title: 'Spell space full!' });
                return false;
            }
            setSpells(prev => {
                const newSpells = { ...prev };
                if (newSpells[name]) {
                    newSpells[name].quantity += 1;
                } else {
                    newSpells[name] = { unit: itemData, quantity: 1 };
                }
                return newSpells;
            });
        }
        return true;
    }, [currentTroopSpace, currentSpellSpace, maxTroopSpace, maxSpellSpace, toast]);

    const handleMouseUp = () => {
        if(pressTimer.current) clearTimeout(pressTimer.current);
    };

    const handleMouseDown = (item: any) => {
        const addAndRepeat = () => {
           const success = addUnit(item);
           if(success) {
             pressTimer.current = setTimeout(addAndRepeat, 150);
           }
        }
        addAndRepeat();
    };

    const handleDrop = (e: React.DragEvent, dropZoneType: string) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData('item'));
        const { name, origin, category } = itemData;
        
        setLoadedArmyId(null);

        if (dropZoneType === 'selection') {
            if (origin === 'composition') {
                 if (isUnitType(itemData, 'hero')) removeFromHeroes(name);
                 else if (isUnitType(itemData, 'siege')) removeSiegeMachine();
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

        if (dropZoneType === 'hero') {
            if (heroes.length < 4 && !heroes.find(h => h.name === name)) {
                setHeroes(prev => [...prev, itemData]);
                setAvailableUnits((prev: any) => ({...prev, heroes: prev.heroes.filter((h:any) => h.name !== name)}));
            } else {
                toast({ variant: 'destructive', title: 'Hero already added or slots are full.' });
            }
        } else if (dropZoneType === 'siege') {
            if (siegeMachine) {
                 setAvailableUnits((prev:any) => ({...prev, siegeMachines: [...prev.siegeMachines, siegeMachine].sort((a,b) => a.name.localeCompare(b.name))}));
            }
            setSiegeMachine(itemData);
            setAvailableUnits((prev: any) => ({...prev, siegeMachines: prev.siegeMachines.filter((s:any) => s.name !== name)}));
        } else {
            addUnit(itemData);
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    
    const handleGeneratePlan = async () => {
        if (Object.keys(army).length === 0 && heroes.length === 0) {
            toast({ variant: 'destructive', title: 'Cannot generate plan', description: 'Please add some units to your army.' });
            return;
        }

        setAiLoading(true); setAiResult(null);
        
        const input: SuggestWarArmyInput = {
            townHallLevel: player.townHallLevel,
            troops: Object.values(army).map(({unit, quantity}) => ({
                name: unit.name,
                level: unit.level,
                quantity: quantity,
            })),
            spells: Object.values(spells).map(({unit, quantity}) => ({
                name: unit.name,
                level: unit.level,
                quantity: quantity,
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

    const handleSaveArmy = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Signed In', description: 'You must be signed in to save an army.' });
            return;
        }
         if (!armyNameToSave) {
            toast({ variant: 'destructive', title: 'Name Required', description: 'Please enter a name for your army.' });
            return;
        }
        
        const composition = {
            name: armyNameToSave,
            troops: Object.values(army).map(({unit, quantity}) => ({ name: unit.name, level: unit.level, quantity })),
            spells: Object.values(spells).map(({unit, quantity}) => ({ name: unit.name, level: unit.level, quantity })),
            heroes: heroes.map(h => ({ name: h.name, level: h.level })),
            siegeMachine: siegeMachine ? { name: siegeMachine.name, level: siegeMachine.level } : null,
            townHallLevel: player.townHallLevel,
        };

        try {
            const savedId = await saveArmyComposition(user.uid, composition);
            setLoadedArmyId(savedId);
            toast({ title: 'Army Saved!', description: `"${armyNameToSave}" has been saved to your cookbook.`});
        } catch (error) {
            console.error("Failed to save army:", error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save army to your cookbook.'});
        }
    };

    const handleSaveStrategy = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not Signed In', description: 'You must be signed in to save a strategy.' });
            return;
        }
        if (!aiResult) {
            toast({ variant: 'destructive', title: 'No Strategy', description: 'Generate a strategy before saving.' });
            return;
        }

        try {
            await saveAIStrategy(user.uid, aiResult);
            toast({ title: 'Strategy Saved!', description: `"${aiResult.armyName}" strategy saved.` });
        } catch (error) {
            console.error("Failed to save strategy:", error);
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the AI strategy.' });
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
            <Card><CardHeader><CardTitle>Council</CardTitle><CardDescription>Assemble your army, plan your attack, and get AI-powered strategic advice.</CardDescription></CardHeader></Card>

            <div className="flex flex-col gap-8 items-start">
                <Card className="w-full" no-hover>
                    <CardHeader>
                         <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2"><Swords className="w-6 h-6 text-primary" /><span>Army Composition</span></CardTitle>
                            
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" disabled={Object.keys(army).length === 0 || !!loadedArmyId}>
                                        <Bookmark className="mr-2 h-4 w-4" /> Save Army
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Save Army Composition</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Give this army a name to save it to your cookbook for later.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="py-4">
                                        <Label htmlFor="army-name">Army Name</Label>
                                        <Input id="army-name" placeholder="e.g., Queen Charge Hybrid" value={armyNameToSave} onChange={(e) => setArmyNameToSave(e.target.value)} />
                                    </div>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSaveArmy}>Save</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2 rounded-lg border bg-card/50 p-4">
                             <h4 className="font-headline text-lg flex items-center gap-2"><Settings />Capacity Settings</h4>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="troop-space">Troop Space</Label>
                                    <Input id="troop-space" type="number" value={maxTroopSpace} onChange={e => setMaxTroopSpace(parseInt(e.target.value) || 0)} />
                                </div>
                                <div>
                                    <Label htmlFor="spell-space">Spell Space</Label>
                                    <Input id="spell-space" type="number" value={maxSpellSpace} onChange={e => setMaxSpellSpace(parseInt(e.target.value) || 0)} />
                                </div>
                             </div>
                        </div>

                        <div onDrop={(e) => handleDrop(e, 'troop')} onDragOver={handleDragOver}><div className="flex justify-between items-center mb-2"><h4 className="font-headline text-lg flex items-center gap-2"><Users /> Troops</h4><span className="font-mono text-sm">{currentTroopSpace}/{maxTroopSpace}</span></div><div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[8rem] border-2 border-dashed">{Object.values(army).map(({unit, quantity}) => (<CompositionUnitCard key={unit.name} item={unit} count={quantity} onRemove={() => removeFromArmy(unit.name)} />))}</div></div>
                        <div onDrop={(e) => handleDrop(e, 'spell')} onDragOver={handleDragOver}><div className="flex justify-between items-center mb-2"><h4 className="font-headline text-lg flex items-center gap-2"><SpellCheck /> Spells</h4><span className="font-mono text-sm">{currentSpellSpace}/{maxSpellSpace}</span></div><div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">{Object.values(spells).map(({unit, quantity}) => (<CompositionUnitCard key={unit.name} item={unit} count={quantity} onRemove={() => removeFromSpells(unit.name)} />))}</div></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div onDrop={(e) => handleDrop(e, 'hero')} onDragOver={handleDragOver}><h4 className="font-headline text-lg mb-2">Heroes ({heroes.length}/4)</h4><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed">{heroes.map((item) => (<div key={item.name} className="relative group cursor-grab active:cursor-grabbing"><UnitCard item={item} isHero draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, item, 'composition', 'heroes')} /><button onClick={() => removeFromHeroes(item.name)} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>))}</div></div>
                            <div onDrop={(e) => handleDrop(e, 'siege')} onDragOver={handleDragOver}><h4 className="font-headline text-lg mb-2">Siege Machine ({siegeMachine ? 1 : 0}/1)</h4><div className="p-2 rounded-lg bg-muted/50 min-h-[5rem] border-2 border-dashed flex justify-center items-center">{siegeMachine && (<div className="relative group cursor-grab active:cursor-grabbing"><UnitCard item={siegeMachine} draggable onDragStart={(e: React.DragEvent) => handleDragStart(e, siegeMachine, 'composition', 'siegeMachines')} /><button onClick={removeSiegeMachine} className="absolute -top-1 -right-1 z-10 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button></div>)}</div></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-full" onDrop={(e) => handleDrop(e, 'selection')} onDragOver={handleDragOver} no-hover>
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
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 pb-4">
                            {availableUnits[selectedCategory]?.map((item: any) => (
                                <div
                                    key={item.name}
                                    className="cursor-pointer"
                                    onClick={() => addUnit(item)}
                                    onMouseDown={() => handleMouseDown(item)}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={() => handleMouseDown(item)}
                                    onTouchEnd={handleMouseUp}
                                >
                                    <UnitCard
                                        item={item}
                                        isHero={selectedCategory === 'heroes'}
                                        draggable
                                        onDragStart={(e: React.DragEvent) => handleDragStart(e, item, 'selection', selectedCategory)}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><BrainCircuit className="w-6 h-6 text-primary" /><span>AI Strategy</span></CardTitle>
                        {aiResult && (
                            <Button variant="outline" size="sm" onClick={handleSaveStrategy}><Bookmark className="mr-2 h-4 w-4" /> Save Strategy</Button>
                        )}
                    </div>
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
                           <div className="space-y-4">
                                <h3 className="font-headline text-2xl text-primary text-center">{aiResult.armyName}</h3>
                                <p className="text-sm text-center text-muted-foreground max-w-2xl mx-auto">{aiResult.strategySummary}</p>

                                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                {aiResult.phases.map((phase, index) => (
                                     <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-lg font-headline text-foreground/90">{phase.phaseName}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="divide-y divide-border">
                                                {phase.steps.map((step, stepIndex) => (
                                                    <StrategyStep key={stepIndex} step={step} />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                     </AccordionItem>
                                ))}
                                </Accordion>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    <div>
                                        <h4 className="font-bold font-headline text-lg mb-2 text-green-400">Strengths</h4>
                                        <p className="text-sm text-muted-foreground">{aiResult.strengths}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold font-headline text-lg mb-2 text-red-400">Weaknesses</h4>
                                        <p className="text-sm text-muted-foreground">{aiResult.weaknesses}</p>
                                    </div>
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

    