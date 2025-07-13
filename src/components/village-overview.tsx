
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer } from 'lucide-react';
import Image from 'next/image';

interface VillageOverviewProps {
  base: 'home' | 'builder';
  level: number;
}

export function VillageOverview({ base, level }: VillageOverviewProps) {
  const BaseIcon = base === 'home' ? Home : Hammer;
  const title = base === 'home' ? 'Town Hall' : 'Builder Hall';
  
  const getHallImagePath = (base: 'home' | 'builder', level: number): string => {
    if (base === 'builder') {
      // Assuming builder hall names are simple, adjust if needed
      return `/_halls/builder_hall/Building_BH_Builder_Hall${level}.png`;
    }
    
    const townHallImageMap: Record<number, string> = {
      1: 'Building_HV_Town_Hall_level_1.png',
      2: 'Building_HV_Town_Hall_level_2.png',
      3: 'Building_HV_Town_Hall_level_3.png',
      4: 'Building_HV_Town_Hall_level_4.png',
      5: 'Building_HV_Town_Hall_level_5.png',
      6: 'Building_HV_Town_Hall_level_6.png',
      7: 'Building_HV_Town_Hall_level_7.png',
      8: 'Building_HV_Town_Hall_level_8.png',
      9: 'Building_HV_Town_Hall_level_9.png',
      10: 'Building_HV_Town_Hall_level_10.png',
      11: 'Building_HV_Town_Hall_level_11.png',
      12: 'Building_HV_Town_Hall_level_12_1.png',
      13: 'Building_HV_Town_Hall_level_13_1.png',
      14: 'Building_HV_Town_Hall_level_14_1.png',
      15: 'Building_HV_Town_Hall_level_15_2.png',
      16: 'Building_HV_Town_Hall_level_16_1.png',
      17: 'Building_HV_Town_Hall_level_17_1.png',
    };

    const imageName = townHallImageMap[level] || 'default.png';
    return `/_halls/town_hall/${imageName}`;
  };

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
                unoptimized
                onError={(e) => { e.currentTarget.src = '/_misc/default.png'; }}
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
