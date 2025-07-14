
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function RootPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is logged in, the default page is '/upgrades'.
  // The AuthWrapper in the main layout will handle redirecting to /survey if needed.
  if (user) {
    redirect('/upgrades');
  }

  // If no user is logged in, show the public landing page.
  return <LandingPage />;
}
