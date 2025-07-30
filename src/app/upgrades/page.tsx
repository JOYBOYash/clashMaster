
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wrench, Clock, AlertTriangle } from 'lucide-react';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import Image from 'next/image';
import { getImagePath } from '@/lib/image-paths';
import { cn } from '@/lib/utils';

function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Completed';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 && d === 0) parts.push(`${m}m`); 
    if (s > 0 && d === 0 && h === 0) parts.push(`${s}s`);
    
    return parts.length > 0 ? parts.join(' ') : '< 1m';
}

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
        : 0;

    return (
        <Card className="overflow-hidden bg-muted/50 border-primary/20">
            <div className="flex items-center gap-4 p-4">
                <div className="relative shrink-0 w-16 h-16 bg-black/20 rounded-md p-1 border border-border">
                    <Image 
                        src={imagePath} 
                        alt={upgrade.name} 
                        fill 
                        className="object-contain" 
                        unoptimized 
                    />
                </div>
                <div className="flex-grow space-y-1.5">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                        <span className="font-bold font-headline text-lg truncate pr-2">{upgrade.name} {upgrade.level > 0 ? `(to Lvl ${upgrade.level})` : ''}</span>
                        <span className="font-mono text-base text-primary/90">{formatDuration(timeLeft)}</span>
                    </div>
                    {upgrade.totalDurationInSeconds > 0 && (
                        <div className="relative h-2.5 w-full bg-black/20 rounded-full overflow-hidden border border-primary/20">
                            <Progress value={progress} className="absolute h-full w-full left-0 top-0"/>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};


const SuggestionCard = ({ suggestion }: { suggestion: UpgradeSuggestion }) => {
    const priorityColor = {
        High: 'bg-red-900/30 text-red-300 border-red-500/30 hover:border-red-500/60',
        Medium: 'bg-yellow-800/20 text-yellow-300 border-yellow-500/30 hover:border-yellow-500/60',
        Low: 'bg-green-900/30 text-green-400 border-green-500/30 hover:border-green-500/60',
    };
    return (
        <Card className={cn("transition-all",priorityColor[suggestion.priority])}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <Badge variant="outline" className={cn("border-current")}>{suggestion.priority}</Badge>
                </div>
            </CardHeader>
            <CardContent>
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
      
      const villageExportJson = localStorage.getItem('villageExportData');
      if (!villageExportJson) {
        setError('No village data found. Please paste your village export JSON in the Settings page first.');
        setLoading(false);
        return;
      }

      try {
        const villageData = JSON.parse(villageExportJson);
        const villageAnalysis = analyzeVillage(villageData);
        setAnalysis(villageAnalysis);

        if (villageAnalysis.ongoingUpgrades.length > 0) {
            toast({ title: 'Analysis Complete!', description: `Found ${villageAnalysis.ongoingUpgrades.length} ongoing upgrades for ${villageAnalysis.player.name}.` });
        } else {
             toast({ title: 'Analysis Complete!', description: `No ongoing upgrades found. Time to get building!` });
        }
        
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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Village Upgrade Planner</CardTitle>
          <CardDescription>
            Analyzing your village to see your ongoing upgrades and get AI-powered suggestions for what to build next.
          </CardDescription>
        </CardHeader>
        {loading && !error && (
            <CardContent>
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="mr-2 animate-spin" />
                    <p>Analyzing your village...</p>
                </div>
            </CardContent>
        )}
      </Card>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Clock /> Ongoing Upgrades</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analysis.ongoingUpgrades.length > 0 ? (
                            analysis.ongoingUpgrades.map((upg, index) => <UpgradeTimer key={index} upgrade={upg} />)
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No ongoing upgrades detected.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wrench /> AI Upgrade Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {suggestions ? (
                            suggestions.suggestions.map((sug, index) => <SuggestionCard key={index} suggestion={sug} />)
                        ) : (
                            <div className="flex justify-center items-center h-full min-h-[20rem]">
                                <Loader2 className="animate-spin text-primary w-8 h-8" />
                                <p className="ml-3 text-muted-foreground">AI is thinking...</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}

