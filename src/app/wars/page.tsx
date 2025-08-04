
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Swords, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getSavedArmyCompositions } from '@/lib/firebase-service';
import { getImagePath } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/loading-spinner';

const ItemTypes = {
  UNIT: 'unit',
};

interface Unit {
  name: string;
  image: string;
}

interface DraggableUnitProps {
  unit: Unit;
}

const DraggableUnit = ({ unit }: DraggableUnitProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UNIT,
    item: unit,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex items-center gap-2 p-1 bg-muted/50 rounded-md text-xs cursor-grab transition-opacity",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <Image src={unit.image} alt={unit.name} width={24} height={24} unoptimized />
      <span>{unit.name}</span>
    </div>
  );
};


interface GridCellProps {
  x: number;
  y: number;
  unit: Unit | null;
  onDropUnit: (x: number, y: number, unit: Unit) => void;
}

const GridCell = ({ x, y, unit, onDropUnit }: GridCellProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.UNIT,
        drop: (item: Unit) => onDropUnit(x, y, item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [x, y, onDropUnit]);

    const isSpell = unit?.name.toLowerCase().includes('spell');

    return (
        <div ref={drop} className={cn("border border-white/10 relative", isOver && "bg-primary/20")}>
           {unit && (
               <>
                   {isSpell ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Circle for spell radius */}
                            <div className="absolute bg-primary/30 rounded-full" style={{ width: '250%', height: '250%' }}></div>
                             {/* Spell icon on top */}
                            <div className="relative w-full h-full p-0.5">
                                <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain" unoptimized/>
                            </div>
                        </div>
                   ) : (
                        <div className="relative w-full h-full p-0.5">
                            <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain" unoptimized/>
                        </div>
                   )}
               </>
           )}
        </div>
    );
};


const StrategyBoard = () => {
    const [placedUnits, setPlacedUnits] = useState<Record<string, Unit>>({});

    const handleDropUnit = useCallback((x: number, y: number, unit: Unit) => {
        const key = `${x}-${y}`;
        setPlacedUnits(prev => ({ ...prev, [key]: unit }));
    }, []);

    const gridCells = Array.from({ length: 44 * 44 });

    return (
        <div className="relative w-full aspect-square max-w-[800px] mx-auto">
            <Image
                src="/assets/scenaries-war.jpg"
                alt="War Base Layout"
                data-ai-hint="clash of clans war base"
                layout="fill"
                className="object-cover rounded-lg"
                unoptimized
            />
            <div className="absolute inset-0 grid grid-cols-44 grid-rows-44">
                {gridCells.map((_, index) => {
                     const x = index % 44;
                     const y = Math.floor(index / 44);
                     const key = `${x}-${y}`;
                     const unit = placedUnits[key] || null;
                    return <GridCell key={key} x={x} y={y} unit={unit} onDropUnit={handleDropUnit} />;
                })}
            </div>
        </div>
    );
};

const SavedArmiesPanel = () => {
    const { user } = useAuth();
    const [compositions, setCompositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchArmies = async () => {
            try {
                const comps = await getSavedArmyCompositions(user.uid);
                setCompositions(comps);
            } catch (error) {
                console.error("Failed to fetch armies:", error);
                toast({ variant: 'destructive', title: "Error", description: "Could not load your saved armies." });
            } finally {
                setLoading(false);
            }
        };

        fetchArmies();

    }, [user, toast]);

    return (
        <Card>
            <CardHeader><CardTitle>Your Armies</CardTitle><CardDescription>Drag units from your saved armies onto the board.</CardDescription></CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center p-4">
                        <Loader2 className="animate-spin mr-2" />
                        <span>Loading Armies...</span>
                    </div>
                )}
                {!loading && compositions.length === 0 && (
                     <Alert>
                        <AlertTitle>No Armies Found</AlertTitle>
                        <AlertDescription>
                          You haven't saved any armies yet. Go to the <Button asChild variant="link" className="p-0"><Link href="/war-council">War Council</Link></Button> to build and save your first army!
                        </AlertDescription>
                    </Alert>
                )}
                {!loading && compositions.length > 0 && (
                     <Accordion type="multiple" className="w-full">
                        {compositions.map((comp) => (
                             <AccordionItem key={comp.id} value={comp.id}>
                                <AccordionTrigger>{comp.name}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3">
                                         {comp.heroes?.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm mb-2">Heroes</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {comp.heroes.map((hero: any, index: number) => (
                                                        <DraggableUnit key={`hero-${index}-${hero.name}`} unit={{ name: hero.name, image: getImagePath(hero.name) }} />
                                                    ))}
                                                </div>
                                            </div>
                                         )}
                                        {comp.troops?.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-sm mb-2">Troops</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {comp.troops.map((troop: any, index: number) => (
                                                        <DraggableUnit key={`troop-${index}-${troop.name}`} unit={{ name: `${troop.quantity}x ${troop.name}`, image: getImagePath(troop.name) }} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {comp.spells?.length > 0 && (
                                            <div>
                                                 <h4 className="font-bold text-sm mt-2">Spells</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {comp.spells.map((spell: any, index: number) => (
                                                        <DraggableUnit key={`spell-${index}-${spell.name}`} unit={{ name: `${spell.quantity}x ${spell.name}`, image: getImagePath(spell.name) }} />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {comp.siegeMachine && (
                                            <div>
                                                <h4 className="font-bold text-sm mt-2">Siege Machine</h4>
                                                 <DraggableUnit unit={{ name: comp.siegeMachine.name, image: getImagePath(comp.siegeMachine.name) }} />
                                            </div>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
};


export default function WarsPage() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner show={true} />;
    }

    if (!user) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You must be signed in to access the Strategy Board.
                    <Button asChild variant="link" className="p-0"><Link href="/sign-in">Sign In</Link></Button>
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-3xl">
                            <Shield className="w-8 h-8 text-primary" />
                            Strategy Board
                        </CardTitle>
                        <CardDescription>Plan your attacks by dragging units from your saved armies onto the board.</CardDescription>
                    </CardHeader>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2">
                       <StrategyBoard />
                    </div>
                    <div className="space-y-4">
                       <SavedArmiesPanel />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
