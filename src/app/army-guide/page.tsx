"use client";

import { AuthWrapper } from '@/components/auth-wrapper';
import { TroopGuide } from '@/components/troop-guide';

export default function ArmyGuidePage() {
  return (
    <AuthWrapper>
      {(villageState) => <TroopGuide villageState={villageState} />}
    </AuthWrapper>
  );
}
