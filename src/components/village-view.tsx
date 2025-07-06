
import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { CurrentUpgrades } from './current-upgrades';
import { AiSuggester } from './ai-suggester';
import { BuildingList } from './building-list';
import { ProgressDashboard } from './progress-dashboard';

interface VillageViewProps {
  base: 'home' | 'builder';
  villageState: VillageState;
  onUpdate: (newState: VillageState) => void;
}

export function VillageView({ base, villageState, onUpdate }: VillageViewProps) {
  const level = base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel;
  const buildingsForBase = (villageState.buildings || []).filter(b => b.base === base);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VillageOverview base={base} level={level} />
        </div>
        <div className="lg:col-span-1">
          <ProgressDashboard buildings={buildingsForBase} />
        </div>
      </div>
      
      <AiSuggester villageState={villageState} base={base} />

      <CurrentUpgrades buildings={buildingsForBase} onUpdate={onUpdate} villageState={villageState} />

      <div className="lg:col-span-3">
        <BuildingList buildings={buildingsForBase} onUpdate={onUpdate} villageState={villageState} />
      </div>
    </div>
  );
}
