
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LandingPage } from '@/components/landing-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function RootPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
        // If user is logged in, they will be directed from either the
        // auth page or if they land here, to the dashboard.
        router.replace('/dashboard');
    }

  }, [user, authLoading, router]);

  // Show a loader while auth state is being determined or if a redirect is imminent.
  if (authLoading || user) {
    return <LoadingSpinner />;
  }
  
  // If not loading and no user, show the landing page.
  return <LandingPage />;
}
