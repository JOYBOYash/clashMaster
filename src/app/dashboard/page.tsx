
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, Star, HeartHandshake, Castle, Axe, Hammer, Droplets, FlaskConical, BrainCircuit, Medal, Swords
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImagePath, getHallImagePath } from '@/lib/image-paths';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div
      className={cn(
        "relative bg-card shadow-lg border border-border/20 overflow-hidden rounded-xl group",
        "transition-all duration-300 hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-1",
        isMaxed && "border-amber-400/80 bg-amber-400/10 shadow-lg shadow-amber-400/10"
      )}
    >
      <div className="absolute top-2 right-2 z-20">
        <div className={cn(
          "bg-primary/90 text-primary-foreground rounded-full px-4 py-1 text-2xl font-bold font-headline shadow-lg",
          "transition-all duration-300"
        )}>
          {hero.level}
        </div>
      </div>
      
      <div className="relative w-full h-48 md:h-56">
        <Image 
          src={heroImage} 
          alt={hero.name} 
          fill 
          className={cn(
            "object-cover object-top transition-transform duration-300 ease-in-out",
            "group-hover:scale-110"
          )} 
          unoptimized 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent"></div>
      </div>
      
      <div className="p-4 relative -mt-16 z-10">
        <div 
            className={cn(
                "transition-opacity duration-300"
            )}
        >
            <h3 className="font-headline text-2xl text-foreground/90 drop-shadow-sm truncate">{hero.name}</h3>
            <Progress value={(hero.level / hero.maxLevel) * 100} className="mt-2 h-2" />
            <p className="text-xs text-center text-muted-foreground mt-1">{hero.level}/{hero.maxLevel}</p>
        </div>

        {heroEquipment.length > 0 && (
          <>
            <Separator className="my-3" />
            <div className="flex items-center justify-center gap-3 h-12">
              <TooltipProvider>
                {heroEquipment.map((equip: any, index: number) => (
                  <Tooltip key={index} delayDuration={0}>
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
        "relative group bg-card/60 aspect-square rounded-xl border border-border/20 p-2 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:shadow-primary/20",
        isMaxed && "border-amber-400/60 bg-amber-400/10 shadow-amber-400/10"
      )}>
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-grow transition-transform duration-300 group-hover:scale-110">
          <Image src={imagePath} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
        </div>
  
        <div className="w-full text-center mt-2">
          <p className="font-headline text-sm truncate">{item.name}</p>
          <div className="relative h-6 mt-1 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <div className="absolute inset-0">
              <p className="font-bold text-lg text-primary leading-tight">Lvl {item.level}</p>
              <Progress value={(item.level / item.maxLevel) * 100} className="h-1.5" />
            </div>
          </div>
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
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
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
          getHallImagePath('townHall', parsedPlayer.townHallLevel),
          getHallImagePath('builderHall', parsedPlayer.builderHallLevel),
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
  
  const homeTroops = troops.filter((t: any) => t.village === 'home');
  const regularTroops = homeTroops.filter((t: any) => !t.superTroopIsActive && t.category !== 'SiegeMachine');

  const elixirTroops = regularTroops.filter((t: any) => t.upgradeResource === 'Elixir');
  const darkElixirTroops = regularTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir');
  
  const homeSpells = spells.filter((s: any) => s.village === 'home');
  const elixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Elixir');
  const darkElixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir');

  const builderTroops = troops.filter((t: any) => t.village === 'builderBase');
  
  const homeSiegeMachines = siegeMachines ?? [];

  return (
    <div className={cn("space-y-12 pb-12 transition-opacity duration-500", isFullyLoaded ? 'opacity-100' : 'opacity-0')}>
      {/* Header */}
      <Card className="overflow-hidden shadow-2xl" no-hover>
        <div className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-center">
                <Medal className="w-8 h-8 text-muted-foreground" />
                <p className="text-2xl font-headline text-primary">{expLevel}</p>
            </div>
            <div>
                <h1 className="text-4xl font-headline text-primary">{name}</h1>
                <p className="text-lg text-muted-foreground font-mono">{tag}</p>
            </div>
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
      </Card>
      
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="home">
            <Axe className="mr-2" /> Home Village
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Hammer className="mr-2" /> Builder Base
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
            <Card no-hover className="mt-4">
                <CardContent className="pt-6 space-y-8">
                     <div className="p-6 bg-card/50 grid grid-cols-1 md:grid-cols-2 gap-6 text-center items-center rounded-xl mb-6 border-2 border-border/20 shadow-inner">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <h3 className="font-headline text-2xl">Town Hall {townHallLevel}</h3>
                            <div className="relative w-40 h-40 md:w-48 md:h-48">
                                <Image src={getHallImagePath('townHall', townHallLevel)} alt={`Town Hall ${townHallLevel}`} fill className="object-contain" unoptimized />
                            </div>
                        </div>
                        {league && (
                          <div className="flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 md:w-40 md:h-40">
                                <Image src={league.icon.url} alt={league.name} fill className="object-contain" unoptimized />
                            </div>
                            <p className="text-lg font-bold text-muted-foreground mt-2 text-center truncate">{league.name}</p>
                          </div>
                        )}
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard icon={Trophy} title="Trophies" value={trophies} footer={`Best: ${bestTrophies}`} />
                        <StatCard icon={Star} title="War Stars" value={warStars} />
                        <StatCard icon={HeartHandshake} title="Donations" value={donations} footer={`Received: ${received}`} />
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-headline mb-4">Heroes</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {homeHeroes.map((hero: any) => <HeroCard key={hero.name} hero={hero} />)}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-2xl font-headline mb-4">Army</h3>
                        <CategoryGrid title="Elixir Troops" icon={Droplets} items={elixirTroops} />
                        <CategoryGrid title="Dark Elixir Troops" icon={FlaskConical} items={darkElixirTroops} />
                    </div>
                    
                    <div className="space-y-6">
                        <h3 className="text-2xl font-headline mb-4">Spells</h3>
                        <CategoryGrid title="Elixir Spells" icon={Droplets} items={elixirSpells} />
                        <CategoryGrid title="Dark Elixir Spells" icon={FlaskConical} items={darkElixirSpells} />
                    </div>

                    <div className="space-y-6">
                        <CategoryGrid title="Siege Machines" icon={Castle} items={homeSiegeMachines} />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="builder">
            <Card no-hover className="mt-4">
                <CardContent className="pt-6 space-y-8">
                    <div className="p-4 bg-card grid grid-cols-1 md:grid-cols-2 gap-4 text-center items-center rounded-lg mb-6">
                        <div className="flex flex-col items-center justify-center space-y-2">
                           <h3 className="font-headline text-lg">Builder Hall {builderHallLevel}</h3>
                           {builderHallLevel > 0 ? (
                             <Image src={getHallImagePath('builderHall', builderHallLevel)} alt={`Builder Hall ${builderHallLevel}`} width={128} height={128} unoptimized />
                           ) : <div className="w-[128px] h-[128px] flex items-center justify-center text-muted-foreground">N/A</div> }
                       </div>
                        <StatCard icon={Swords} title="Trophies" value={builderBaseTrophies || 0} footer={`Best: ${bestBuilderBaseTrophies || 0}`} />
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-headline mb-4">Heroes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {builderHeroes.map((hero: any) => <HeroCard key={hero.name} hero={hero} />)}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-headline mb-4">Troops</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                        {builderTroops.map((item: any) => <TroopSpellCard key={item.name} item={item} />)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

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
