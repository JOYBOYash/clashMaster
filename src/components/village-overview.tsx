
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer } from 'lucide-react';
import Image from 'next/image';

interface VillageOverviewProps {
  base: 'home' | 'builder';
  level: number;
}

const townHallImageMap: Record<number, string> = {
  1: '/images/halls/town_hall_1.png',
  2: '/images/halls/town_hall_2.png',
  3: '/images/halls/town_hall_3.png',
  4: '/images/halls/town_hall_4.png',
  5: '/images/halls/town_hall_5.png',
  6: '/images/halls/town_hall_6.png',
  7: '/images/halls/town_hall_7.png',
  8: '/images/halls/town_hall_8.png',
  9: '/images/halls/town_hall_9.png',
  10: '/images/halls/town_hall_10.png',
  11: '/images/halls/town_hall_11.png',
  12: '/images/halls/town_hall_12.png',
  13: '/images/halls/town_hall_13.png',
  14: '/images/halls/town_hall_14.png',
  15: '/images/halls/town_hall_15.png',
  16: '/images/halls/town_hall_16.png',
  17: '/images/halls/town_hall_17.png',
};

const builderHallImageMap: Record<number, string> = {
    1: '/images/halls/builder_hall_1.png',
    2: '/images/halls/builder_hall_2.png',
    3: '/images/halls/builder_hall_3.png',
    4: '/images/halls/builder_hall_4.png',
    5: '/images/halls/builder_hall_5.png',
    6: '/images/halls/builder_hall_6.png',
    7: '/images/halls/builder_hall_7.png',
    8: '/images/halls/builder_hall_8.png',
    9: '/images/halls/builder_hall_9.png',
    10: '/images/halls/builder_hall_10.png'
};

export function VillageOverview({ base, level }: VillageOverviewProps) {
  const BaseIcon = base === 'home' ? Home : Hammer;
  const title = base === 'home' ? 'Town Hall' : 'Builder Hall';
  const imageUrl = base === 'home' 
    ? townHallImageMap[level] || '/images/halls/town_hall_1.png'
    : builderHallImageMap[level] || '/images/halls/builder_hall_1.png';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
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
                unoptimized
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
