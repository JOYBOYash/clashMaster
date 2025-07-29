
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BrainCircuit, Wrench, Clock } from 'lucide-react';
import { analyzeVillage, type VillageAnalysis, type OngoingUpgrade } from '@/lib/village-analyzer';
import { suggestUpgrades } from '@/ai/flows/suggest-upgrades';
import { type SuggestUpgradesOutput, type UpgradeSuggestion } from '@/ai/schemas';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

function formatDuration(seconds: number): string {
  if (seconds <= 0) return 'Completed';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [
    h > 0 ? `${h}h` : '',
    m > 0 ? `${m}m` : '',
    s > 0 ? `${s}s` : '',
  ].filter(Boolean).join(' ');
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
  const [jsonInput, setJsonInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VillageAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestUpgradesOutput | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jsonInput) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please paste your village JSON data.' });
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);
    setSuggestions(null);

    try {
      const villageData = JSON.parse(jsonInput);
      const villageAnalysis = analyzeVillage(villageData);
      setAnalysis(villageAnalysis);

      toast({ title: 'Analysis Complete!', description: `Found ${villageAnalysis.ongoingUpgrades.length} ongoing upgrades for ${villageAnalysis.player.name}.` });
      
      // Now get AI suggestions
      const aiSuggestions = await suggestUpgrades(villageAnalysis);
      setSuggestions(aiSuggestions);

    } catch (error: any) {
      console.error("Analysis failed:", error);
      toast({ variant: 'destructive', title: 'Analysis Failed', description: error.message || 'Could not parse or analyze the provided JSON.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Village Upgrade Planner</CardTitle>
          <CardDescription>
            Paste your village's export JSON below to see your ongoing upgrades and get AI-powered suggestions for what to build next.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your game export JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={8}
            className="font-mono text-xs"
          />
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? <Loader2 className="mr-2 animate-spin" /> : <BrainCircuit className="mr-2" />}
            Analyze My Village
          </Button>
        </CardContent>
      </Card>

      {analysis && (
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
                    {isAnalyzing && !suggestions && (
                         <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" /> <p className="ml-2 text-muted-foreground">AI is thinking...</p></div>
                    )}
                    {suggestions ? (
                        suggestions.suggestions.map((sug, index) => <SuggestionCard key={index} suggestion={sug} />)
                    ) : (
                        !isAnalyzing && <p className="text-muted-foreground text-center">AI suggestions will appear here after analysis.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
