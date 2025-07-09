"use client";

import { AuthWrapper } from '@/components/auth-wrapper';
import { ExploreSection } from '@/components/explore-section';

export default function ExplorePage() {
  return (
    <AuthWrapper>
      {(villageState) => <ExploreSection villageState={villageState} />}
    </AuthWrapper>
  );
}
