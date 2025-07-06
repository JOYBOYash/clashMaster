
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
  const imageUrl = base === 'home' 
    ? 'https://static.wikia.nocookie.net/clashofclans/images/8/87/Town_Hall16.png'
    : 'https://static.wikia.nocookie.net/clashofclans/images/a/a4/Builder_Hall10.png';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <BaseIcon className="mr-2 h-6 w-6 text-primary" />
          {title} Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image 
                src={imageUrl} 
                alt={title} 
                width={128} 
                height={128} 
                className="rounded-lg shadow-md aspect-square object-contain" 
            />
            <div className="flex-grow space-y-4 w-full">
                <p className="text-3xl text-center sm:text-left font-headline tracking-wider">
                Level <span className="font-bold text-primary">{level}</span>
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
