
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, Star, HeartHandshake, Castle, Home, Medal, Swords, Axe, Hammer, Droplets, FlaskConical, BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImagePath } from '@/lib/image-paths';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <Icon className="w-8 h-8 text-primary" />
    <h2 className="text-3xl font-headline">{title}</h2>
  </div>
);

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

const HeroCard = ({ hero }: { hero: any }) => {
  const isMaxed = hero.level === hero.maxLevel;
  const heroImage = getImagePath(hero.name);
  const heroEquipment = hero.equipment || [];

  return (
    <div className={cn(
      "relative bg-card shadow-lg border border-border/20 overflow-hidden rounded-xl",
      "transition-all duration-300 hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-1",
      isMaxed && "border-amber-400/80 bg-amber-400/10 shadow-lg shadow-amber-400/10"
    )}>
      {isMaxed && <Badge className="absolute top-2 right-2 bg-amber-500 text-white shadow-md z-10">MAX</Badge>}
      
      <div className="relative w-full h-48">
        <Image src={heroImage} alt={hero.name} fill className="object-cover object-center" unoptimized />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
      </div>
      
      <div className="p-4 relative -mt-12 z-10">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-2xl text-foreground/90 drop-shadow-sm">{hero.name}</h3>
          <div className="bg-primary/90 text-primary-foreground rounded-full px-4 py-1 text-xl font-bold font-headline shadow-lg">
            {hero.level}
          </div>
        </div>
        <Progress value={(hero.level / hero.maxLevel) * 100} className="mt-2 h-2" />
        <p className="text-xs text-center text-muted-foreground mt-1">{hero.level}/{hero.maxLevel}</p>

        {heroEquipment.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-center gap-3">
              <TooltipProvider>
                {heroEquipment.map((equip: any, index: number) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="w-12 h-12 bg-muted/50 rounded-lg p-1.5 border border-border/50 flex items-center justify-center transition-all hover:scale-110 hover:border-primary/50">
                        <Image src={getImagePath(equip.name)} alt={equip.name} width={40} height={40} unoptimized />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{equip.name}</p>
                      <p className="text-sm text-muted-foreground">Level {equip.level}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const TroopSpellCard = ({ item }: { item: any }) => {
  const isMaxed = item.level === item.maxLevel;
  const imagePath = getImagePath(item.name);

  return (
    <div className={cn(
      "relative bg-card/60 aspect-square rounded-xl border-2 border-transparent p-2 flex flex-col items-center justify-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50",
      isMaxed && "border-amber-400/80 bg-amber-400/10 shadow-amber-400/10"
    )}>
      {isMaxed && <Badge variant="default" className="absolute top-1 right-1 text-xs px-1 py-0.5 h-auto bg-amber-500 text-white shadow-md z-10">MAX</Badge>}
      
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-grow">
        <Image src={imagePath} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
      </div>

      <div className="w-full text-center mt-2">
        <p className="font-headline text-sm truncate">{item.name}</p>
        <p className="font-bold text-lg text-primary">Lvl {item.level}</p>
        <Progress value={(item.level / item.maxLevel) * 100} className="h-1.5 mt-1" />
      </div>
    </div>
  );
};


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

const CategoryGrid = ({ title, icon: Icon, items }: { title: string, icon: React.ElementType, items: any[] }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <h4 className="text-xl font-headline text-foreground/80">{title}</h4>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {items.map((item: any) => <TroopSpellCard key={item.name} item={item} />)}
      </div>
    </div>
  );
}

const preloadImages = (urls: string[], onProgress: (progress: number) => void) => {
  let loadedCount = 0;
  const totalImages = urls.length;
  onProgress(0);

  if (totalImages === 0) {
    onProgress(100);
    return Promise.resolve([]);
  }

  const promises = urls.map(url => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = url;
      const onDone = () => {
        loadedCount++;
        onProgress((loadedCount / totalImages) * 100);
        resolve(true);
      };
      img.onload = onDone;
      img.onerror = onDone; // Resolve even on error to not block the page
    });
  });

  return Promise.allSettled(promises);
};


export default function DashboardPage() {
  const [player, setPlayer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    const playerData = localStorage.getItem('playerData');
    if (playerData) {
      try {
        const parsedPlayer = JSON.parse(playerData);
        setPlayer(parsedPlayer);
        
        const imageUrls = [
          parsedPlayer.clan?.badge?.url,
          parsedPlayer.league?.icon?.url,
          ...parsedPlayer.heroes.map((h: any) => getImagePath(h.name)),
          ...parsedPlayer.heroes.flatMap((h: any) => h.equipment?.map((e: any) => getImagePath(e.name)) || []),
          ...parsedPlayer.troops.map((t: any) => getImagePath(t.name)),
          ...parsedPlayer.spells.map((s: any) => getImagePath(s.name)),
          ...(parsedPlayer.siegeMachines || []).map((s: any) => getImagePath(s.name)),
        ].filter(Boolean);

        setTotalImages(imageUrls.length);

        await preloadImages(imageUrls, setLoadingProgress);
        setIsFullyLoaded(true);

      } catch (error) {
        console.error("Failed to parse or preload player data", error);
        localStorage.removeItem('playerData');
        router.push('/survey');
      }
    } else {
        router.push('/survey');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);


  if (loading || !isFullyLoaded) {
    return <LoadingSpinner show={true} progress={loadingProgress} total={totalImages} />;
  }

  const {
    name, tag, townHallLevel, builderHallLevel, expLevel, trophies, bestTrophies,
    builderBaseTrophies, bestBuilderBaseTrophies, warStars, attackWins, defenseWins,
    donations, received, clan, league, achievements, heroes, troops, spells, siegeMachines
  } = player;

  const homeHeroes = heroes.filter((h: any) => h.village === 'home' && h.name !== 'Battle Machine' && h.name !== 'Battle Copter');
  const builderHeroes = heroes.filter((h: any) => h.village === 'builderBase' || h.name === 'Battle Machine' || h.name === 'Battle Copter');
  
  const homeTroops = troops.filter((t: any) => t.village === 'home' && !t.name.startsWith('Super'));
  const superTroops = troops.filter((t: any) => t.village === 'home' && t.name.startsWith('Super'));
  
  const elixirTroops = homeTroops.filter((t: any) => t.upgradeResource === 'Elixir');
  const darkElixirTroops = homeTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir');
  
  const homeSpells = spells.filter((s: any) => s.village === 'home');
  const elixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Elixir');
  const darkElixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir');

  const builderTroops = troops.filter((t: any) => t.village === 'builderBase');
  
  const homeSiegeMachines = siegeMachines?.filter((s: any) => s.village === 'home') ?? [];

  return (
    <div className={cn("space-y-12 pb-12 transition-opacity duration-500", isFullyLoaded ? 'opacity-100' : 'opacity-0')}>
      {/* Header */}
      <Card className="overflow-hidden shadow-2xl">
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
        <div className="p-4 bg-card grid grid-cols-2 md:grid-cols-4 gap-4 text-center items-center">
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
            {league && (
              <div className="flex flex-col items-center justify-center">
                <Image src={league.icon.url} alt={league.name} width={64} height={64} unoptimized />
                <p className="text-xs text-muted-foreground mt-1 text-center truncate">{league.name}</p>
              </div>
            )}
        </div>
      </Card>

      {/* Home Village Section */}
      <div className="space-y-8">
        <SectionTitle icon={Axe} title="Home Village" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Trophy} title="Trophies" value={trophies} footer={`Best: ${bestTrophies}`} />
          <StatCard icon={Star} title="War Stars" value={warStars} />
          <StatCard icon={HeartHandshake} title="Donations" value={donations} footer={`Received: ${received}`} />
        </div>
        
        <div>
          <h3 className="text-2xl font-headline mb-4">Heroes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {homeHeroes.map((hero: any) => <HeroCard key={hero.name} hero={hero} />)}
          </div>
        </div>

        <div className="space-y-6">
             <h3 className="text-2xl font-headline mb-4">Army</h3>
             <CategoryGrid title="Elixir Troops" icon={Droplets} items={elixirTroops} />
             <CategoryGrid title="Dark Elixir Troops" icon={FlaskConical} items={darkElixirTroops} />
             <CategoryGrid title="Super Troops" icon={BrainCircuit} items={superTroops} />
        </div>
        
         <div className="space-y-6">
            <h3 className="text-2xl font-headline mb-4">Spells</h3>
             <CategoryGrid title="Elixir Spells" icon={Droplets} items={elixirSpells} />
             <CategoryGrid title="Dark Elixir Spells" icon={FlaskConical} items={darkElixirSpells} />
        </div>

        <div className="space-y-6">
            <h3 className="text-2xl font-headline mb-4">Siege Machines</h3>
            <CategoryGrid title="Siege Machines" icon={Castle} items={homeSiegeMachines} />
        </div>
      </div>
      
      <Separator className="my-12" />

      {/* Builder Base Section */}
      <div className="space-y-8">
        <SectionTitle icon={Hammer} title="Builder Base" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Swords} title="Trophies" value={builderBaseTrophies || 0} footer={`Best: ${bestBuilderBaseTrophies || 0}`} />
        </div>
        
        <div>
          <h3 className="text-2xl font-headline mb-4">Heroes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {builderHeroes.map((hero: any) => <HeroCard key={hero.name} hero={hero} />)}
          </div>
        </div>

        <div>
            <h3 className="text-2xl font-headline mb-4">Troops</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {builderTroops.map((item: any) => <TroopSpellCard key={item.name} item={item} />)}
            </div>
        </div>
      </div>

       <Separator className="my-12" />

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
