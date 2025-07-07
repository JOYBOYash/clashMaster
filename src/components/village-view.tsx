
import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { AiSuggester } from './ai-suggester';
import { BuildingList } from './building-list';
import { ProgressDashboard } from './progress-dashboard';
import { UpgradeStatus } from './upgrade-status';

interface VillageViewProps {
  base: 'home' | 'builder';
  villageState: VillageState;
}

export function VillageView({ base, villageState }: VillageViewProps) {
  const level = base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel;
  const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

  return (
    <div className="space-y-8">
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
      
      <div className="lg:col-span-3">
        <BuildingList buildings={buildingsForBase} />
      </div>
    </div>
  );
}
