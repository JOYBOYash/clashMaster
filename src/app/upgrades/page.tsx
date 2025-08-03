
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench, Clock, AlertTriangle, Home, Hammer, Check, Settings, Flame } from 'lucide-react';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import Image from 'next/image';
import { getImagePath, timeBadge } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Done';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    
    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`); 
    
    if (parts.length === 0 && seconds > 0) return '<1m';
    if (parts.length === 0) return 'Done';
    return parts.join(' ');
}

const UpgradeSectionHeader = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-3 p-2 bg-muted/80 rounded-t-lg border-b-2 border-primary/50">
        <Icon className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-headline text-foreground">{title}</h3>
    </div>
);

const UpgradeTimer = ({ upgrade, onComplete }: { upgrade: OngoingUpgrade, onComplete: (upgrade: OngoingUpgrade) => void }) => {
    const [timeLeft, setTimeLeft] = useState(upgrade.secondsRemaining);
    const imagePath = getImagePath(upgrade.name.replace(/ Research$/, ''));

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete(upgrade);
            return;
        };
        const interval = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft, onComplete, upgrade]);

    const progress = upgrade.totalDurationInSeconds > 0
        ? ((upgrade.totalDurationInSeconds - timeLeft) / upgrade.totalDurationInSeconds) * 100
        : 100;

    return (
        <div className="flex items-center gap-4 p-3 bg-card hover:bg-muted/50 transition-colors">
            <div className="relative shrink-0 w-16 h-16 bg-black/20 rounded-md p-1 border border-border">
                <Image 
                    src={imagePath} 
                    alt={upgrade.name} 
                    fill 
                    className="object-contain" 
                    unoptimized 
                />
            </div>
            <div className="flex-grow space-y-2">
                <p className="font-bold text-base truncate pr-2">{upgrade.name} to Lvl {upgrade.level}</p>
                <Progress value={progress} className="h-2"/>
            </div>
             <div className="flex items-center gap-2 shrink-0">
                 <Image src={timeBadge} width={24} height={24} alt="Time" unoptimized />
                 <span className="font-bold text-sm text-foreground/80 min-w-[60px] text-right">
                    {formatDuration(timeLeft)}
                </span>
            </div>
        </div>
    );
};

const CompletedUpgradeItem = ({ item }: { item: OngoingUpgrade }) => {
    const imagePath = getImagePath(item.name.replace(/ Research$/, ''));
    return (
         <div className="flex items-center gap-4 p-3 bg-card hover:bg-muted/50 transition-colors rounded-lg border">
            <div className="relative shrink-0 w-12 h-12 bg-black/20 rounded-md p-1 border border-border">
                <Image src={imagePath} alt={item.name} fill className="object-contain" unoptimized />
            </div>
            <div className="flex-grow">
                 <p className="font-bold text-sm truncate">{item.name} to Lvl {item.level}</p>
            </div>
            <div className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5"/>
                <span className="font-bold text-sm">Finished</span>
            </div>
        </div>
    )
}

const SuggestionCard = ({ suggestion }: { suggestion: UpgradeSuggestion }) => {
  return (
    <div
      className={cn(
        "relative w-full bg-card shadow-2xl border border-border/20 overflow-hidden",
        "transition-all duration-300 hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-2",
        "feature-card opacity-0 [clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]"
      )}
      style={{
        clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0 100%)'
      }}
    >
      <div className={cn(
        "absolute top-0 h-full w-2/3 bg-muted/30 -z-0 right-0 -skew-x-[15deg] translate-x-1/2"
      )}></div>
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="absolute top-3 right-4">
          <Flame className="w-6 h-6 text-primary opacity-80"/>
        </div>
        <h4 className="text-xl font-bold font-headline text-foreground/90 pr-8">{suggestion.title}</h4>
        <p className="text-sm text-muted-foreground mt-2 flex-grow">{suggestion.description}</p>
        <div className="mt-4 pt-4 border-t border-border/20">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/80">{suggestion.priority} Priority</span>
        </div>
      </div>
    </div>
  );
};

export default function UpgradesPage() {
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<VillageAnalysis | null>(null);
    const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    
    const [ongoingUpgrades, setOngoingUpgrades] = useState<OngoingUpgrade[]>([]);
    const [completedUpgrades, setCompletedUpgrades] = useState<OngoingUpgrade[]>([]);
    const [playerJson, setPlayerJson] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpgradeComplete = useCallback((completedUpgrade: OngoingUpgrade) => {
        setOngoingUpgrades(prev => prev.filter(upg => upg !== completedUpgrade));
        setCompletedUpgrades(prev => [completedUpgrade, ...prev].slice(0, 5));
    }, []);

    const loadAndAnalyze = useCallback(async (villageExportJson: string | null) => {
        if (!villageExportJson) {
            setError('No village data found. Please add your village JSON to get started.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setSuggestions(null);
        setAnalysis(null);
        setOngoingUpgrades([]);
        setCompletedUpgrades([]);
        setIsModalOpen(false);

        try {
            const villageData = JSON.parse(villageExportJson);
            const villageAnalysis = analyzeVillage(villageData);
            setAnalysis(villageAnalysis);
            setOngoingUpgrades(villageAnalysis.ongoingUpgrades);
            
            const aiSuggestions = await suggestUpgrades(villageAnalysis);
            setSuggestions(aiSuggestions);
        } catch (err: any) {
            console.error("Analysis failed:", err);
            const errorMessage = err.message || 'Could not parse or analyze your village data. Check the format.';
            toast({ variant: 'destructive', title: 'Analysis Failed', description: errorMessage });
            setError(`Failed to analyze your village data. Please check the JSON and try again.`);
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        const storedData = localStorage.getItem('villageExportData');
        setPlayerJson(storedData || '');
        if (storedData) {
            loadAndAnalyze(storedData);
        } else {
            setLoading(false);
            setError("No village data found. Please use the button above to import your village data.");
        }
    }, [loadAndAnalyze]);

    const handleSaveAndAnalyze = () => {
        try {
            const parsedData = JSON.parse(playerJson);
            if (!parsedData.tag) {
                throw new Error("JSON is missing required 'tag' property.");
            }
            localStorage.setItem('villageExportData', playerJson);
            toast({
                title: 'Village Data Saved',
                description: 'Re-analyzing your village with the new data...',
            });
            loadAndAnalyze(playerJson);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Invalid JSON',
                description: error.message || 'The data you entered is not valid JSON.',
            });
        }
    };


    const { homeUpgrades, builderUpgrades } = useMemo(() => {
        const home: OngoingUpgrade[] = [];
        const builder: OngoingUpgrade[] = [];
        ongoingUpgrades.forEach(upg => {
            if(upg.village === 'home') home.push(upg);
            else builder.push(upg);
        });
        return { homeUpgrades: home, builderUpgrades: builder };
    }, [ongoingUpgrades]);

    return (
        <div className="space-y-8 bg-upgrades-pattern">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Village Upgrade Planner</CardTitle>
                            <CardDescription>
                                AI-powered suggestions for what to build next and a real-time view of your ongoing upgrades.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading && (
                <div className="flex items-center justify-center p-8 bg-card rounded-lg">
                    <Loader2 className="mr-2 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing your village and consulting the AI...</p>
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error}
                         <Button onClick={() => setIsModalOpen(true)} variant="link" className="p-0 h-auto ml-2">Click here to update your data.</Button>
                    </AlertDescription>
                </Alert>
            )}

            {!loading && !error && analysis && (
                <div className="space-y-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Wrench /> AI Upgrade Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {suggestions ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {suggestions.suggestions.slice(0, 5).map((sug, index) => <SuggestionCard key={index} suggestion={sug} />)}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-full min-h-[10rem]">
                                    <Loader2 className="animate-spin text-primary w-8 h-8" />
                                    <p className="ml-3 text-muted-foreground">AI is thinking...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-headline flex items-center gap-3"><Clock /> Ongoing Upgrades</h2>
                            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                <DialogTrigger asChild>
                                    <Button><Settings className="mr-2 h-4 w-4" /> Update Data</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Update Your Village Data</DialogTitle>
                                        <DialogDescription>
                                            To get the latest data, follow these steps in-game: **Settings &gt; More Settings &gt; Export Village**. Then paste the copied data below.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-2 py-4">
                                        <Label htmlFor="player-json" className="sr-only">Village Export JSON</Label>
                                        <Textarea 
                                            id="player-json"
                                            value={playerJson}
                                            onChange={(e) => setPlayerJson(e.target.value)}
                                            rows={10}
                                            placeholder='Paste your village export JSON here.'
                                            className="text-xs font-mono"
                                        />
                                    </div>
                                    <Button onClick={handleSaveAndAnalyze}>Save and Analyze</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        
                        {homeUpgrades.length > 0 && (
                            <Card no-hover className="overflow-hidden">
                                <UpgradeSectionHeader title="Home Village" icon={Home} />
                                <div className="divide-y divide-border">
                                    {homeUpgrades.map((upg, index) => <UpgradeTimer key={`home-${index}`} upgrade={upg} onComplete={handleUpgradeComplete} />)}
                                </div>
                            </Card>
                        )}

                        {builderUpgrades.length > 0 && (
                             <Card no-hover className="overflow-hidden">
                                <UpgradeSectionHeader title="Builder Base" icon={Hammer} />
                                 <div className="divide-y divide-border">
                                    {builderUpgrades.map((upg, index) => <UpgradeTimer key={`builder-${index}`} upgrade={upg} onComplete={handleUpgradeComplete}/>)}
                                </div>
                            </Card>
                        )}
                        
                        {ongoingUpgrades.length === 0 && (
                            <Card>
                                <CardContent className="p-6 text-center space-y-4">
                                   <div className='p-4 rounded-full bg-green-500/20 inline-block'>
                                     <Check className="w-10 h-10 text-green-400" />
                                   </div>
                                   <h4 className='text-xl font-headline'>All Builders Free!</h4>
                                    <p className="text-muted-foreground max-w-md mx-auto">Your builders and laboratory are waiting for new tasks. Update your village data to get fresh AI recommendations.</p>
                                    <Button onClick={() => setIsModalOpen(true)}>
                                        <Settings className="mr-2 h-4 w-4"/>
                                        Update Data Now
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {completedUpgrades.length > 0 && (
                         <div className="space-y-4">
                             <h2 className="text-2xl font-headline flex items-center gap-3"><Check /> Recently Completed</h2>
                             <div className="space-y-2">
                                {completedUpgrades.map((item, index) => (
                                   <CompletedUpgradeItem key={index} item={item} />
                                ))}
                             </div>
                         </div>
                    )}
                </div>
            )}
        </div>
    );
}
