
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Target, Wand2, ShieldCheck, Swords, BrainCircuit, Heart, BarChart } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets } from '@/lib/image-paths';
import { FlipCard } from './feature-flip-card';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: BarChart,
    title: 'Visual Progress Tracking',
    description: 'See your entire village at a glance. Our dashboards provide a clear overview of your building, troop, and hero levels, helping you identify what to focus on next.',
    color: 'text-green-500'
  },
  {
    icon: BrainCircuit,
    title: 'AI Upgrade Strategy',
    description: 'Let our AI act as your personal strategist. It analyzes your current village state to suggest the most impactful and efficient upgrades, saving you time and resources.',
    color: 'text-blue-500'
  },
  {
    icon: Swords,
    title: 'Custom Army Compositions',
    description: 'Tired of using the same old army? Get powerful army suggestions tailored specifically to your Town Hall and troop levels for any situation—war, farming, or trophy pushing.',
    color: 'text-red-500'
  },
];


export function LandingPage() {
  const [fanAvatar, setFanAvatar] = useState(heroAvatarAssets[0]);

  useEffect(() => {
      setFanAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  }, []);

  return (
    <div className="w-full">
      <section className="relative w-full text-center min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/40 overflow-hidden">
        <Image
            src="/assets/hero_bg.png"
            alt="Clash of Clans background"
            data-ai-hint="clash of clans battle"
            fill
            className="object-cover object-top opacity-10"
            unoptimized
        />
        <div className="container relative mx-auto px-4 z-10">
            <div className="flex justify-center mb-6">
                <Image
                    src='/coc_logo.png'
                    alt="Clash of Clans Logo"
                    data-ai-hint="clash of clans logo"
                    width={400} 
                    height={150}
                    unoptimized
                  />
            </div>
          <h1 className="text-4xl md:text-6xl font-extrabold font-headline tracking-tight text-primary">
            Master Your Village
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
            Get AI-powered upgrade suggestions, track your progress, and plan your attacks like a pro. Stop guessing, start mastering.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg font-bold">
            <Link href="/sign-in">Get Started for Free</Link>
          </Button>
        </div>
      </section>

      <section className="w-full py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-16">Unlock Your Village's Full Potential</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FlipCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-20 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
              <div className="w-48 h-48 relative shrink-0">
                  <Image 
                      src={fanAvatar}
                      alt="Hero Avatar"
                      fill
                      className="object-contain animate-float"
                      unoptimized
                  />
              </div>
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold font-headline mb-4">A Tool Built By a Fan, For Fans</h2>
                <p className="text-lg text-foreground/80 mb-6">
                  As a passionate Clash of Clans player, I built Clash Master with my AI partner to enhance the strategic depth of the game we love. This app is a companion to your gaming experience, designed to take your strategy to the next level, not replace the incredible fun of playing.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Clash Master is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy:
                </p>
                <a className='text-red-600 font-headline text-sm bg-blue-500/10 cursor-pointer' href='https://supercell.com/en/fan-content-policy/'>supercell.com/en/fan-content-policy/</a>.
              </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-12 bg-background">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="font-headline text-lg font-bold">Clash Master</p>
          <p className="text-sm">built by a fan (with a little AI help)</p>
        </div>
      </footer>
    </div>
  );
}
