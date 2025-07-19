<<<<<<< HEAD
// This page has been removed.
export default function DashboardPage() {
  return null;
=======

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerHeader } from '@/components/dashboard/player-header';
import { StatCards } from '@/components/dashboard/stat-cards';
import { VillageProgress } from '@/components/dashboard/village-progress';
import { TroopAndHeroGrids } from '@/components/dashboard/troop-hero-grids';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const [playerData, setPlayerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!user) {
        // If user is not logged in, redirect them to the sign-in page
        router.replace('/sign-in');
        return;
      }
      
      setLoading(true);
      
      let data = null;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().playerData) {
        data = userDocSnap.data().playerData;
      }
      
      setPlayerData(data);
      setLoading(false);
    };

    fetchData();
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  if (!playerData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-lg text-muted-foreground mb-4">No player data found. Please link your village first.</p>
        <Button onClick={() => router.push('/survey')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Link Your Village
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PlayerHeader playerData={playerData} />
      <StatCards playerData={playerData} />
      <VillageProgress playerData={playerData} />
      <TroopAndHeroGrids playerData={playerData} />
    </div>
  );
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
}
