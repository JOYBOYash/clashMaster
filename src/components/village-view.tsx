
import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { BuildingList } from './building-list';
import { ProgressDashboard } from './progress-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Hammer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface BaseDisplayProps {
  base: 'home' | 'builder';
  villageState: VillageState;
}

function BaseDisplay({ base, villageState }: BaseDisplayProps) {
    const level = base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel;
    const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

    if (base === 'builder' && buildingsForBase.length === 0) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="font-headline">Builder Base Coming Soon!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Builder Base tracking is not fully implemented yet. Please check back later for updates!</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="buildings">Buildings</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="mt-6">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <VillageOverview base={base} level={level} />
                        </div>
                        <div className="lg:col-span-1">
                            <ProgressDashboard buildings={buildingsForBase} />
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="buildings" className="mt-6">
                <BuildingList buildings={buildingsForBase} />
            </TabsContent>
        </Tabs>
    );
}


interface VillageViewProps {
  villageState: VillageState;
}

export function VillageView({ villageState }: VillageViewProps) {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto">
        <TabsTrigger value="home"><Home className='mr-2' /> Home Village</TabsTrigger>
        <TabsTrigger value="builder"><Hammer className='mr-2' /> Builder Base</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-6">
        <BaseDisplay base="home" villageState={villageState} />
      </TabsContent>
      <TabsContent value="builder" className="mt-6">
        <BaseDisplay base="builder" villageState={villageState} />
      </TabsContent>
    </Tabs>
  );
}
