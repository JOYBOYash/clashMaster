
"use client";

import { useMemo } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Coins, Sword, SlidersHorizontal, Settings2, Hammer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface BuildingListProps {
  buildings: Building[];
}

const buildingImageMap: Record<string, string> = {
    // Defensive
    'Cannon': 'https://static.wikia.nocookie.net/clashofclans/images/a/a3/Cannon_info.png/revision/latest',
    'Archer Tower': 'https://static.wikia.nocookie.net/clashofclans/images/0/05/Archer_Tower_info.png/revision/latest',
    'Mortar': 'https://static.wikia.nocookie.net/clashofclans/images/1/1b/Mortar_info.png/revision/latest',
    'Air Defense': 'https://static.wikia.nocookie.net/clashofclans/images/f/fe/Air_Defense_info.png/revision/latest',
    'Wizard Tower': 'https://static.wikia.nocookie.net/clashofclans/images/5/55/Wizard_Tower_info.png/revision/latest',
    'Air Sweeper': 'https://static.wikia.nocookie.net/clashofclans/images/c/c5/Air_Sweeper_info.png/revision/latest',
    'Hidden Tesla': 'https://static.wikia.nocookie.net/clashofclans/images/b/be/Hidden_Tesla_info.png/revision/latest',
    'Bomb Tower': 'https://static.wikia.nocookie.net/clashofclans/images/d/dd/Bomb_Tower_info.png/revision/latest',
    'X-Bow': 'https://static.wikia.nocookie.net/clashofclans/images/e/e4/X-Bow_info.png/revision/latest',
    'Inferno Tower': 'https://static.wikia.nocookie.net/clashofclans/images/5/57/Inferno_Tower_info.png/revision/latest',
    'Eagle Artillery': 'https://static.wikia.nocookie.net/clashofclans/images/a/a7/Eagle_Artillery_info.png/revision/latest',
    'Scattershot': 'https://static.wikia.nocookie.net/clashofclans/images/d/d2/Scattershot_info.png/revision/latest',
    'Spell Tower': 'https://static.wikia.nocookie.net/clashofclans/images/2/28/Spell_Tower_info.png/revision/latest',
    'Monolith': 'https://static.wikia.nocookie.net/clashofclans/images/4/4b/Monolith_info.png/revision/latest',
    // Army
    'Army Camp': 'https://static.wikia.nocookie.net/clashofclans/images/f/f0/Army_Camp_info.png/revision/latest',
    'Barracks': 'https://static.wikia.nocookie.net/clashofclans/images/e/e0/Barracks_info.png/revision/latest',
    'Dark Barracks': 'https://static.wikia.nocookie.net/clashofclans/images/8/87/Dark_Barracks_info.png/revision/latest',
    'Laboratory': 'https://static.wikia.nocookie.net/clashofclans/images/f/f6/Laboratory_info.png/revision/latest',
    'Spell Factory': 'https://static.wikia.nocookie.net/clashofclans/images/f/f4/Spell_Factory_info.png/revision/latest',
    'Dark Spell Factory': 'https://static.wikia.nocookie.net/clashofclans/images/a/a5/Dark_Spell_Factory_info.png/revision/latest',
    'Workshop': 'https://static.wikia.nocookie.net/clashofclans/images/3/3b/Workshop_info.png/revision/latest',
    'Clan Castle': 'https://static.wikia.nocookie.net/clashofclans/images/8/84/Clan_Castle_info.png/revision/latest',
    'Pet House': 'https://static.wikia.nocookie.net/clashofclans/images/3/3a/Pet_House_info.png/revision/latest',
    'Blacksmith': 'https://static.wikia.nocookie.net/clashofclans/images/c/c1/Blacksmith_info.png/revision/latest',
    // Resource
    'Gold Mine': 'https://static.wikia.nocookie.net/clashofclans/images/8/82/Gold_Mine_info.png/revision/latest',
    'Elixir Collector': 'https://static.wikia.nocookie.net/clashofclans/images/1/14/Elixir_Collector_info.png/revision/latest',
    'Dark Elixir Drill': 'https://static.wikia.nocookie.net/clashofclans/images/7/71/Dark_Elixir_Drill_info.png/revision/latest',
    'Gold Storage': 'https://static.wikia.nocookie.net/clashofclans/images/8/88/Gold_Storage_info.png/revision/latest',
    'Elixir Storage': 'https://static.wikia.nocookie.net/clashofclans/images/d/d1/Elixir_Storage_info.png/revision/latest',
    'Dark Elixir Storage': 'https://static.wikia.nocookie.net/clashofclans/images/5/54/Dark_Elixir_Storage_info.png/revision/latest',
    // Other
    'Town Hall': 'https://static.wikia.nocookie.net/clashofclans/images/d/d7/Town_Hall_info.png/revision/latest',
    "Builder's Hut": "https://static.wikia.nocookie.net/clashofclans/images/0/05/Builder%27s_Hut_info.png/revision/latest",
    // Traps
    'Bomb': 'https://static.wikia.nocookie.net/clashofclans/images/1/19/Bomb_info.png/revision/latest',
    'Spring Trap': 'https://static.wikia.nocookie.net/clashofclans/images/7/73/Spring_Trap_info.png/revision/latest',
    'Air Bomb': 'https://static.wikia.nocookie.net/clashofclans/images/7/79/Air_Bomb_info.png/revision/latest',
    'Giant Bomb': 'https://static.wikia.nocookie.net/clashofclans/images/a/a1/Giant_Bomb_info.png/revision/latest',
    'Seeking Air Mine': 'https://static.wikia.nocookie.net/clashofclans/images/5/5b/Seeking_Air_Mine_info.png/revision/latest',
    'Skeleton Trap': 'https://static.wikia.nocookie.net/clashofclans/images/f/f6/Skeleton_Trap_info.png/revision/latest',
    'Tornado Trap': 'https://static.wikia.nocookie.net/clashofclans/images/8/87/Tornado_Trap_info.png/revision/latest',
    // Hero Altars
    'Barbarian King Altar': 'https://static.wikia.nocookie.net/clashofclans/images/e/e8/Barbarian_King_Altar.png/revision/latest',
    'Archer Queen Altar': 'https://static.wikia.nocookie.net/clashofclans/images/2/23/Archer_Queen_Altar.png/revision/latest',
    'Grand Warden Altar': 'https://static.wikia.nocookie.net/clashofclans/images/8/82/Grand_Warden_Altar.png/revision/latest',
    'Royal Champion Altar': 'https://static.wikia.nocookie.net/clashofclans/images/a/a9/Royal_Champion_Altar.png/revision/latest',
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
      const type = b.type || 'other';
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
                       <span className="text-sm font-normal text-muted-foreground">({buildingsOfType.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2">
                      {buildingsOfType
                        .sort((a,b) => a.name.localeCompare(b.name))
                        .map(b => (
                        <div key={b.id} className="p-3 rounded-xl border bg-card/60 hover:shadow-lg transition-shadow flex flex-col gap-2 hover:-translate-y-1">
                            <Image
                                src={buildingImageMap[b.name] || 'https://placehold.co/128x128.png'}
                                alt={b.name}
                                width={128}
                                height={128}
                                className="rounded-md self-center aspect-square object-contain bg-muted/20"
                            />
                            <div className="text-center mt-1">
                                <p className="font-bold text-card-foreground">{b.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Level {b.level} / {b.maxLevel}
                                </p>
                            </div>
                            <Progress value={(b.level / b.maxLevel) * 100} className="h-2" />
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
