
import type { StaticImageData } from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer } from 'lucide-react';
import Image from 'next/image';

// Default/Placeholder Image
import defaultImage from '../../public/_misc/default.png';

// Town Hall Images
import th1 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_1.png';
import th2 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_2.png';
import th3 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_3.png';
import th4 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_4.png';
import th5 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_5.png';
import th6 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_6.png';
import th7 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_7.png';
import th8 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_8.png';
import th9 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_9.png';
import th10 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_10.png';
import th11 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_11.png';
import th12 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_12_1.png';
import th13 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_13_1.png';
import th14 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_14_1.png';
import th15 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_15_2.png';
import th16 from '../../public/_halls/town_hall/Building_HV_Town_Hall_level_16_1.png';

const townHallImageMap: Record<number, StaticImageData> = {
    1: th1, 2: th2, 3: th3, 4: th4, 5: th5, 6: th6, 7: th7, 8: th8, 9: th9, 10: th10, 11: th11, 12: th12, 13: th13, 14: th14, 15: th15, 16: th16
};

// Builder Hall Images (using placeholders for now)
const builderHallImageMap: Record<number, StaticImageData> = {
    1: defaultImage, 2: defaultImage, 3: defaultImage, 4: defaultImage, 5: defaultImage,
    6: defaultImage, 7: defaultImage, 8: defaultImage, 9: defaultImage, 10: defaultImage
};

const getHallImagePath = (base: 'home' | 'builder', level: number): StaticImageData => {
    if (base === 'home') {
        return townHallImageMap[level] || defaultImage;
    }
    return builderHallImageMap[level] || defaultImage;
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
