
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Home, Hammer } from 'lucide-react';
import villageData from '@/lib/village-data.json';

const townHallData = villageData.buildings.find(b => b.name === "Town Hall");
const builderHallData = { maxLevel: 10 }; // Simplified for now

export function VillageProgress({ playerData }: { playerData: any }) {
  const thProgress = townHallData ? (playerData.townHallLevel / townHallData.levels.length) * 100 : 0;
  const bhProgress = (playerData.builderHallLevel / builderHallData.maxLevel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Village Progress</CardTitle>
        <CardDescription>Your current main village and builder base levels.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Home className="h-8 w-8 text-primary" />
          <div className="flex-grow space-y-2">
            <div className="flex justify-between font-medium">
              <span>Town Hall</span>
              <span>Level {playerData.townHallLevel} / {townHallData?.levels.length}</span>
            </div>
            <Progress value={thProgress} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Hammer className="h-8 w-8 text-green-600" />
          <div className="flex-grow space-y-2">
            <div className="flex justify-between font-medium">
              <span>Builder Hall</span>
              <span>Level {playerData.builderHallLevel} / {builderHallData.maxLevel}</span>
            </div>
            <Progress value={bhProgress} className="[&>div]:bg-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
