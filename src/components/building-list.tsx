
"use client";

import { useMemo } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Coins, Sword, SlidersHorizontal, Settings2, Home, Hammer } from 'lucide-react';

interface BuildingListProps {
  buildings: Building[];
}

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
      if(groups[b.type]) {
        groups[b.type].push(b);
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

  const getBaseIcon = (base: 'home' | 'builder') => {
    return base === 'home' ? <Home className="w-4 h-4 text-muted-foreground" /> : <Hammer className="w-4 h-4 text-muted-foreground" />;
  }

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
                       <span className="text-sm font-normal text-muted-foreground">({buildingsOfType.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                      {buildingsOfType
                        .sort((a,b) => a.name.localeCompare(b.name))
                        .map(b => (
                        <div key={b.id} className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow">
                            <p className="font-semibold text-card-foreground">{b.name}</p>
                            <div className="flex justify-between items-center mt-1">
                               <p className="text-sm text-muted-foreground">
                                Level {b.level}
                              </p>
                              {getBaseIcon(b.base)}
                            </div>
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
