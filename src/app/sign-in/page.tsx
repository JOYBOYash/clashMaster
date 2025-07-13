"use client";

import { AuthWrapper } from '@/components/auth-wrapper';
import { VillageView } from '@/components/village-view';

export default function HomePage() {
  return (
    <AuthWrapper>
      {(villageState) => <VillageView villageState={villageState} />}
    </AuthWrapper>
  );
}
