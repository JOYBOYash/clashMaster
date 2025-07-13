
"use client";

import { useMemo } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Coins, Sword, SlidersHorizontal, Settings2, Hammer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { buildingNameToType } from '@/lib/constants';
import { buildingImageMap } from '@/lib/image-paths';


const getGroupedBuildings = (buildings: Building[]) => {
    const buildingMap: { [key: string]: { building: Building; count: number } } = {};
    buildings.forEach(b => {
      const key = `${b.name}-${b.level}`;
      if (buildingMap[key]) {
        buildingMap[key].count += 1;
      } else {
        buildingMap[key] = { building: b, count: 1 };
      }
    });
    return Object.values(buildingMap).sort((a, b) => {
        if (a.building.name < b.building.name) return -1;
        if (a.building.name > b.building.name) return 1;
        return a.building.level - b.building.level;
    });
};

export function BuildingList({ buildings }: BuildingListProps) {

  const groupedBuildings = useMemo(() => {
    const groups: Record<string, Building[]> = {
      defensive: [],
      army: [],
      resource: [],
      other: [],
      trap: [],
      hero: [],
    };
    buildings.forEach(b => {
      const type = buildingNameToType[b.name] || b.type || 'other';
      if(groups[type]) {
        groups[type].push(b);
      }
    });
    return groups;
  }, [buildings]);

  const defaultOpenCategories = useMemo(() => {
    return Object.keys(groupedBuildings).filter(type => groupedBuildings[type].length > 0);
  }, [groupedBuildings]);

  const typeIcons: Record<string, React.ElementType> = {
    defensive: Shield,
    army: Sword,
    resource: Coins,
    other: SlidersHorizontal,
    trap: Settings2,
    hero: Hammer
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Village Buildings & Traps</CardTitle>
          <CardDescription>A complete list of all your buildings and their current levels, based on your imported data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={defaultOpenCategories} className="w-full">
            {Object.entries(groupedBuildings).map(([type, buildingsOfType]) => {
              if (buildingsOfType.length === 0) return null;
              const Icon = typeIcons[type];
              return (
                <AccordionItem value={type} key={type}>
                  <AccordionTrigger className="text-lg font-semibold capitalize hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className='text-xl font-headline tracking-wide'>{type}</span>
                       <span className="text-sm font-normal text-muted-foreground">({getGroupedBuildings(buildingsOfType).length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2">
                        {getGroupedBuildings(buildingsOfType).map(({ building, count }) => (
                            <div key={`${building.name}-${building.level}`} className="relative p-3 rounded-xl border bg-card/60 hover:shadow-lg transition-shadow flex flex-col gap-2 hover:-translate-y-1">
                                {count > 1 && (
                                    <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                                        x{count}
                                    </div>
                                )}
                                <Image
                                    src={buildingImageMap[building.name] || buildingImageMap['default']}
                                    alt={building.name}
                                    width={128}
                                    height={128}
                                    className="rounded-md self-center aspect-square object-contain bg-muted/20"
                                    unoptimized
                                />
                                <div className="text-center mt-1">
                                    <p className="font-bold text-card-foreground">{building.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Level {building.level} / {building.maxLevel}
                                    </p>
                                </div>
                                <Progress value={(building.level / building.maxLevel) * 100} className="h-2" />
                            </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
