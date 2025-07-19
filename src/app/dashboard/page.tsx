
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

export default function DashboardPage() {
  const [playerData, setPlayerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('playerData');
      if (savedData) {
        setPlayerData(JSON.parse(savedData));
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!playerData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-lg text-muted-foreground mb-4">No player data found. Please search for a player first.</p>
        <Button onClick={() => router.push('/survey')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Survey
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
}
