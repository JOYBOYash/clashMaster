
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, Star, HeartHandshake, Castle, Axe, Hammer, Droplets, FlaskConical, Swords, Medal, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getImagePath, getHallImagePath, superTroopNames } from '@/lib/image-paths';
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
  const heroEquipment = hero.equipment || [];

  return (
    <div
      className={cn(
        "group relative aspect-[3/5] w-full max-w-sm mx-auto overflow-hidden rounded-lg transition-all duration-300",
        "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent",
        "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50"
      )}
    >
      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-lg border-2 border-[hsl(var(--hero-card-border-secondary))] pointer-events-none"></div>
      <div className="absolute inset-2 rounded-sm border border-[hsl(var(--hero-card-border))] pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full p-3">
        {/* Header */}
        <div className="flex justify-between items-center text-primary/70">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
            <path d="M12 2L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 2ZM12 4.03L19 6.22V11C19 15.45 15.89 19.43 12 20.92C8.11 19.43 5 15.45 5 11V6.22L12 4.03Z" fill="currentColor"/>
          </svg>
          <p className="font-headline text-2xl font-bold text-shadow-custom">{hero.level}</p>
        </div>

        {/* Image Container */}
        <div className="relative flex-grow my-2">
          <Image
            src={getImagePath(hero.name)}
            alt={hero.name}
            fill
            className="object-contain object-bottom drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Footer */}
        <div className="text-center">
           <h3 className="font-headline text-2xl md:text-3xl text-foreground/90 text-shadow-custom tracking-wider">{hero.name}</h3>
          <Progress value={(hero.level / hero.maxLevel) * 100} className="mt-2 h-1.5 bg-black/20" />
          
          {heroEquipment.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {heroEquipment.slice(0, 4).map((equip: any, index: number) => (
                <TooltipProvider key={index}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <div className="aspect-square bg-black/20 rounded-md p-1 border border-[hsl(var(--hero-card-border))] transition-all hover:border-primary/80 hover:scale-105">
                        <Image src={getImagePath(equip.name)} alt={equip.name} width={48} height={48} unoptimized className="w-full h-full object-contain" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{equip.name}</p>
                      <p className="text-sm text-muted-foreground">Level {equip.level}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const TroopSpellCard = ({ item }: { item: any }) => {
    const isMaxed = item.level === item.maxLevel;
    const imagePath = getImagePath(item.name);
    const isSuper = superTroopNames.includes(item.name);
    const isSiege = item.village === 'home' && (item.name.includes('Wrecker') || item.name.includes('Blimp') || item.name.includes('Slammer') || item.name.includes('Barracks') || item.name.includes('Launcher') || item.name.includes('Flinger') || item.name.includes('Drill'));
  
    return (
      <div
        className={cn(
          "group relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-lg transition-all duration-300",
          "bg-[hsl(var(--hero-card-bg))] border-2 border-transparent",
          "hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50",
          isMaxed && "border-amber-400/30 shadow-amber-400/10"
        )}
      >
        {/* Decorative Borders */}
        <div className="absolute inset-0 rounded-lg border-2 border-[hsl(var(--hero-card-border-secondary))] pointer-events-none"></div>
        <div className="absolute inset-2 rounded-sm border border-[hsl(var(--hero-card-border))] pointer-events-none"></div>

         {/* Conditional Icon */}
        {(isSuper || isSiege) && (
            <div className="absolute top-2 right-2 bg-black/30 p-1.5 rounded-full z-10">
                {isSuper && <Flame className="w-4 h-4 text-orange-400" />}
                {isSiege && <Castle className="w-4 h-4 text-stone-400" />}
            </div>
        )}
  
        <div className="relative z-10 flex flex-col h-full p-2">
            <div className="relative flex-grow my-2 transition-transform duration-300 group-hover:scale-110">
                <Image src={imagePath} alt={item.name} fill className="object-contain drop-shadow-lg" unoptimized />
            </div>

            <div className="text-center">
                <h3 className="font-headline text-lg text-foreground/90 text-shadow-custom truncate">{item.name}</h3>
                <p className="font-bold text-base text-primary leading-tight">Lvl {item.level}</p>
                <Progress value={(item.level / item.maxLevel) * 100} className="mt-2 h-1 bg-black/20" />
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
    warStars, attackWins, defenseWins, donations, received, clan, league, achievements, heroes, troops, spells, 
    builderBaseTrophies = 0, bestBuilderBaseTrophies = 0
  } = player;

  const siegeMachines = player.siegeMachines || [];

  const homeHeroes = heroes.filter((h: any) => h.village === 'home' && h.name !== 'Battle Machine' && h.name !== 'Battle Copter');
  const builderHeroes = heroes.filter((h: any) => h.village === 'builderBase' || h.name === 'Battle Machine' || h.name === 'Battle Copter');
  
  const allHomeTroops = troops.filter((t: any) => t.village === 'home');
  const regularTroops = allHomeTroops.filter((t: any) => !superTroopNames.includes(t.name));
  const superTroops = allHomeTroops.filter((t: any) => superTroopNames.includes(t.name) && t.level > 0);
  
  const homeSiegeMachines = siegeMachines ?? [];

  const elixirTroops = regularTroops.filter((t: any) => t.upgradeResource === 'Elixir');
  const darkElixirTroops = regularTroops.filter((t: any) => t.upgradeResource === 'Dark Elixir');
  
  const homeSpells = spells.filter((s: any) => s.village === 'home');
  const elixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Elixir');
  const darkElixirSpells = homeSpells.filter((s: any) => s.upgradeResource === 'Dark Elixir');

  const builderTroops = troops.filter((t: any) => t.village === 'builderBase' && !superTroopNames.includes(t.name));
  

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
                        <CategoryGrid title="Super Troops" icon={Flame} items={superTroops} />
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
                        <StatCard icon={Swords} title="Trophies" value={builderBaseTrophies} footer={`Best: ${bestBuilderBaseTrophies}`} />
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
