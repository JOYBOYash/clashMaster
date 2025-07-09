
import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { AiSuggester } from './ai-suggester';
import { BuildingList } from './building-list';
import { ProgressDashboard } from './progress-dashboard';
import { UpgradeStatus } from './upgrade-status';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <VillageOverview base={base} level={level} />
                <AiSuggester villageState={villageState} base={base} />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <ProgressDashboard buildings={buildingsForBase} />
                <UpgradeStatus buildings={buildingsForBase} />
            </div>
        </div>
      </TabsContent>
      <TabsContent value="buildings" className="mt-6">
        <BuildingList buildings={buildingsForBase} />
      </TabsContent>
    </Tabs>
  );
}
