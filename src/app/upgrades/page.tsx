'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench, Clock, AlertTriangle, Home, Hammer, HelpCircle, Check, Settings } from 'lucide-react';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import Image from 'next/image';
import { getImagePath, timeBadge } from '@/lib/image-paths';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Done';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`); 
    if (s > 0 && d === 0 && h === 0) parts.push(`${s}s`);
    
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
    const priorityStyles = {
        High: "bg-[#be123c] border-[#881337] text-shadow-[1px_1px_2px_#881337]",
        Medium: "bg-[#a16207] border-[#78350f] text-shadow-[1px_1px_2px_#78350f]",
        Low: "bg-[#166534] border-[#14532d] text-shadow-[1px_1px_2px_#14532d]",
    }

    return (
        <div className={cn(
            "relative p-4 rounded-md text-white border-b-4",
            priorityStyles[suggestion.priority]
        )}>
            <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-black/50 text-white text-xs font-bold uppercase rounded">{suggestion.priority} Priority</div>
            <h4 className="text-lg font-bold font-headline mt-2">{suggestion.title}</h4>
            <p className="text-sm text-white/80 mt-1">{suggestion.description}</p>
        </div>
    )
}

export default function UpgradesPage() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<VillageAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [ongoingUpgrades, setOngoingUpgrades] = useState<OngoingUpgrade[]>([]);
  const [completedUpgrades, setCompletedUpgrades] = useState<OngoingUpgrade[]>([]);

  const handleUpgradeComplete = useCallback((completedUpgrade: OngoingUpgrade) => {
    setOngoingUpgrades(prev => prev.filter(upg => upg !== completedUpgrade));
    setCompletedUpgrades(prev => [completedUpgrade, ...prev].slice(0, 5)); // Keep only the last 5
  }, []);
  
  const loadAndAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestions(null);
    setAnalysis(null);
    setOngoingUpgrades([]);
    setCompletedUpgrades([]);

    try {
      const villageExportJson = localStorage.getItem('villageExportData');
      if (!villageExportJson) {
        setError('No village data found. Please add your village JSON in Settings.');
        setLoading(false);
        return;
      }

      console.log(`Analyzing village data from local data from Settings`);
      const villageData = JSON.parse(villageExportJson);
      const villageAnalysis = analyzeVillage(villageData);
      setAnalysis(villageAnalysis);
      setOngoingUpgrades(villageAnalysis.ongoingUpgrades);
      
      const aiSuggestions = await suggestUpgrades(villageAnalysis);
      setSuggestions(aiSuggestions);

    } catch (err: any) {
      console.error("Analysis failed:", err);
      const errorMessage = err.message || 'Could not parse or analyze your village data. Check the format in Settings.';
      toast({ variant: 'destructive', title: 'Analysis Failed', description: errorMessage });
      setError(`Failed to analyze your village data. Please check your data in the Settings page.`);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAndAnalyze();
  }, [loadAndAnalyze]);

  const { homeUpgrades, builderUpgrades } = useMemo(() => {
    const home: OngoingUpgrade[] = [];
    const builder: OngoingUpgrade[] = [];
    if (ongoingUpgrades) {
        ongoingUpgrades.forEach(upg => {
            if(upg.village === 'home') home.push(upg);
            else builder.push(upg);
        });
    }
    return { homeUpgrades: home, builderUpgrades: builder };
  }, [ongoingUpgrades]);

  return (
    <div className="space-y-8 bg-upgrades-pattern">
      <Card>
        <CardHeader>
          <CardTitle>Village Upgrade Planner</CardTitle>
          <CardDescription>
            AI-powered suggestions for what to build next and a real-time view of your ongoing upgrades. Data is loaded from your manually entered JSON in Settings.
          </CardDescription>
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
                 <Button asChild variant="link" className="p-0 h-auto ml-2"><Link href="/settings">Go to Settings</Link></Button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-2xl font-headline flex items-center gap-3"><Clock /> Ongoing Upgrades</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Data not live?</span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5"><HelpCircle className="h-4 w-4"/></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>How to Refresh Your Upgrade Data</DialogTitle>
                                <DialogDescription>
                                    This app uses a manual data export from the game to see your progress. To get the latest data, follow these steps:
                                </DialogDescription>
                                </DialogHeader>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                    <li>Open Clash of Clans on your device.</li>
                                    <li>Go to **Settings** (the gear icon).</li>
                                    <li>Tap on **More Settings**.</li>
                                    <li>Scroll down and tap the **Export Village** button. This copies your village data.</li>
                                    <li>Come back here, go to the **<Link href="/settings" className='text-primary underline'>Settings</Link>** page.</li>
                                    <li>Paste the data into the "Village Export JSON" box and click **Save and Analyze**.</li>
                                </ol>
                            </DialogContent>
                        </Dialog>
                    </div>
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
                            <Button asChild>
                                <Link href="/settings">
                                    <Settings className="mr-2 h-4 w-4"/>
                                    Update Data in Settings
                                </Link>
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
