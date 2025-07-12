
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing-page';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    redirect('/home');
  }

  return <LandingPage />;
}
