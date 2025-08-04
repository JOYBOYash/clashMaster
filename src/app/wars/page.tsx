
'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from 'next/image';
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

const DraggableUnit = ({ armyUnit, onDeploy, onStartPress, onEndPress }: { armyUnit: ArmyUnit, onDeploy: (unit: UnitData) => void, onStartPress: (unit: UnitData) => void, onEndPress: () => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.UNIT,
    item: { ...armyUnit.unit },
    end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (item && dropResult) {
            onDeploy(armyUnit.unit);
        }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [armyUnit, onDeploy]);

  return (
    <div
      ref={drag}
      onMouseDown={() => onStartPress(armyUnit.unit)}
      onMouseUp={onEndPress}
      onMouseLeave={onEndPress}
      className={cn(
        "relative flex-shrink-0 flex flex-col items-center justify-center gap-1 p-1.5 rounded-md text-xs cursor-grab active:cursor-grabbing transition-all w-20 h-24",
        "bg-black/20 border border-border/50 hover:bg-primary/20",
        isDragging ? "opacity-30" : "opacity-100"
      )}
    >
      <div className="relative w-12 h-12">
        <Image src={armyUnit.unit.image} alt={armyUnit.unit.name} layout="fill" className="object-contain" unoptimized />
      </div>
      <span className="text-foreground/80 truncate w-16 text-center">{armyUnit.unit.name}</span>
      {armyUnit.quantity > 1 && (
        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background/50">
          x{armyUnit.quantity}
        </div>
      )}
    </div>
  );
};

const PlacedUnit = ({ unit, onMove }: { unit: PlacedUnitData, onMove: (id: string, x: number, y: number) => void }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: { ...unit },
        collect: monitor => ({ isDragging: !!monitor.isDragging() }),
    }), [unit, onMove]);
    
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
                        width: isSpell ? '300%' : '150%', 
                        height: isSpell ? '300%' : '150%',
                    }}
                />
                <Image src={unit.image} alt={unit.name} layout="fill" className="object-contain drop-shadow-lg scale-110" unoptimized />
            </div>
        </motion.div>
    )
}

