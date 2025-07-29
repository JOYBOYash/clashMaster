
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, Wrench, Clock, AlertTriangle } from 'lucide-react';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

function formatDuration(seconds: number): string {
    if (seconds <= 0) return 'Completed';

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    const parts: string[] = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 && d === 0) parts.push(`${m}m`); // Only show minutes if days are not shown
    
    return parts.length > 0 ? parts.join(' ') : '< 1m';
}

const UpgradeTimer = ({ upgrade }: { upgrade: OngoingUpgrade }) => {
  const [timeLeft, setTimeLeft] = useState(upgrade.secondsRemaining);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const totalDuration = upgrade.totalDurationInSeconds;
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="font-bold">{upgrade.name} (Level {upgrade.level})</span>
        <span className="font-mono text-sm text-primary">{formatDuration(timeLeft)}</span>
      </div>
      <Progress value={progress} />
    </div>
  );
};


const SuggestionCard = ({ suggestion }: { suggestion: UpgradeSuggestion }) => {
    const priorityColor = {
        High: 'bg-red-500/20 text-red-300 border-red-500/30',
        Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        Low: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return (
        <Card className={priorityColor[suggestion.priority]}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    <Badge variant="outline">{suggestion.priority}</Badge>
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
      
      const playerData = localStorage.getItem('playerData');
      if (!playerData) {
        setError('No player data found. Please sync your village via the Survey page first.');
        setLoading(false);
        return;
      }

      try {
        const villageData = JSON.parse(playerData);
        const villageAnalysis = analyzeVillage(villageData);
        setAnalysis(villageAnalysis);

        toast({ title: 'Analysis Complete!', description: `Found ${villageAnalysis.ongoingUpgrades.length} ongoing upgrades for ${villageAnalysis.player.name}.` });
        
        // Now get AI suggestions
        const aiSuggestions = await suggestUpgrades(villageAnalysis);
        setSuggestions(aiSuggestions);

      } catch (error: any) {
        console.error("Analysis failed:", error);
        toast({ variant: 'destructive', title: 'Analysis Failed', description: error.message || 'Could not parse or analyze your village data.' });
        setError('Failed to analyze your village data. Please try re-syncing from the Survey page.');
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
        {loading && (
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
                 <Button asChild variant="link" className="p-0 h-auto ml-2"><Link href="/survey">Go to Survey</Link></Button>
            </AlertDescription>
        </Alert>
      )}

      {!loading && !error && analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock /> Ongoing Upgrades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {analysis.ongoingUpgrades.length > 0 ? (
                        analysis.ongoingUpgrades.map((upg, index) => <UpgradeTimer key={index} upgrade={upg} />)
                    ) : (
                        <p className="text-muted-foreground text-center">No ongoing upgrades detected.</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wrench /> AI Upgrade Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestions ? (
                        suggestions.suggestions.map((sug, index) => <SuggestionCard key={index} suggestion={sug} />)
                    ) : (
                        <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /> <p className="ml-2 text-muted-foreground">AI is thinking...</p></div>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
