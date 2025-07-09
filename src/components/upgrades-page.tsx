"use client";

import type { VillageState } from '@/lib/constants';
import { AiSuggester } from './ai-suggester';
import { UpgradeStatus } from './upgrade-status';

interface UpgradesPageProps {
  villageState: VillageState;
}

export function UpgradesPage({ villageState }: UpgradesPageProps) {
  const buildingsForHomeBase = (villageState.buildings || []).filter(b => b.base === 'home');

  return (
    <div className="space-y-8">
      <AiSuggester villageState={villageState} base="home" />
      <UpgradeStatus buildings={buildingsForHomeBase} />
    </div>
  );
}
