
"use client";

import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Shield, Coins, Sword } from 'lucide-react';
import { useMemo } from 'react';

interface ProgressDashboardProps {
  buildings: Building[];
}

type ProgressStats = {
  label: string;
  icon: React.ElementType;
  current: number;
  total: number;
  percentage: number;
};

export function ProgressDashboard({ buildings }: ProgressDashboardProps) {
  const stats = useMemo<ProgressStats[]>(() => {
    const buildingTypes = ['defensive', 'army', 'resource', 'other'];
    const typeIcons: Record<string, React.ElementType> = {
      defensive: Shield,
      army: Sword,
      resource: Coins,
      other: Target,
    };

    const overall = buildings.reduce(
      (acc, b) => {
        acc.current += b.level;
        acc.total += b.maxLevel;
        return acc;
      },
      { current: 0, total: 0 }
    );

    const byType = buildingTypes.map(type => {
      const filtered = buildings.filter(b => b.type === type);
      if (filtered.length === 0) return null;

      const levels = filtered.reduce(
        (acc, b) => {
          acc.current += b.level;
          acc.total += b.maxLevel;
          return acc;
        },
        { current: 0, total: 0 }
      );
      
      return {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
        icon: typeIcons[type],
        current: levels.current,
        total: levels.total,
        percentage: levels.total > 0 ? (levels.current / levels.total) * 100 : 0,
      };
    }).filter((s): s is ProgressStats => s !== null);
    
    const overallStat: ProgressStats = {
      label: 'Overall Base',
      icon: Target,
      current: overall.current,
      total: overall.total,
      percentage: overall.total > 0 ? (overall.current / overall.total) * 100 : 0,
    };

    return [overallStat, ...byType];
  }, [buildings]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <Target className="mr-2 h-6 w-6 text-primary" />
            Base Maxing Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map(({ label, icon: Icon, current, total, percentage }) => (
            <div key={label}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground/90 flex items-center">
                        <Icon className="w-4 h-4 mr-2 text-muted-foreground" />
                        {label}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                        {Math.round(percentage)}%
                    </span>
                </div>
                <Progress value={percentage} aria-label={`${label} progress`} />
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
