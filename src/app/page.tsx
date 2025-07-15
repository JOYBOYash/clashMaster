
"use client";

import { useAuth } from '@/context/auth-context';
import { LandingPage } from '@/components/landing-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function RootPage() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Always show the landing page, regardless of login state.
  return <LandingPage />;
}
