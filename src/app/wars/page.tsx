
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
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
import { motion, useMotionValue } from 'framer-motion';

const ItemTypes = {
  UNIT: 'unit',
};

interface UnitData {
  name: string;
  image: string;
  type: 'troop' | 'spell' | 'hero' | 'siege';
}

interface PlacedUnitData extends UnitData {
    id: string; 
    x: number;
    y: number;
}

const DraggableUnit = ({ unit, type }: { unit: any, type: UnitData['type'] }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UNIT,
    item: { name: unit.name, image: getImagePath(unit.name), type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex-shrink-0 flex flex-col items-center justify-center gap-1 p-1.5 rounded-md text-xs cursor-grab transition-opacity",
        "bg-black/20 border border-border/50 hover:bg-primary/20",
        isDragging ? "opacity-30" : "opacity-100"
      )}
    >
      <div className="relative w-12 h-12">
        <Image src={getImagePath(unit.name)} alt={unit.name} layout="fill" className="object-contain" unoptimized />
      </div>
      <span className="text-foreground/80 truncate w-16 text-center">{unit.name}</span>
    </div>
  );
};

const PlacedUnit = ({ unit, onMove, cellSize }: { unit: PlacedUnitData; onMove: (id: string, x: number, y: number) => void, cellSize: number }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: { ...unit },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [unit, onMove, cellSize]);
    
    const isSpell = unit.type === 'spell';

    return (
        <motion.div
            ref={drag}
            className={cn("absolute cursor-grab transition-all", isDragging ? 'opacity-50 z-20' : 'z-10')}
            style={{
                left: unit.x,
                top: unit.y,
                width: cellSize,
                height: cellSize,
            }}
            whileTap={{ cursor: "grabbing", scale: 1.1 }}
        >
             <div className="relative w-full h-full p-0.5 pointer-events-none">
                <div 
                    className={cn(
                        "absolute rounded-full border-2 -translate-x-1/2 -translate-y-1/2",
                         isSpell ? 'bg-purple-500/20 border-purple-400' : 'bg-amber-500/10 border-amber-400/50'
                    )}
                    style={{ 
                        width: '300%', 
                        height: '300%', 
                        top: '50%',
                        left: '50%',
                    }}
                />
                <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain drop-shadow-lg" unoptimized />
            </div>
        </motion.div>
    )
}

const StrategyBoard = () => {
    const [placedUnits, setPlacedUnits] = useState<Record<string, PlacedUnitData>>({});
    const boardRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const gridSize = 44;
    const cellSize = boardSize.width / gridSize;

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0] && boardRef.current) {
                const { width } = entries[0].contentRect;
                setBoardSize({ width: width, height: width });
            }
        });
        if (boardRef.current) {
            resizeObserver.observe(boardRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    const moveUnit = useCallback((id: string, newX: number, newY: number) => {
        setPlacedUnits(prev => ({
            ...prev,
            [id]: { ...prev[id], x: newX, y: newY }
        }))
    }, []);
    
     const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item: UnitData & { id?: string }, monitor) => {
                if (!boardRef.current) return;
                const boardRect = boardRef.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) return;

                // Adjust for the board's pan and zoom
                const dropX = (clientOffset.x - boardRect.left - x.get()) / scale.get();
                const dropY = (clientOffset.y - boardRect.top - y.get()) / scale.get();

                const newId = item.id || `${Date.now()}-${Math.random()}`;

                setPlacedUnits((prev) => ({
                    ...prev,
                    [newId]: {
                        ...item,
                        id: newId,
                        x: dropX - (cellSize / 2),
                        y: dropY - (cellSize / 2),
                    },
                }));
            },
        }),
        [x, y, scale, cellSize]
    );

    return (
        <div ref={drop} className="w-full h-full overflow-hidden bg-black/30 rounded-lg cursor-grab active:cursor-grabbing">
             <motion.div
                ref={boardRef}
                drag
                dragConstraints={{ left: -(boardSize.width * (scale.get() - 1)), right: 0, top: -(boardSize.height * (scale.get() - 1)), bottom: 0 }}
                dragElastic={0.1}
                className="relative"
                style={{ 
                    scale, x, y, 
                    width: boardSize.width, 
                    height: boardSize.height 
                }}
                 onWheel={(e) => {
                    e.preventDefault();
                    const newScale = Math.max(1, Math.min(3, scale.get() - e.deltaY * 0.001));
                    scale.set(newScale);
                }}
            >
                <Image
                    src="/assets/scenaries-war.jpg"
                    alt="War Base Layout"
                    data-ai-hint="clash of clans war base"
                    layout="fill"
                    className="object-cover pointer-events-none"
                    unoptimized
                    priority
                />
                 {Object.values(placedUnits).map((unit) => (
                    <PlacedUnit key={unit.id} unit={unit} onMove={moveUnit} cellSize={cellSize} />
                ))}
            </motion.div>
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
            <div className="flex items-center justify-center h-full p-4">
                <Loader2 className="animate-spin mr-2" />
                <span>Loading Your Armies...</span>
            </div>
        );
    }
    
    if (compositions.length === 0) {
        return (
            <div className="p-4 w-full flex justify-center">
                 <Alert className="max-w-md">
                    <AlertTitle>No Armies Found</AlertTitle>
                    <AlertDescription>
                        You haven't saved any armies yet. Go to the <Button asChild variant="link" className="p-0 h-auto"><Link href="/war-council">War Council</Link></Button> to build and save your first army!
                    </AlertDescription>
                </Alert>
            </div>
           
        );
    }

    return (
         <Accordion type="single" collapsible className="w-full px-4">
            {compositions.map((comp) => (
                <AccordionItem key={comp.id} value={comp.id} className="border-b-0 mb-2 rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm">
                    <AccordionTrigger className="bg-muted/30 hover:bg-muted/50 px-4 py-2">
                        <span className="font-headline text-lg">{comp.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-2 bg-black/20">
                        <div className="flex gap-2 overflow-x-auto p-2">
                             {comp.heroes?.map((unit: any, index: number) => (
                                <DraggableUnit key={`hero-${index}-${unit.name}`} unit={unit} type="hero"/>
                            ))}
                            {comp.troops?.map((unit: any, index: number) => (
                                <DraggableUnit key={`troop-${index}-${unit.name}`} unit={unit} type="troop"/>
                            ))}
                            {comp.spells?.map((unit: any, index: number) => (
                                <DraggableUnit key={`spell-${index}-${unit.name}`} unit={unit} type="spell"/>
                            ))}
                            {comp.siegeMachine && (
                                <DraggableUnit unit={comp.siegeMachine} type="siege"/>
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
            <div className="w-full h-full flex items-center justify-center p-4">
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
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
             <div className="flex flex-col h-[calc(100vh-5rem)] w-full gap-2">
                <div className="flex-grow relative">
                   <StrategyBoard />
                </div>
                <div className="w-full h-48 flex-shrink-0 bg-black/10 backdrop-blur-md border-t border-border/20">
                    <div className="h-full overflow-y-auto">
                       <SavedArmiesPanel />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
