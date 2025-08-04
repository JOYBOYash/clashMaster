
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { getSavedArmyCompositions } from '@/lib/firebase-service';
import { getImagePath } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/loading-spinner';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const ItemTypes = {
  UNIT: 'unit',
};

interface Unit {
  id: string; // Unique ID for each placed unit
  name: string;
  image: string;
  type: 'troop' | 'spell' | 'hero' | 'siege';
  x: number;
  y: number;
}

const DraggableUnit = ({ unit, type }: { unit: any, type: Unit['type'] }) => {
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
        "flex flex-col items-center justify-center gap-1 p-1.5 rounded-md text-xs cursor-grab transition-opacity",
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

const PlacedUnit = ({ unit, onMove, cellSize }: { unit: Unit, onMove: (id: string, x: number, y: number) => void, cellSize: number }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: { ...unit },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [unit, onMove, cellSize]);
    
    const isSpell = unit.type === 'spell';

    return (
        <div 
            ref={drag}
            className={cn("absolute cursor-grab transition-all", isDragging ? 'opacity-50 z-20' : 'z-10')}
            style={{
                left: unit.x,
                top: unit.y,
                width: cellSize,
                height: cellSize,
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div 
                    className={cn(
                        "absolute rounded-full border-2",
                        isSpell ? 'bg-purple-500/20 border-purple-400' : 'bg-amber-500/10 border-amber-400/50'
                    )}
                    style={{ width: '250%', height: '250%' }}
                />
                <div className="relative w-full h-full p-0.5">
                    <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain drop-shadow-lg" unoptimized />
                </div>
            </div>
        </div>
    )
}

const StrategyBoard = () => {
    const [placedUnits, setPlacedUnits] = useState<Record<string, Unit>>({});
    const boardRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const gridSize = 44;
    const cellSize = Math.min(boardSize.width, boardSize.height) / gridSize;

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setBoardSize({ width, height });
            }
        });
        if (boardRef.current) {
            resizeObserver.observe(boardRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    const handleDrop = useCallback((item: any, monitor: any) => {
        if (!boardRef.current) return;

        const boardRect = boardRef.current.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const dropX = (clientOffset.x - boardRect.left) / scale.get() - x.get() / scale.get();
        const dropY = (clientOffset.y - boardRect.top) / scale.get() - y.get() / scale.get();

        const gridX = Math.round(dropX / cellSize) * cellSize;
        const gridY = Math.round(dropY / cellSize) * cellSize;
        
        const newId = item.id || `${Date.now()}-${Math.random()}`;

        setPlacedUnits(prev => ({
            ...prev,
            [newId]: { ...item, id: newId, x: gridX, y: gridY },
        }));
    }, [scale, x, y, cellSize]);
    
     const [, drop] = useDrop(() => ({
        accept: ItemTypes.UNIT,
        drop: handleDrop,
    }), [handleDrop]);
    
    return (
        <div ref={boardRef} className="relative w-full h-full overflow-hidden bg-black/30 rounded-lg">
            <motion.div
                ref={drop}
                drag
                dragConstraints={boardRef}
                dragElastic={0}
                className="relative w-full h-full"
                style={{ scale, x, y }}
                 onWheel={(e) => {
                    const newScale = scale.get() - e.deltaY * 0.001;
                    if (newScale >= 0.5 && newScale <= 3) {
                        scale.set(newScale);
                    }
                }}
            >
                <Image
                    src="/assets/scenaries-war.jpg"
                    alt="War Base Layout"
                    data-ai-hint="clash of clans war base"
                    layout="fill"
                    className="object-cover pointer-events-none"
                    unoptimized
                />
                 {Object.values(placedUnits).map((unit) => (
                    <PlacedUnit key={unit.id} unit={unit} onMove={() => {}} cellSize={cellSize} />
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
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin mr-2" />
                <span>Loading Your Armies...</span>
            </div>
        );
    }

    if (compositions.length === 0) {
        return (
            <Alert>
                <AlertTitle>No Armies Found</AlertTitle>
                <AlertDescription>
                    You haven't saved any armies yet. Go to the <Button asChild variant="link" className="p-0"><Link href="/war-council">War Council</Link></Button> to build and save your first army!
                </AlertDescription>
            </Alert>
        );
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
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col-reverse md:flex-row h-[calc(100vh-8rem)] gap-4">
                <div className="flex-grow p-0 overflow-hidden h-full">
                   <StrategyBoard />
                </div>
                <div className="w-full md:w-80 flex-shrink-0 h-full overflow-y-auto">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Your Armies</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <SavedArmiesPanel />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DndProvider>
    );
}
