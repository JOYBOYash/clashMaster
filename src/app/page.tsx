
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

  if (user) {
    redirect('/home');
  }

  return <LandingPage />;
}
