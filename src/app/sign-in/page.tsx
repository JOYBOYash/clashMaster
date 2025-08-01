
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { AuthPage } from '@/components/auth-page';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { carouselImageAssets } from '@/lib/image-paths';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="w-full h-full flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl border">
        
        <div className="md:relative">
            <Button asChild variant="ghost" size="icon" className="absolute top-4 left-4 z-10 bg-background/50 backdrop-blur-sm">
            <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go Back</span>
            </Link>
            </Button>
            <div className="block relative">
                <Carousel className="w-full h-full" autoplay>
                    <CarouselContent>
                    {carouselImageAssets.map((item, index) => (
                        <CarouselItem key={index} className="p-0">
                        <div className="relative w-full h-[300px] md:h-[550px]">
                            <Image
                                src={item.src}
                                alt={item.alt}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>


        <div className="bg-card flex flex-col justify-center p-6 sm:p-10">
          <AuthPage />
        </div>

      </div>
    </div>
  );
}
