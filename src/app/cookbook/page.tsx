
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getSavedArmyCompositions, getSavedStrategies } from '@/lib/firebase-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { getImagePath } from '@/lib/image-paths';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, ShieldQuestion, UploadCloud, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const ArmyCompositionCard = ({ composition }: { composition: any }) => {
    const router = useRouter();
    const { toast } = useToast();

    const handleLoadArmy = () => {
        localStorage.setItem('loadArmyComposition', JSON.stringify(composition));
        toast({
            title: "Army Loaded",
            description: `"${composition.name}" is ready in the Council.`,
        });
        router.push('/council');
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{composition.name}</CardTitle>
                        <CardDescription>Town Hall {composition.townHallLevel}</CardDescription>
                    </div>
                     <Button variant="outline" size="sm" onClick={handleLoadArmy} className="shrink-0">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Load</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {composition.heroes.length > 0 && (
                     <div>
                        <h4 className="font-bold mb-2">Heroes</h4>
                        <div className="flex flex-wrap gap-2">
                            {composition.heroes.map((hero: any) => (
                                <div key={hero.name} className="flex items-center gap-2 p-1 bg-muted/50 rounded-md text-xs">
                                    <Image src={getImagePath(hero.name)} alt={hero.name} width={24} height={24} unoptimized/>
                                    <span>{hero.name} (Lvl {hero.level})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {composition.troops.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2">Troops</h4>
                        <div className="flex flex-wrap gap-2">
                            {composition.troops.map((troop: any) => (
                                 <div key={troop.name} className="flex items-center gap-2 p-1 bg-muted/50 rounded-md text-xs">
                                    <Image src={getImagePath(troop.name)} alt={troop.name} width={24} height={24} unoptimized/>
                                    <span>{troop.quantity}x {troop.name} (Lvl {troop.level})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {composition.spells.length > 0 && (
                    <div>
                        <h4 className="font-bold mb-2">Spells</h4>
                        <div className="flex flex-wrap gap-2">
                            {composition.spells.map((spell: any) => (
                                 <div key={spell.name} className="flex items-center gap-2 p-1 bg-muted/50 rounded-md text-xs">
                                    <Image src={getImagePath(spell.name)} alt={spell.name} width={24} height={24} unoptimized/>
                                    <span>{spell.quantity}x {spell.name} (Lvl {spell.level})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                 )}
                {composition.siegeMachine && (
                     <div>
                        <h4 className="font-bold mb-2">Siege Machine</h4>
                         <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-md text-xs w-fit">
                            <Image src={getImagePath(composition.siegeMachine.name)} alt={composition.siegeMachine.name} width={24} height={24} unoptimized/>
                            <span>{composition.siegeMachine.name} (Lvl {composition.siegeMachine.level})</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

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


const StrategyCard = ({ strategy }: { strategy: any }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{strategy.armyName}</CardTitle>
                 <CardDescription>{strategy.strategySummary}</CardDescription>
            </CardHeader>
            <CardContent>
                 <Accordion type="multiple" className="w-full">
                    <AccordionItem value="phases">
                        <AccordionTrigger>Attack Plan</AccordionTrigger>
                        <AccordionContent>
                             <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                                {strategy.phases.map((phase: any, index: number) => (
                                     <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-lg font-headline text-foreground/90">{phase.phaseName}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="divide-y divide-border">
                                                {phase.steps.map((step: any, stepIndex: number) => (
                                                    <StrategyStep key={stepIndex} step={step} />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                     </AccordionItem>
                                ))}
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="strengths">
                        <AccordionTrigger>Strengths</AccordionTrigger>
                        <AccordionContent>{strategy.strengths}</AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="weaknesses">
                        <AccordionTrigger>Weaknesses</AccordionTrigger>
                        <AccordionContent>{strategy.weaknesses}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    )
}


export default function CookbookPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [compositions, setCompositions] = useState<any[]>([]);
    const [strategies, setStrategies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            setLoading(true);
            try {
                const compsPromise = getSavedArmyCompositions(user.uid);
                const stratsPromise = getSavedStrategies(user.uid);

                const [compsResult, stratsResult] = await Promise.allSettled([
                    compsPromise,
                    stratsPromise
                ]);

                if (compsResult.status === 'fulfilled') {
                    setCompositions(compsResult.value);
                } else {
                    console.error("Failed to fetch army compositions:", compsResult.reason);
                     toast({ variant: "destructive", title: "Error", description: "Could not load saved armies." });
                }

                if (stratsResult.status === 'fulfilled') {
                    setStrategies(stratsResult.value);
                } else {
                    console.error("Failed to fetch saved strategies:", stratsResult.reason);
                    toast({ variant: "destructive", title: "Error", description: "Could not load saved strategies." });
                }

            } catch (error) {
                console.error("Failed to fetch cookbook data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [user, toast]);

    if (loading) {
        return <LoadingSpinner show={true} />;
    }

    if (!user) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You must be signed in to view your cookbook.</AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Cookbook</CardTitle>
                    <CardDescription>Your personal collection of saved army compositions and AI-generated strategies.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="armies" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="armies"><BookOpen className="mr-2"/> Saved Armies</TabsTrigger>
                    <TabsTrigger value="strategies"><ShieldQuestion className="mr-2"/> Saved Strategies</TabsTrigger>
                </TabsList>
                <TabsContent value="armies">
                    {compositions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {compositions.map(comp => <ArmyCompositionCard key={comp.id} composition={comp} />)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center mt-8">You haven't saved any army compositions yet.</p>
                    )}
                </TabsContent>
                <TabsContent value="strategies">
                     {strategies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {strategies.map(strat => <StrategyCard key={strat.id} strategy={strat} />)}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center mt-8">You haven't saved any AI strategies yet.</p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
