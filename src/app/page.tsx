
"use client";

import { useAuth } from '@/context/auth-context';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing-page';

export default function RootPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* You can add a more sophisticated loading spinner here if desired */}
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    redirect('/home');
  }

  return <LandingPage />;
}
