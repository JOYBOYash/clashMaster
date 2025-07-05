
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wand2, FlaskConical, Droplet } from 'lucide-react';
import type { VillageState } from '@/lib/constants';
import { suggestArmy, type SuggestArmyInput, type SuggestArmyOutput } from '@/ai/flows/suggest-army';
import { useToast } from '@/hooks/use-toast';

interface TroopGuideProps {
    villageState: VillageState;
}

export function TroopGuide({ villageState }: TroopGuideProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<SuggestArmyOutput | null>(null);
    const { toast } = useToast();

    const homeTroops = villageState.troops.filter(t => t.village === 'home');

    const handleSuggestArmy = async () => {
        setIsLoading(true);
        setSuggestion(null);

        try {
            const input: SuggestArmyInput = {
                townHallLevel: villageState.townHallLevel,
                troops: homeTroops.map(t => ({ name: t.name, level: t.level })),
            };
            const result = await suggestArmy(input);
            setSuggestion(result);
        } catch (error) {
            console.error("Failed to get army suggestion:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch army suggestion. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">AI Army Advisor</CardTitle>
                    <CardDescription>Get a powerful army composition suggestion based on your troop levels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleSuggestArmy} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Wand2 className="mr-2" />}
                        Suggest Army Composition
                    </Button>

                    {suggestion && (
                        <Alert className="mt-6">
                            <AlertTitle className="font-headline flex items-center">
                                <Wand2 className="mr-2" />
                                {suggestion.armyName}
                            </AlertTitle>
                            <AlertDescription>
                                <p className="mb-4">{suggestion.description}</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {suggestion.units.map((unit, index) => (
                                        <li key={index}><strong>{unit.count}x</strong> {unit.name}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Troops (Home Village)</CardTitle>
                    <CardDescription>All your unlocked troops and their current levels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Troop</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Max Level</TableHead>
                                <TableHead>Cost Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {homeTroops.sort((a,b) => a.name.localeCompare(b.name)).map(troop => (
                                <TableRow key={troop.id}>
                                    <TableCell className="font-medium">{troop.name}</TableCell>
                                    <TableCell>{troop.level}</TableCell>
                                    <TableCell>{troop.maxLevel}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {troop.elixirType === 'regular' && <Droplet className="w-4 h-4 text-pink-500" />}
                                            {troop.elixirType === 'dark' && <FlaskConical className="w-4 h-4 text-indigo-500" />}
                                            <span className="ml-2 capitalize">{troop.elixirType}</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
