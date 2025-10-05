
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PlayerHeader({ playerData }: { playerData: any }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 p-4">
        {playerData.league && (
          <Image
            src={playerData.league.iconUrls.medium}
            alt={playerData.league.name}
            width={72}
            height={72}
            className="rounded-full"
            unoptimized
          />
        )}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <CardTitle className="text-3xl">{playerData.name}</CardTitle>
            <Badge variant="outline" className="text-lg">{playerData.tag}</Badge>
          </div>
          <p className="text-muted-foreground">Level {playerData.expLevel}</p>
        </div>
        {playerData.clan && (
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="font-bold">{playerData.clan.name}</p>
              <p className="text-sm text-muted-foreground">Lvl {playerData.clan.clanLevel} Clan</p>
            </div>
            <Image
              src={playerData.clan.badgeUrls.medium}
              alt={playerData.clan.name}
              width={50}
              height={50}
              unoptimized
            />
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
