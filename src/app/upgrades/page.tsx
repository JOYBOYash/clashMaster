
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench, Clock, AlertTriangle, Home, Hammer } from 'lucide-react';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import Image from 'next/image';
import { getImagePath, timeBadge } from '@/lib/image-paths';
import { cn } from '@/lib/utils';

function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Done';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 && d === 0) parts.push(`${m}m`); 
    
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

const UpgradeTimer = ({ upgrade }: { upgrade: OngoingUpgrade }) => {
    const [timeLeft, setTimeLeft] = useState(upgrade.secondsRemaining);
    const imagePath = getImagePath(upgrade.name.replace(/ Research$/, ''));

    useEffect(() => {
        if (timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [timeLeft]);

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
                 <span className="font-bold text-sm text-foreground/80 min-w-[50px] text-right">
                    {formatDuration(timeLeft)}
                </span>
            </div>
        </div>
    );
};


const SuggestionCard = ({ suggestion }: { suggestion: UpgradeSuggestion }) => {
    const priorityColor = {
        High: 'bg-red-900/30 text-red-300 border-red-500/30 hover:border-red-500/60',
        Medium: 'bg-yellow-800/20 text-yellow-300 border-yellow-500/30 hover:border-yellow-500/60',
        Low: 'bg-green-900/30 text-green-400 border-green-500/30 hover:border-green-500/60',
    };
    return (
        <Card className={cn("transition-all h-full flex flex-col", priorityColor[suggestion.priority])}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <Badge variant="outline" className={cn("border-current")}>{suggestion.priority}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </CardContent>
        </Card>
    )
}

export default function UpgradesPage() {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<VillageAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAndAnalyze() {
      setLoading(true);
      setError(null);
      setSuggestions(null);
      
      const villageExportJson = localStorage.getItem('villageExportData');
      if (!villageExportJson) {
        setError('No village data found. Please add your village JSON in Settings.');
        setLoading(false);
        return;
      }

      try {
        const villageData = JSON.parse(villageExportJson);
        const villageAnalysis = analyzeVillage(villageData);
        setAnalysis(villageAnalysis);
        
        const aiSuggestions = await suggestUpgrades(villageAnalysis);
        setSuggestions(aiSuggestions);

      } catch (error: any) {
        console.error("Analysis failed:", error);
        toast({ variant: 'destructive', title: 'Analysis Failed', description: error.message || 'Could not parse or analyze your village data. Check the format in Settings.' });
        setError('Failed to analyze your village data. Please check the JSON in the Settings page or re-paste it.');
      } finally {
        setLoading(false);
      }
    }
    
    loadAndAnalyze();
  }, [toast]);

  const { homeUpgrades, builderUpgrades } = useMemo(() => {
    const home: OngoingUpgrade[] = [];
    const builder: OngoingUpgrade[] = [];
    if (analysis?.ongoingUpgrades) {
        analysis.ongoingUpgrades.forEach(upg => {
            if(upg.village === 'home') home.push(upg);
            else builder.push(upg);
        });
    }
    return { homeUpgrades: home, builderUpgrades: builder };
  }, [analysis]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Village Upgrade Planner</CardTitle>
          <CardDescription>
            AI-powered suggestions for what to build next and a real-time view of your ongoing upgrades. Data is loaded from your saved settings.
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
                            {suggestions.suggestions.map((sug, index) => <SuggestionCard key={index} suggestion={sug} />)}
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
                <h2 className="text-2xl font-headline flex items-center gap-3"><Clock /> Ongoing Upgrades</h2>
                
                {homeUpgrades.length > 0 && (
                    <Card no-hover className="overflow-hidden">
                        <UpgradeSectionHeader title="Home Village" icon={Home} />
                        <div className="divide-y divide-border">
                            {homeUpgrades.map((upg, index) => <UpgradeTimer key={`home-${index}`} upgrade={upg} />)}
                        </div>
                    </Card>
                )}

                {builderUpgrades.length > 0 && (
                     <Card no-hover className="overflow-hidden">
                        <UpgradeSectionHeader title="Builder Base" icon={Hammer} />
                         <div className="divide-y divide-border">
                            {builderUpgrades.map((upg, index) => <UpgradeTimer key={`builder-${index}`} upgrade={upg} />)}
                        </div>
                    </Card>
                )}
                
                {analysis.ongoingUpgrades.length === 0 && (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-muted-foreground text-center py-4">No ongoing upgrades detected in either village.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
