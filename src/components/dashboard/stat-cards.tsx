
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, ArrowUpCircle, ArrowDownCircle, ShieldQuestion } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }: { icon: any, title: string, value: string | number, color: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function StatCards({ playerData }: { playerData: any }) {
  const stats = [
    { icon: Trophy, title: 'Trophies', value: playerData.trophies, color: 'text-amber-500' },
    { icon: Star, title: 'War Stars', value: playerData.warStars, color: 'text-yellow-400' },
    { icon: ArrowUpCircle, title: 'Donations', value: playerData.donations, color: 'text-green-500' },
    { icon: ArrowDownCircle, title: 'Received', value: playerData.donationsReceived, color: 'text-red-500' },
    { icon: ShieldQuestion, title: 'Best Trophies', value: playerData.bestTrophies, color: 'text-purple-500' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
