
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
  const imageHint = base === 'home' ? 'clash of clans town hall' : 'clash of clans builder hall';

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
                data-ai-hint={imageHint}
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
