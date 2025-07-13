
"use client";

import Image from 'next/image';
import { AuthPage } from '@/components/auth-page';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { carouselImageAssets } from '@/lib/image-paths';

export default function SignInPage() {
  return (
    <div className="w-full h-full flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl border">
        
        <div className="hidden md:block relative">
          <Carousel className="w-full h-full" autoplay>
            <CarouselContent>
              {carouselImageAssets.map((img, index) => (
                <CarouselItem key={index} className="p-0">
                  <div className="relative w-full h-[550px]">
                      <Image
                          src={img.src}
                          alt={img.alt}
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

        <div className="bg-card flex flex-col justify-center p-6 sm:p-10">
          <AuthPage />
        </div>

      </div>
    </div>
  );
}
