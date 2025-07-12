"use client";

import { AuthWrapper } from '@/components/auth-wrapper';
import { UpgradesPage } from '@/components/upgrades-page';

export default function Upgrades() {
  return (
    <AuthWrapper>
      {(villageState) => <UpgradesPage villageState={villageState} />}
    </AuthWrapper>
  );
}
