
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { Swords, Shield, Wand2, FlaskConical } from 'lucide-react';

const getAssetPath = (name: string, category: string) => {
    const formattedName = name.toLowerCase().replace(/ /g, '_').replace(/\./g, '');
    let folder = 'troops';
    if (category === 'heroes') folder = 'heroes';
    if (category === 'spells') folder = 'spells';
    return `/assets/_troops/${formattedName}.png`;
}

const ItemGrid = ({ title, items, category, icon: Icon, iconColor }: { title: string, items: any[], category: string, icon: any, iconColor: string }) => (
  <Card>
    <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <CardTitle>{title}</CardTitle>
        </div>
      <CardDescription>Levels of your unlocked {category}.</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
      {items.map((item) => (
        <TooltipProvider key={item.name}>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-16 h-16 bg-muted/40 rounded-lg flex items-center justify-center p-1">
                  <Image
                    src={getAssetPath(item.name, category)}
                    alt={item.name}
                    width={56}
                    height={56}
                    unoptimized
                    onError={(e) => { e.currentTarget.src = '/assets/_troops/default.png'; }}
                  />
                  <div className="absolute -bottom-2 bg-background border rounded-full px-2 py-0.5 text-xs font-bold">
                    {item.level}
                  </div>
                </div>
                <Progress value={(item.level / item.maxLevel) * 100} className="h-1 w-12" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{item.name}</p>
              <p>Level {item.level} / {item.maxLevel}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </CardContent>
  </Card>
);

export function TroopAndHeroGrids({ playerData }: { playerData: any }) {
  const homeTroops = playerData.troops.filter((t: any) => t.village === 'home' && !t.name.startsWith('Super'));
  const spells = playerData.spells;
  const heroes = playerData.heroes;

  return (
    <div className="space-y-8">
      <ItemGrid title="Heroes & Equipment" items={heroes} category="heroes" icon={Shield} iconColor="text-orange-400" />
      <ItemGrid title="Troops" items={homeTroops} category="troops" icon={Swords} iconColor="text-red-500" />
      <ItemGrid title="Spells" items={spells} category="spells" icon={Wand2} iconColor="text-purple-500" />
    </div>
  );
}
