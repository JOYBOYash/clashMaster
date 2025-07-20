
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
  Trophy, Star, HeartHandshake, Castle, Home, Medal, Swords
} from 'lucide-react';

// Component to display a single stat
const StatCard = ({ icon: Icon, title, value, footer }: { icon: React.ElementType, title: string, value: string | number, footer?: string }) => (
  <Card className="text-center transition-all hover:border-primary/50">
    <CardHeader className="pb-2">
      <div className="flex justify-center">
        <Icon className="w-8 h-8 text-primary mb-2" />
      </div>
      <CardTitle className="text-xl font-headline">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{value}</p>
      {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
    </CardContent>
  </Card>
);

// Component for Hero display
const HeroCard = ({ hero }: { hero: any }) => {
  const equipment = hero.equipment && hero.equipment.length > 0 ? hero.equipment : [];
  return (
    <div className="bg-card/50 p-4 rounded-lg flex flex-col items-center border">
      <h4 className="font-bold text-sm font-headline">{hero.name}</h4>
      <p className="text-lg font-bold text-primary">Level {hero.level}</p>
      <div className="w-full mt-2">
        <Progress value={(hero.level / hero.maxLevel) * 100} className="h-2" />
        <p className="text-xs text-center text-muted-foreground mt-1">{hero.level}/{hero.maxLevel}</p>
      </div>
      <div className="mt-4 space-y-2 w-full">
        {equipment.map((e: any, i: number) => (
          <div key={i} className="text-xs flex justify-between items-center bg-background p-1.5 rounded-md">
            <span>{e.name}</span>
            <Badge variant="secondary">Lvl {e.level}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for Troop/Spell display
const TroopCard = ({ item }: { item: any }) => (
  <div className="bg-card/50 p-3 rounded-lg flex flex-col items-center border text-center">
    <p className="font-bold text-xs font-headline flex-grow">{item.name}</p>
    <p className="text-md font-bold text-primary mt-1">Level {item.level}</p>
    <div className="w-full mt-2">
      <Progress value={(item.level / item.maxLevel) * 100} className="h-1.5" />
      <p className="text-xs text-center text-muted-foreground mt-1">{item.level}/{item.maxLevel}</p>
    </div>
  </div>
);

// Component for Achievement display
const AchievementCard = ({ achievement }: { achievement: any }) => (
  <div className="bg-card/50 p-3 rounded-lg border text-sm flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start gap-2">
        <p className="font-bold font-headline text-foreground/90">{achievement.name}</p>
        <div className="flex items-center text-amber-400 shrink-0">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < achievement.stars ? 'fill-current' : 'fill-muted'}`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{achievement.info}</p>
    </div>
    <div className="mt-2 text-right">
      <Progress value={(achievement.value / achievement.target) * 100} className="h-1" />
      <p className="text-xs text-muted-foreground mt-1">{achievement.value} / {achievement.target}</p>
    </div>
  </div>
);


export default function DashboardPage() {
  const [player, setPlayer] = useState<any | null>(null);

  useEffect(() => {
    // This now runs only on the client, preventing the hydration error
    const playerData = localStorage.getItem('playerData');
    if (playerData) {
      setPlayer(JSON.parse(playerData));
    }
  }, []);

  if (!player) {
    return <LoadingSpinner />;
  }

  const {
    name, tag, townHallLevel, builderHallLevel, expLevel, trophies, bestTrophies,
    builderBaseTrophies, bestBuilderBaseTrophies, warStars, attackWins, defenseWins,
    donations, received, clanCapitalContributions, clan, league, achievements,
    heroes, troops, spells, heroEquipment
  } = player;

  const homeHeroes = heroes.filter((h: any) => h.village === 'home');
  const homeTroops = troops.filter((t: any) => t.village === 'home' && !t.name.startsWith('Super'));
  const homeSpells = spells.filter((s: any) => s.village === 'home');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <Card className="overflow-hidden">
        <div className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-headline text-primary">{name}</h1>
            <p className="text-lg text-muted-foreground font-mono">{tag}</p>
          </div>
          <div className="flex items-start gap-4">
             {clan && (
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-bold font-headline text-sm">{clan.name}</p>
                  <p className="text-xs text-muted-foreground">Level {clan.level}</p>
                </div>
                <Image src={clan.badge.url} alt={clan.name} width={48} height={48} className="drop-shadow-lg" unoptimized/>
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-card grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
                <Home className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm font-bold">Town Hall</p>
                <p className="text-lg font-headline text-primary">{townHallLevel}</p>
            </div>
            <div className="flex flex-col items-center">
                <Castle className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm font-bold">Builder Hall</p>
                <p className="text-lg font-headline text-primary">{builderHallLevel || 'N/A'}</p>
            </div>
            <div className="flex flex-col items-center">
                <Medal className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm font-bold">XP Level</p>
                <p className="text-lg font-headline text-primary">{expLevel}</p>
            </div>
            {league && <div className="flex flex-col items-center">
                <Image src={league.icon.url} alt={league.name} width={24} height={24} unoptimized/>
                <p className="text-sm font-bold">League</p>
                <p className="text-lg font-headline text-primary text-center truncate">{league.name}</p>
            </div>}
        </div>
      </Card>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Trophy} title="Home Trophies" value={trophies} footer={`Best: ${bestTrophies}`} />
        <StatCard icon={Swords} title="Builder Trophies" value={builderBaseTrophies || 0} footer={`Best: ${bestBuilderBaseTrophies || 0}`} />
        <StatCard icon={Star} title="War Stars" value={warStars} />
        <StatCard icon={HeartHandshake} title="Donations" value={donations} footer={`Received: ${received}`} />
      </div>

      {/* Heroes Section */}
      <div>
        <h2 className="text-2xl font-headline mb-4">Heroes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {homeHeroes.map((hero: any) => <HeroCard key={hero.name} hero={hero} />)}
        </div>
      </div>
      
      {/* Troops & Spells Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h2 className="text-2xl font-headline mb-4">Troops</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {homeTroops.map((item: any) => <TroopCard key={item.name} item={item} />)}
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-headline mb-4">Spells</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {homeSpells.map((item: any) => <TroopCard key={item.name} item={item} />)}
            </div>
        </div>
      </div>

       {/* Achievements Section */}
      <div>
        <h2 className="text-2xl font-headline mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.filter((a: any) => a.value > 0).slice(0, 9).map((ach: any) => (
            <AchievementCard key={ach.name} achievement={ach} />
          ))}
        </div>
      </div>
    </div>
  );
}
