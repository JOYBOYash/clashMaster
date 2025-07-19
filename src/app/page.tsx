
'use client';

import { LandingPage } from '@/components/landing-page';

export default function RootPage() {
  // The landing page is accessible to both logged-in and guest users.
  // The header will provide navigation for logged-in users.
  return <LandingPage />;
}
