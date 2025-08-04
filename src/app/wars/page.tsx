
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

const DraggableUnit = ({ armyUnit, onDeploy, onMouseDown, onMouseUp }: { armyUnit: ArmyUnit, onDeploy: () => void, onMouseDown: () => void, onMouseUp: () => void }) => {
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
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp} 
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

const PlacedUnit = ({ unit, onMove }: { unit: PlacedUnitData, onMove: (id: string, x: number, y: number) => void }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.UNIT,
        item: { ...unit },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<{x: number, y: number}>();
            if (item && dropResult) {
                onMove(item.id, dropResult.x, dropResult.y);
            }
        },
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

const DeploymentBar = ({ army, onDeploy, onContinuousDeployStart, onContinuousDeployStop }: { army: ArmyUnit[], onDeploy: (unitName: string) => void, onContinuousDeployStart: (unit: UnitData) => void, onContinuousDeployStop: () => void }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-40 bg-black/30 backdrop-blur-md border border-border/20 p-2 z-20 rounded-lg max-w-3xl w-full">
            <div className="h-full w-full flex gap-2 overflow-x-auto p-2">
                {army.map((armyUnit) => (
                    <DraggableUnit 
                        key={armyUnit.unit.name} 
                        armyUnit={armyUnit} 
                        onDeploy={() => onDeploy(armyUnit.unit.name)}
                        onMouseDown={() => onContinuousDeployStart(armyUnit.unit)}
                        onMouseUp={onContinuousDeployStop}
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

    const deployUnit = useCallback((unit: UnitData, dropX: number, dropY: number) => {
        let canDeploy = false;
        setArmyToDeploy(prev => {
            const newArmy = [...prev];
            const unitIndex = newArmy.findIndex(u => u.unit.name === unit.name);
            
            if (unitIndex !== -1 && newArmy[unitIndex].quantity > 0) {
                canDeploy = true;
                if (newArmy[unitIndex].unit.type === 'hero' || newArmy[unitIndex].quantity === 1) {
                    newArmy.splice(unitIndex, 1);
                } else {
                    newArmy[unitIndex] = { ...newArmy[unitIndex], quantity: newArmy[unitIndex].quantity - 1 };
                }
            }
            return newArmy;
        });

        if(canDeploy) {
            setPlacedUnits(prevPlaced => [...prevPlaced, { ...unit, id: `${Date.now()}-${Math.random()}`, x: dropX, y: dropY }]);
        }
    }, []);

    const handleDeploy = useCallback((unitName: string) => {
        setArmyToDeploy(prev => {
            const newArmy = [...prev];
            const unitIndex = newArmy.findIndex(u => u.unit.name === unitName);
            if (unitIndex !== -1) {
                 if (newArmy[unitIndex].unit.type === 'hero' || newArmy[unitIndex].quantity === 1) {
                    newArmy.splice(unitIndex, 1);
                } else {
                    newArmy[unitIndex] = { ...newArmy[unitIndex], quantity: newArmy[unitIndex].quantity - 1 };
                }
            }
            return newArmy;
        });
    }, []);

    const handleMoveUnit = useCallback((id: string, newX: number, newY: number) => {
        setPlacedUnits(prev => prev.map(u => u.id === id ? { ...u, x: newX, y: newY } : u));
    }, []);

    const handleContinuousDeployStart = (unit: UnitData) => {
        if(unit.type === 'hero') return; 
        
        pressTimer.current = setTimeout(() => {
             if (pressTimer.current) clearInterval(pressTimer.current);
             pressTimer.current = setInterval(() => {
                // This logic is complex because we don't know the mouse position here.
                // The main drag-and-drop will handle single placement.
                // A full solution would involve tracking mouse position over the board.
                // For simplicity, we stick to single placement on hold.
             }, 150);
        }, 500);
    };
    
    const handleContinuousDeployStop = () => {
        if (pressTimer.current) {
            clearInterval(pressTimer.current);
            pressTimer.current = null;
        }
    };

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.UNIT,
            drop: (item: UnitData | PlacedUnitData, monitor) => {
                if (!boardRef.current) return;
                const boardRect = boardRef.current.getBoundingClientRect();
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) return;
                
                const currentScale = scale.get();
                const currentX = x.get();
                const currentY = y.get();

                const dropX = (clientOffset.x - boardRect.left - currentX) / currentScale - 24; 
                const dropY = (clientOffset.y - boardRect.top - currentY) / currentScale - 24;
                
                if ('id' in item) {
                    handleMoveUnit(item.id, dropX, dropY);
                } else {
                    deployUnit(item as UnitData, dropX, dropY);
                }
                return { x: dropX, y: dropY };
            },
        }),
        [x, y, scale, handleMoveUnit, deployUnit]
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
                onDeploy={handleDeploy}
                onContinuousDeployStart={handleContinuousDeployStart}
                onContinuousDeployStop={handleContinuousDeployStop} 
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
