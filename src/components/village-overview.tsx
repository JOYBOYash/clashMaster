
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';

// Town Hall Images
import townHall1 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_1.png';
import townHall2 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_2.png';
import townHall3 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_3.png';
import townHall4 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_4.png';
import townHall5 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_5.png';
import townHall6 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_6.png';
import townHall7 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_7.png';
import townHall8 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_8.png';
import townHall9 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_9.png';
import townHall10 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_10.png';
import townHall11 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_11.png';
import townHall12 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_12_1.png';
import townHall13 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_13_1.png';
import townHall14 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_14_1.png';
import townHall15 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_15_2.png';
import townHall16 from '../../../public/_halls/town_hall/Building_HV_Town_Hall_level_16_1.png';
import defaultHall from '../../../public/_misc/default.png';

const townHallImageMap: Record<number, StaticImageData> = {
    1: townHall1,
    2: townHall2,
    3: townHall3,
    4: townHall4,
    5: townHall5,
    6: townHall6,
    7: townHall7,
    8: townHall8,
    9: townHall9,
    10: townHall10,
    11: townHall11,
    12: townHall12,
    13: townHall13,
    14: townHall14,
    15: townHall15,
    16: townHall16,
};

const builderHallImageMap: Record<number, StaticImageData> = {
    1: defaultHall, 2: defaultHall, 3: defaultHall, 4: defaultHall, 5: defaultHall,
    6: defaultHall, 7: defaultHall, 8: defaultHall, 9: defaultHall, 10: defaultHall,
};

const getHallImagePath = (base: 'home' | 'builder', level: number): StaticImageData => {
    if (base === 'home') {
        return townHallImageMap[level] || defaultHall;
    }
    return builderHallImageMap[level] || defaultHall;
};


interface VillageOverviewProps {
  base: 'home' | 'builder';
  level: number;
}

export function VillageOverview({ base, level }: VillageOverviewProps) {
  const BaseIcon = base === 'home' ? Home : Hammer;
  const title = base === 'home' ? 'Town Hall' : 'Builder Hall';
  const imageUrl = getHallImagePath(base, level);

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
