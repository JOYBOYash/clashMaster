import type { VillageState } from '@/lib/constants';
import { VillageOverview } from './village-overview';
import { CurrentUpgrades } from './current-upgrades';
import { AiSuggester } from './ai-suggester';

interface VillageViewProps {
  base: 'home' | 'builder';
  villageState: VillageState;
}

export function VillageView({ base, villageState }: VillageViewProps) {
  const level = base === 'home' ? villageState.townHallLevel : villageState.builderHallLevel;
  const buildingsForBase = villageState.buildings.filter(b => b.base === base);

  return (
    <div className="space-y-8">
      <VillageOverview base={base} level={level} resources={villageState.resources} />
      <CurrentUpgrades buildings={buildingsForBase} />
      <AiSuggester villageState={villageState} />
    </div>
  );
}
