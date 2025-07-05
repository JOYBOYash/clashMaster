
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Hammer, Coins, Droplet, Gem } from 'lucide-react';

interface VillageOverviewProps {
  base: 'home' | 'builder';
  level: number;
  resources: {
    gold: number;
    elixir: number;
    darkElixir: number;
  };
}

export function VillageOverview({ base, level, resources }: VillageOverviewProps) {
  const { gold, elixir, darkElixir } = resources;
  const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
  const BaseIcon = base === 'home' ? Home : Hammer;
  const title = base === 'home' ? 'Town Hall' : 'Builder Hall';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center font-headline">
          <BaseIcon className="mr-2 h-6 w-6 text-primary" />
          {title} Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xl">
          Current Level: <span className="font-bold text-primary">{level}</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center p-3 bg-secondary/50 rounded-md">
            <Coins className="h-5 w-5 mr-2 text-accent" />
            <span className="font-semibold">{formatNumber(gold)} Gold</span>
          </div>
          <div className="flex items-center p-3 bg-secondary/50 rounded-md">
            <Droplet className="h-5 w-5 mr-2 text-pink-500" />
            <span className="font-semibold">{formatNumber(elixir)} Elixir</span>
          </div>
          <div className="flex items-center p-3 bg-secondary/50 rounded-md">
            <Gem className="h-5 w-5 mr-2 text-indigo-500" />
            <span className="font-semibold">{formatNumber(darkElixir)} Dark Elixir</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
