"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const featuredItems = [
  {
    title: "Ghost Queen",
    category: "Hero Skin",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "fantasy queen"
  },
  {
    title: "Magic Theater",
    category: "Scenery",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "magic theater"
  },
  {
    title: "Grand Warden",
    category: "Hero",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "wise wizard"
  },
  {
    title: "Ice King",
    category: "Hero Skin",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "ice king"
  },
  {
    title: "Shadow Scenery",
    category: "Scenery",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "dark castle"
  },
  {
    title: "Royal Champion",
    category: "Hero",
    imageUrl: "https://placehold.co/600x400.png",
    hint: "female warrior spear"
  },
];

export function ExploreSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-accent" />
            Explore
        </CardTitle>
        <CardDescription>Check out this week's featured skins and sceneries!</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredItems.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        data-ai-hint={item.hint}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <p className="text-sm font-semibold">{item.category}</p>
                        <h3 className="text-lg font-bold font-headline">{item.title}</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
