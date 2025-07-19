
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { LandingPage } from '@/components/landing-page';
import { LoadingSpinner } from '@/components/loading-spinner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RootPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isCheckingData, setIsCheckingData] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setIsCheckingData(false);
      return;
    }

    const checkUserData = async () => {
      if (!user.uid) return;
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data()?.playerData) {
          router.replace('/dashboard');
        } else {
          router.replace('/survey');
        }
      } catch (error) {
        console.error("Error checking user data:", error);
        // Fallback to survey page on error
        router.replace('/survey');
      }
    };

    checkUserData();

  }, [user, authLoading, router]);

  if (authLoading || (user && isCheckingData)) {
    return <LoadingSpinner />;
  }

  // If we've finished checks and there's no user, show the landing page.
  // If there is a user, the useEffect will have already initiated a redirect,
  // so we show a loader to prevent a flash of the landing page.
  if (!user) {
    return <LandingPage />;
  }

  // This loader will show during the brief period before the router.replace() completes.
  return <LoadingSpinner />;
}