const DeploymentBar = ({ army, onDeploy, onStartPress, onEndPress }: { army: ArmyUnit[], onDeploy: (unit: UnitData) => void, onStartPress: (unit: UnitData) => void, onEndPress: () => void }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-auto max-h-64 bg-black/30 backdrop-blur-md border border-border/20 p-2 z-20 rounded-lg w-[calc(100%-2rem)] max-w-4xl">
             <div className="h-full w-full flex flex-wrap justify-center gap-2 p-2 overflow-y-auto">
                {army.map((armyUnit) => (
                    <DraggableUnit 
                        key={armyUnit.unit.name} 
                        armyUnit={armyUnit} 
                        onDeploy={onDeploy}
                        onStartPress={onStartPress}
                        onEndPress={onEndPress}
                    />
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
    const [lastDropPos, setLastDropPos] = useState<{x: number, y: number} | null>(null);

    const boardRef = useRef<HTMLDivElement>(null);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);

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
                    
                    (defaultComp.heroes || []).forEach((h: any) => deployable.push({ unit: { ...h, image: getImagePath(h.name), type: 'hero' }, quantity: 1 }));
                    (defaultComp.troops || []).forEach((t: any) => deployable.push({ unit: { ...t, image: getImagePath(t.name), type: 'troop' }, quantity: t.quantity }));
                    (defaultComp.spells || []).forEach((s: any) => deployable.push({ unit: { ...s, image: getImagePath(s.name), type: 'spell' }, quantity: s.quantity }));
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
    
    const deployUnit = useCallback((unit: UnitData) => {
        const dropX = lastDropPos?.x;
        const dropY = lastDropPos?.y;
        if(dropX === null || dropY === null || dropX === undefined || dropY === undefined) return false;

        let unitAvailable = false;
        setArmyToDeploy(prevArmy => {
            const unitIndexInArmy = prevArmy.findIndex(u => u.unit.name === unit.name);
            if (unitIndexInArmy === -1) {
                unitAvailable = false;
                return prevArmy; 
            }
            
            unitAvailable = true;
            const newArmy = [...prevArmy];
            if (newArmy[unitIndexInArmy].quantity > 1) {
                newArmy[unitIndexInArmy] = { ...newArmy[unitIndexInArmy], quantity: newArmy[unitIndexInArmy].quantity - 1 };
            } else {
                newArmy.splice(unitIndexInArmy, 1);
            }
            return newArmy;
        });

        if (unitAvailable) {
            setPlacedUnits(prevPlaced => [
                ...prevPlaced,
                { ...unit, id: `${Date.now()}-${Math.random()}`, x: dropX, y: dropY }
            ]);
        }
        return unitAvailable;
    }, [lastDropPos]);

     const handleStartPress = (unit: UnitData) => {
        if (!lastDropPos) {
            toast({ title: "Set a location", description: "Drag a unit onto the map first to set an initial deployment spot." });
            return;
        }

        // Do not start interval for heroes
        if (unit.type === 'hero') {
            deployUnit(unit);
            return;
        }

        const deploy = () => {
            const deployed = deployUnit(unit);
            if (!deployed) {
                 if (pressTimer.current) {
                    clearInterval(pressTimer.current);
                    pressTimer.current = null;
                }
            }
        };

        deploy(); // Deploy one immediately on click

        pressTimer.current = setTimeout(() => {
            if (pressTimer.current) { // Ensure it wasn't cleared
                pressTimer.current = setInterval(deploy, 150) as unknown as NodeJS.Timeout;
            }
        }, 500);
    };

    const handleEndPress = () => {
        if (pressTimer.current) {
            clearInterval(pressTimer.current);
            pressTimer.current = null;
        }
    };
    
    const handleMoveUnit = useCallback((id: string, newX: number, newY: number) => {
        setPlacedUnits(prev => prev.map(u => u.id === id ? { ...u, x: newX, y: newY } : u));
    }, []);

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item: PlacedUnitData, monitor) => {
                if (!boardRef.current) return;
                const boardRect = boardRef.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) return;
                
                const currentScale = scale.get();
                const currentX = x.get();
                const currentY = y.get();

                const dropX = (clientOffset.x - boardRect.left - currentX) / currentScale - 24; 
                const dropY = (clientOffset.y - boardRect.top - currentY) / currentScale - 24;
                
                setLastDropPos({x: dropX, y: dropY});
                
                if (item.id) { // It's an existing unit being moved
                    handleMoveUnit(item.id, dropX, dropY);
                }
                
                return { name: "StrategyBoard", x: dropX, y: dropY };
            },
        }),
        [x, y, scale, handleMoveUnit]
    );

    const minScale = 1;
    const maxScale = 3;

    if (loadingArmies) {
      return <LoadingSpinner show={true} />;
    }

    return (
        <div className="w-full h-full overflow-hidden flex flex-col relative">
             <motion.div
                ref={boardRef}
                className="relative flex-grow cursor-grab active:cursor-grabbing w-full h-full"
                style={{ scale, x, y }}
                drag
                dragConstraints={boardRef}
                dragElastic={0.1}
                onWheel={(e) => {
                    e.preventDefault();
                    const newScale = Math.max(minScale, Math.min(maxScale, scale.get() - e.deltaY * 0.001));
                    scale.set(newScale);
                }}
            >
                <div ref={drop} className="absolute inset-0">
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
                        <PlacedUnit key={unit.id} unit={unit} onMove={handleMoveUnit} />
                    ))}
                </div>
            </motion.div>
            <DeploymentBar 
                army={armyToDeploy} 
                onDeploy={deployUnit}
                onStartPress={handleStartPress}
                onEndPress={handleEndPress}
            />
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
             <div className="absolute inset-0 -m-8">
                <StrategyBoard />
            </div>
        </DndProvider>
    );
}

