
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
      <VillageOverview base={base} level={level} resources={villageState.resources} />
      <ProgressDashboard buildings={buildingsForBase} />
      <CurrentUpgrades buildings={buildingsForBase} onUpdate={onUpdate} villageState={villageState} />
      <AiSuggester villageState={villageState} />
      <BuildingList buildings={buildingsForBase} onUpdate={onUpdate} villageState={villageState} />
    </div>
  );
}
