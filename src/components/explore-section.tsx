
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import Image, { type StaticImageData } from 'next/image';
import type { VillageState } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

import championKing from '../../../public/_skins/champion_king.png';
import pekkaKing from '../../../public/_skins/pekka_king.png';
import iceQueen from '../../../public/_skins/ice_queen.png';
import valkyrieQueen from '../../../public/_skins/valkyrie_queen.png';
import partyWarden from '../../../public/_skins/party_warden.png';
import primalWarden from '../../../public/_skins/primal_warden.png';
import gladiatorChampion from '../../../public/_skins/gladiator_champion.png';
import shadowChampion from '../../../public/_skins/shadow_champion.png';
import magicTheater from '../../../public/_scenery/magic_theater.png';
import shadowScenery from '../../../public/_scenery/shadow_scenery.png';

type FeaturedItem = {
    title: string;
    category: string;
    price: string;
    availability: string;
    imageUrl: StaticImageData;
    hint: string;
};

const skinAssets: Record<string, FeaturedItem[]> = {
  'Barbarian King': [
    { title: 'Champion King', category: 'Hero Skin', price: '1500 Gems', availability: 'Shop', imageUrl: championKing, hint: 'gold king armor' },
    { title: 'P.E.K.K.A King', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: pekkaKing, hint: 'robot king sword' },
  ],
  'Archer Queen': [
    { title: 'Ice Queen', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: iceQueen, hint: 'ice queen crown' },
    { title: 'Valkyrie Queen', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: valkyrieQueen, hint: 'warrior queen axe' },
  ],
  'Grand Warden': [
    { title: 'Party Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: partyWarden, hint: 'dj wizard staff' },
    { title: 'Primal Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: primalWarden, hint: 'shaman wizard staff' },
  ],
  'Royal Champion': [
    { title: 'Gladiator Champion', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: gladiatorChampion, hint: 'gladiator champion spear' },
    { title: 'Shadow Champion', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: shadowChampion, hint: 'ninja champion dark' },
  ],
};

const otherFeaturedItemAssets: FeaturedItem[] = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: magicTheater, hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: shadowScenery, hint: "dark castle night" },
];

interface ExploreSectionProps {
  villageState: VillageState;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export function ExploreSection({ villageState }: ExploreSectionProps) {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[] | null>(null);

  useEffect(() => {
    // This runs on the client to avoid hydration mismatch from Math.random()
    const unlockedHeroNames = villageState.heroes.map(h => h.name);
    
    let availableSkins: FeaturedItem[] = [];
    for (const heroName of unlockedHeroNames) {
      if (skinAssets[heroName as keyof typeof skinAssets]) {
        availableSkins = availableSkins.concat(skinAssets[heroName as keyof typeof skinAssets]);
      }
    }

    const combinedPool = [...availableSkins, ...otherFeaturedItemAssets];
    const shuffled = shuffleArray(combinedPool);
    setFeaturedItems(shuffled.slice(0, 3));
  }, [villageState]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-accent" />
            Weekly Showcase
        </CardTitle>
        <CardDescription>A rotating selection of this week's featured skins and sceneries!</CardDescription>
      </CardHeader>
      <CardContent>
        {!featuredItems ? (
           <div className="flex justify-center items-center h-48">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item, index) => (
              <Card key={index} className="overflow-hidden group flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    data-ai-hint={item.hint}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                   <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="shadow-lg">{item.availability}</Badge>
                    <Badge className="shadow-lg bg-accent text-accent-foreground">{item.price}</Badge>
                  </div>
                </div>
                 <div className="p-4 bg-muted/30 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-muted-foreground">{item.category}</p>
                    <h3 className="text-lg font-bold font-headline text-card-foreground">{item.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
