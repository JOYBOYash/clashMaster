
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart, BrainCircuit, Swords } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets } from '@/lib/image-paths';
import { FeatureCard } from './feature-flip-card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';

const features = [
  {
    icon: BarChart,
    title: 'Visual Progress Tracking',
    description: 'See your entire village at a glance. Our dashboards provide a clear overview of your building, troop, and hero levels, helping you identify what to focus on next.',
    color: 'text-green-500',
    avatar: heroAvatarAssets[0]
  },
  {
    icon: BrainCircuit,
    title: 'AI Upgrade Strategy',
    description: 'Let our AI act as your personal strategist. It analyzes your current village state to suggest the most impactful and efficient upgrades, saving you time and resources.',
    color: 'text-blue-500',
    avatar: heroAvatarAssets[1]
  },
  {
    icon: Swords,
    title: 'Custom Army Compositions',
    description: 'Tired of using the same old army? Get powerful army suggestions tailored specifically to your Town Hall and troop levels for any situation—war, farming, or trophy pushing.',
    color: 'text-red-500',
    avatar: heroAvatarAssets[2]
  },
];




export function LandingPage() {
  const [fanAvatar, setFanAvatar] = useState(heroAvatarAssets[0]);
  const { user } = useAuth();

  useEffect(() => {
      setFanAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  }, []);

  return (
    <div className='w-full'>
       <div className='relative w-full'>

          {/* Hero Section */}
          <section className="relative w-full text-center min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center bg-gradient-to-b from-background via-card to-muted/60 overflow-hidden">
            <div className="container relative mx-auto px-4 z-10 animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <Image
                        src={'/assets/coc_logo.png'}
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
              {!user && (
                <Button asChild size="lg" className="mt-8 text-lg font-bold">
                  <Link href="/sign-in">Get Started for Free</Link>
                </Button>
              )}
            </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-center font-headline mb-24">Unlock Your Village's Full Potential</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                {features.map((feature, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 z-10">
                      <Image
                        src={feature.avatar}
                        alt="Hero Avatar"
                        fill
                        className="object-contain animate-float"
                        unoptimized
                      />
                    </div>
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      color={feature.color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Fan Content Section */}
          <section className="w-full py-20 lg:py-24 bg-muted/40">
            <div className="container mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                      As a passionate Clash of Clans player, I built ProBuilder with my AI partner to enhance the strategic depth of the game we love. This app is a companion to your gaming experience, designed to take your strategy to the next level, not replace the incredible fun of playing.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      ProBuilder is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy.
                    </p>
                  </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="w-full py-12 bg-background">
            <div className="container mx-auto text-center text-muted-foreground">
              <p className="font-headline text-lg font-bold">ProBuilder</p>
              <p className="text-sm">built by a fan (with a little AI help)</p>
            </div>
          </footer>
      </div>
    </div>
  );
}
