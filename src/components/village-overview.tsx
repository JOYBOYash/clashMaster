
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer } from 'lucide-react';
import Image from 'next/image';

interface VillageOverviewProps {
  base: 'home' | 'builder';
  level: number;
}

const townHallImageMap: Record<number, string> = {
  1: 'https://static.wikia.nocookie.net/clashofclans/images/5/54/Town_Hall1.png',
  2: 'https://static.wikia.nocookie.net/clashofclans/images/3/33/Town_Hall2.png',
  3: 'https://static.wikia.nocookie.net/clashofclans/images/4/4b/Town_Hall3.png',
  4: 'https://static.wikia.nocookie.net/clashofclans/images/5/52/Town_Hall4.png',
  5: 'https://static.wikia.nocookie.net/clashofclans/images/9/96/Town_Hall5.png',
  6: 'https://static.wikia.nocookie.net/clashofclans/images/0/06/Town_Hall6.png',
  7: 'https://static.wikia.nocookie.net/clashofclans/images/3/3b/Town_Hall7.png',
  8: 'https://static.wikia.nocookie.net/clashofclans/images/1/13/Town_Hall8.png',
  9: 'https://static.wikia.nocookie.net/clashofclans/images/3/33/Town_Hall9.png',
  10: 'https://static.wikia.nocookie.net/clashofclans/images/a/a3/Town_Hall10.png',
  11: 'https://static.wikia.nocookie.net/clashofclans/images/8/8d/Town_Hall11.png',
  12: 'https://static.wikia.nocookie.net/clashofclans/images/a/a7/Town_Hall12-1.png',
  13: 'https://static.wikia.nocookie.net/clashofclans/images/f/f7/Town_Hall13-1.png',
  14: 'https://static.wikia.nocookie.net/clashofclans/images/3/3b/Town_Hall14-1.png',
  15: 'https://static.wikia.nocookie.net/clashofclans/images/5/5c/Town_Hall15-1.png',
  16: 'https://static.wikia.nocookie.net/clashofclans/images/8/87/Town_Hall16-1.png',
  17: 'https://static.wikia.nocookie.net/clashofclans/images/8/87/Town_Hall16-1.png', // Placeholder for TH17
};

const builderHallImageMap: Record<number, string> = {
    1: 'https://static.wikia.nocookie.net/clashofclans/images/8/80/Builder_Hall1.png',
    2: 'https://static.wikia.nocookie.net/clashofclans/images/2/29/Builder_Hall2.png',
    3: 'https://static.wikia.nocookie.net/clashofclans/images/f/f4/Builder_Hall3.png',
    4: 'https://static.wikia.nocookie.net/clashofclans/images/c/c7/Builder_Hall4.png',
    5: 'https://static.wikia.nocookie.net/clashofclans/images/1/11/Builder_Hall5.png',
    6: 'https://static.wikia.nocookie.net/clashofclans/images/f/fa/Builder_Hall6.png',
    7: 'https://static.wikia.nocookie.net/clashofclans/images/4/4c/Builder_Hall7.png',
    8: 'https://static.wikia.nocookie.net/clashofclans/images/3/36/Builder_Hall8.png',
    9: 'https://static.wikia.nocookie.net/clashofclans/images/5/54/Builder_Hall9.png',
    10: 'https://static.wikia.nocookie.net/clashofclans/images/d/d7/Builder_Hall10.png'
};

export function VillageOverview({ base, level }: VillageOverviewProps) {
  const BaseIcon = base === 'home' ? Home : Hammer;
  const title = base === 'home' ? 'Town Hall' : 'Builder Hall';
  const imageUrl = base === 'home' 
    ? townHallImageMap[level] || 'https://placehold.co/160x160.png'
    : builderHallImageMap[level] || 'https://placehold.co/160x160.png';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline text-2xl">
          <BaseIcon className="mr-3 h-8 w-8 text-primary" />
          {title} Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <Image 
                src={imageUrl} 
                alt={title} 
                width={160} 
                height={160} 
                className="rounded-lg shadow-lg aspect-square object-contain bg-muted/30 p-2" 
            />
            <div className="flex-grow space-y-2">
                <p className="text-muted-foreground">Current Level</p>
                <p className="text-6xl font-headline tracking-wider">
                    <span className="font-bold text-primary drop-shadow-lg">{level}</span>
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
