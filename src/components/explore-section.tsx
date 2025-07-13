
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import type { VillageState } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { skinAssets, otherFeaturedItemAssets } from '@/lib/image-paths';

interface ExploreSectionProps {
  villageState: VillageState;
}

type FeaturedItem = {
    title: string;
    category: string;
    price: string;
    availability: string;
    imageUrl: StaticImageData;
    hint: string;
};


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
