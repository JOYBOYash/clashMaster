
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing-page';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function RootPage() {
  const { user, loading, villageState } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is logged in, redirect them to the appropriate page
  if (user) {
    if (villageState) {
      redirect('/upgrades');
    } else {
      redirect('/survey');
    }
  }

  // If no user, show the landing page
  return <LandingPage />;
}
