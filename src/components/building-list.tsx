
"use client";

import { useMemo } from 'react';
import type { Building } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Shield, Coins, Sword, SlidersHorizontal, Settings2, Hammer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { buildingNameToType } from '@/lib/constants';

const defaultImagePath = 'https://placehold.co/128x128.png';
const nameToPathMap: Record<string, string> = {
    'Cannon': '/assets/_defenses/cannon/Cannon_1.png',
    'Archer Tower': '/assets/_defenses/archer-tower/Archer_Tower_1.png',
    'Mortar': '/assets/_defenses/mortar/Mortar_1.png',
    'Air Defense': '/assets/_defenses/air-defense/Air_Defense_1.png',
    'Wizard Tower': '/assets/_defenses/wizard-tower/Wizard_Tower_1.png',
    'Air Sweeper': '/assets/_defenses/air-sweeper/Air_Sweeper_1.png',
    'Hidden Tesla': '/assets/_defenses/hidden-tesla/Hidden_Tesla_1.png',
    'Bomb Tower': '/assets/_defenses/bomb-tower/Bomb_Tower_1.png',
    'X-Bow': '/assets/_defenses/x-bow/X-Bow_1.png',
    'Inferno Tower': '/assets/_defenses/inferno-tower/Inferno_Tower_1.png',
    'Eagle Artillery': '/assets/_defenses/eagle-artillery/Eagle_Artillery_1.png',
    'Scattershot': '/assets/_defenses/scattershot/Scattershot_1.png',
    'Spell Tower': '/assets/_defenses/spell-tower/Spell_Tower_1.png',
    'Monolith': '/assets/_defenses/monolith/Monolith_1.png',
    'Ricochet Cannon': '/assets/_defenses/ricochet-cannon/Ricochet_Cannon_1.png',
    'Multi-Archer Tower': '/assets/_defenses/multi-archer-tower/Multi-Archer_Tower_1.png',
    'Wall': '/assets/_buildings/walls/Wall_1.png',
    'Gold Mine': '/assets/_resources/collectors/gold-mines/Gold_Mine_1.png',
    'Elixir Collector': '/assets/_resources/collectors/elixir-collector/Elixir_Collector_1.png',
    'Dark Elixir Drill': '/assets/_resources/collectors/dark-elixir-drills/Dark_Elixir_Drill_1.png',
    'Gold Storage': '/assets/_resources/storages/gold-storage/Gold_Storage_1.png',
    'Elixir Storage': '/assets/_resources/storages/elixir-storage/Elixir_Storage_1.png',
    'Dark Elixir Storage': '/assets/_resources/storages/dark-elixir-storage/Dark_Elixir_Storage_1.png',
    'Army Camp': '/assets/_buildings/army-camp/Army_Camp_1.png',
    'Barracks': '/assets/_buildings/barracks/Barracks_1.png',
    'Dark Barracks': '/assets/_buildings/dark-barracks/Dark_Barracks_1.png',
    'Laboratory': '/assets/_buildings/laboratory/Laboratory_1.png',
    'Spell Factory': '/assets/_buildings/spell-factory/Spell_Factory_1.png',
    'Dark Spell Factory': '/assets/_buildings/dark-spell-factory/Dark_Spell_Factory_1.png',
    'Workshop': '/assets/_buildings/workshop/Workshop_1.png',
    'Pet House': '/assets/_buildings/pet-house/Pet_House_1.png',
    'Blacksmith': '/assets/_buildings/blacksmith/Blacksmith_1.png',
    'Town Hall': '/assets/_town-halls/Town_Hall_1.png',
    'Clan Castle': '/assets/_buildings/clan-castle/Clan_Castle_1.png',
    'Builder Hut': '/assets/_buildings/builders-hut/Builder_s_Hut_1.png',
    'Bomb': '/assets/_traps/bomb/Bomb_1.png',
    'Spring Trap': '/assets/_traps/spring-trap/Spring_Trap_1.png',
    'Air Bomb': '/assets/_traps/air-bomb/Air_Bomb_1.png',
    'Giant Bomb': '/assets/_traps/giant-bomb/Giant_Bomb_1.png',
    'Seeking Air Mine': '/assets/_traps/seeking-air-mine/Seeking_Air_Mine_1.png',
    'Skeleton Trap': '/assets/_traps/skeleton-trap/Skeleton_Trap_1.png',
    'Tornado Trap': '/assets/_traps/tornado-trap/Tornado_Trap_1.png',
};

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
                        {getGroupedBuildings(buildingsOfType).map(({ building, count }) => {
                            const imagePath = nameToPathMap[building.name] || defaultImagePath;
                            return (
                                <div key={`${building.name}-${building.level}`} className="relative p-3 rounded-xl border bg-card/60 hover:shadow-lg transition-shadow flex flex-col gap-2 hover:-translate-y-1">
                                    {count > 1 && (
                                        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                                            x{count}
                                        </div>
                                    )}
                                    <Image
                                        src={imagePath}
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
                            )
                        })}
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
