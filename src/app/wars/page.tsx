
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
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
  type: 'troop' | 'spell' | 'hero' | 'siege';
}

const DraggableUnit = ({ unit, type }: DraggableUnitProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UNIT,
    item: { ...unit, type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-1.5 rounded-md text-xs cursor-grab transition-opacity",
        "bg-black/20 border border-border/50 hover:bg-primary/20",
        isDragging ? "opacity-30" : "opacity-100"
      )}
    >
      <div className="relative w-12 h-12">
        <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain" unoptimized />
      </div>
      <span className="text-foreground/80 truncate w-16 text-center">{unit.name}</span>
    </div>
  );
};


interface GridCellProps {
  x: number;
  y: number;
  unit: (Unit & {type: string}) | null;
  onDropUnit: (x: number, y: number, unit: Unit & {type: string}) => void;
}

const GridCell = ({ x, y, unit, onDropUnit }: GridCellProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.UNIT,
        drop: (item: Unit & {type: string}) => onDropUnit(x, y, item),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [x, y, onDropUnit]);

    const isSpell = unit?.type === 'spell';

    return (
        <div ref={drop} className={cn("border border-white/5 relative", isOver && "bg-primary/30")}>
           {unit && (
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   {/* Circle for radius */}
                   <div 
                        className={cn(
                            "absolute rounded-full",
                            isSpell ? 'bg-purple-500/20 border-2 border-purple-400' : 'bg-amber-500/10 border border-amber-400/50'
                        )}
                        style={{ width: '250%', height: '250%' }}
                   ></div>
                    {/* Unit icon on top */}
                   <div className="relative w-full h-full p-0.5">
                       <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain drop-shadow-lg" unoptimized/>
                   </div>
               </div>
           )}
        </div>
    );
};


const StrategyBoard = () => {
    const [placedUnits, setPlacedUnits] = useState<Record<string, Unit & {type: string}>>({});

    const handleDropUnit = useCallback((x: number, y: number, unit: Unit & {type: string}) => {
        const key = `${x}-${y}`;
        setPlacedUnits(prev => ({ ...prev, [key]: unit }));
    }, []);

    const gridCells = Array.from({ length: 44 * 44 });

    return (
        <div className="relative w-full aspect-square max-w-5xl mx-auto">
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

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin mr-2" />
          <span>Loading Your Armies...</span>
        </div>
      )
    }

    if (compositions.length === 0) {
      return (
        <Alert>
          <AlertTitle>No Armies Found</AlertTitle>
          <AlertDescription>
            You haven't saved any armies yet. Go to the <Button asChild variant="link" className="p-0"><Link href="/war-council">War Council</Link></Button> to build and save your first army!
          </AlertDescription>
        </Alert>
      )
    }

    return (
         <Accordion type="single" collapsible className="w-full">
            {compositions.map((comp) => (
                 <AccordionItem key={comp.id} value={comp.id} className="border-b-0">
                    <AccordionTrigger className="bg-muted/30 hover:bg-muted/50 px-4 py-2 rounded-t-lg">
                      <span className="font-headline text-lg">{comp.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 bg-black/20">
                        <div className="flex gap-2 overflow-x-auto p-2">
                             {comp.heroes?.map((hero: any, index: number) => (
                                <DraggableUnit key={`hero-${index}-${hero.name}`} unit={{ name: hero.name, image: getImagePath(hero.name) }} type="hero"/>
                            ))}
                            {comp.troops?.map((troop: any, index: number) => (
                                <DraggableUnit key={`troop-${index}-${troop.name}`} unit={{ name: troop.name, image: getImagePath(troop.name) }} type="troop"/>
                            ))}
                            {comp.spells?.map((spell: any, index: number) => (
                                <DraggableUnit key={`spell-${index}-${spell.name}`} unit={{ name: spell.name, image: getImagePath(spell.name) }} type="spell"/>
                            ))}
                            {comp.siegeMachine && (
                                <DraggableUnit unit={{ name: comp.siegeMachine.name, image: getImagePath(comp.siegeMachine.name) }} type="siege"/>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};


export default function WarsPage() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingSpinner show={true} />;
    }

    if (!user) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You must be signed in to access the Strategy Board.
                        <Button asChild variant="link" className="p-0 h-auto ml-1">
                            <Link href="/sign-in">Sign In</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-[calc(100vh-8rem)]">
                <div className="flex-grow p-4 overflow-hidden">
                   <StrategyBoard />
                </div>
                <div className="flex-shrink-0 w-full bg-background/80 backdrop-blur-sm border-t border-border p-2">
                   <SavedArmiesPanel />
                </div>
            </div>
        </DndProvider>
    );
}
