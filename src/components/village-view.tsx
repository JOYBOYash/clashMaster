
import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { BuildingList } from './building-list';
import { ProgressDashboard } from './progress-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExploreSection } from './explore-section';

interface VillageViewProps {
  base: 'home' | 'builder';
  villageState: VillageState;
}

export function VillageView({ base, villageState }: VillageViewProps) {
  const level = base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel;
  const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

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
            <ExploreSection />
        </div>
      </TabsContent>
      <TabsContent value="buildings" className="mt-6">
        <BuildingList buildings={buildingsForBase} />
      </TabsContent>
    </Tabs>
  );
}
