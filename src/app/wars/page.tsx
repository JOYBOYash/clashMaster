
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
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
  level: number;
}

interface PlacedUnitData extends UnitData {
    id: string; 
    x: number;
    y: number;
}

interface ArmyUnit {
    unit: UnitData;
    quantity: number;
}

const DraggableUnit = ({ armyUnit, onDeploy }: { armyUnit: ArmyUnit, onDeploy: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UNIT,
    item: () => {
        onDeploy();
        return armyUnit.unit;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [armyUnit, onDeploy]);

  return (
    <div
      ref={drag}
      className={cn(
        "relative flex-shrink-0 flex flex-col items-center justify-center gap-1 p-1.5 rounded-md text-xs cursor-grab transition-all",
        "bg-black/20 border border-border/50 hover:bg-primary/20",
        isDragging ? "opacity-30" : "opacity-100"
      )}
    >
      <div className="relative w-12 h-12">
        <Image src={armyUnit.unit.image} alt={armyUnit.unit.name} layout="fill" className="object-contain" unoptimized />
      </div>
      <span className="text-foreground/80 truncate w-16 text-center">{armyUnit.unit.name}</span>
      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background/50">
        x{armyUnit.quantity}
      </div>
    </div>
  );
};

const PlacedUnit = ({ unit }: { unit: PlacedUnitData }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: { ...unit }, // Pass existing data when dragging an already placed unit
        collect: monitor => ({ isDragging: !!monitor.isDragging() }),
    }), [unit]);
    
    const isSpell = unit.type === 'spell';
    const markerSize = 48;

    return (
        <motion.div
            ref={drag}
            className={cn("absolute cursor-grab transition-all group", isDragging ? 'opacity-50 z-20' : 'z-10')}
            style={{
                left: unit.x,
                top: unit.y,
                width: markerSize,
                height: markerSize,
            }}
            whileTap={{ cursor: "grabbing", scale: 1.1 }}
        >
             <div className="relative w-full h-full p-1 pointer-events-none flex items-center justify-center">
                <div 
                    className={cn(
                        "absolute rounded-full border-2 opacity-30 transition-opacity group-hover:opacity-60",
                         isSpell ? 'bg-purple-500/20 border-purple-400' : 'bg-amber-500/10 border-amber-400/50'
                    )}
                    style={{ 
                        width: '300%', 
                        height: '300%',
                    }}
                />
                <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain drop-shadow-lg scale-110" unoptimized />
            </div>
        </motion.div>
    )
}

const DeploymentBar = ({ army, onDeploy }: { army: ArmyUnit[], onDeploy: (unitName: string) => void }) => {
    return (
        <div className="w-full h-40 flex-shrink-0 bg-black/30 backdrop-blur-md border-t border-border/20 p-2">
            <div className="h-full w-full flex gap-2 overflow-x-auto p-2">
                {army.map((armyUnit) => (
                    <DraggableUnit key={armyUnit.unit.name} armyUnit={armyUnit} onDeploy={() => onDeploy(armyUnit.unit.name)} />
                ))}
            </div>
        </div>
    )
};

const StrategyBoard = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    
    const [placedUnits, setPlacedUnits] = useState<PlacedUnitData[]>([]);
    const [armyToDeploy, setArmyToDeploy] = useState<ArmyUnit[]>([]);
    const [loadingArmies, setLoadingArmies] = useState(true);

    const boardRef = useRef<HTMLDivElement>(null);
    const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });

    const scale = useMotionValue(1);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    useEffect(() => {
        if (!user) {
            setLoadingArmies(false);
            return;
        }
        const fetchArmies = async () => {
            setLoadingArmies(true);
            try {
                const comps = await getSavedArmyCompositions(user.uid);
                if (comps.length > 0) {
                    const defaultComp = comps[0];
                    const deployable: ArmyUnit[] = [];

                    defaultComp.heroes?.forEach((h: any) => deployable.push({ unit: { ...h, image: getImagePath(h.name), type: 'hero' }, quantity: 1 }));
                    defaultComp.troops?.forEach((t: any) => deployable.push({ unit: { ...t, image: getImagePath(t.name), type: 'troop' }, quantity: t.quantity }));
                    defaultComp.spells?.forEach((s: any) => deployable.push({ unit: { ...s, image: getImagePath(s.name), type: 'spell' }, quantity: s.quantity }));
                    if (defaultComp.siegeMachine) deployable.push({ unit: { ...defaultComp.siegeMachine, image: getImagePath(defaultComp.siegeMachine.name), type: 'siege'}, quantity: 1 });

                    setArmyToDeploy(deployable);
                }
            } catch (error) {
                console.error("Failed to fetch armies:", error);
                toast({ variant: 'destructive', title: "Error", description: "Could not load your saved armies." });
            } finally {
                setLoadingArmies(false);
            }
        };
        fetchArmies();
    }, [user, toast]);

    const handleDeploy = useCallback((unitName: string) => {
        setArmyToDeploy(prev => {
            const newArmy = [...prev];
            const unitIndex = newArmy.findIndex(u => u.unit.name === unitName);
            if (unitIndex !== -1) {
                if (newArmy[unitIndex].quantity > 1) {
                    newArmy[unitIndex] = { ...newArmy[unitIndex], quantity: newArmy[unitIndex].quantity - 1 };
                } else {
                    newArmy.splice(unitIndex, 1);
                }
            }
            return newArmy;
        });
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0] && boardRef.current) {
                const { width, height } = entries[0].contentRect;
                setBoardSize({ width, height });
            }
        });
        if (boardRef.current) {
            resizeObserver.observe(boardRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);
    
     const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item: PlacedUnitData, monitor) => {
                if (!boardRef.current) return;
                const boardRect = boardRef.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) return;

                const dropX = (clientOffset.x - boardRect.left) / scale.get() - (x.get() / scale.get());
                const dropY = (clientOffset.y - boardRect.top) / scale.get() - (y.get() / scale.get());
                
                const unitId = item.id || `${Date.now()}-${Math.random()}`;
                
                // If item has an ID, it's an existing unit being moved
                if (item.id) {
                    setPlacedUnits(prev => prev.map(u => u.id === item.id ? { ...u, x: dropX - 24, y: dropY - 24 } : u));
                } else {
                     setPlacedUnits((prev) => ([
                        ...prev,
                        { ...(item as UnitData), id: unitId, x: dropX - 24, y: dropY - 24 },
                    ]));
                }
            },
        }),
        [x, y, scale]
    );

    const minScale = 1;
    const maxScale = 3;

    return (
        <div ref={drop} className="w-full h-full overflow-hidden rounded-lg cursor-grab active:cursor-grabbing flex flex-col">
             <motion.div
                ref={boardRef}
                drag
                dragConstraints={{ left: -(boardSize.width * (scale.get() - 1)), right: 0, top: -(boardSize.height * (scale.get() - 1)), bottom: 0 }}
                dragElastic={0.1}
                className="relative flex-grow"
                style={{ scale, x, y }}
                 onWheel={(e) => {
                    e.preventDefault();
                    const newScale = Math.max(minScale, Math.min(maxScale, scale.get() - e.deltaY * 0.001));
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
                 {placedUnits.map((unit) => (
                    <PlacedUnit key={unit.id} unit={unit} />
                ))}
            </motion.div>
            <DeploymentBar army={armyToDeploy} onDeploy={handleDeploy} />
        </div>
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
             <div className="flex flex-col h-[calc(100vh-4rem-1px)] w-full gap-0 -m-8">
                <StrategyBoard />
            </div>
        </DndProvider>
    );
}

