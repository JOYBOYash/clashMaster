
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart, BrainCircuit, Swords, CheckCircle2, ShieldCheck, Gem } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets, separator, appLogoPath } from '@/lib/image-paths';
import { FeatureCard } from './feature-flip-card';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

const features = [
  {
    icon: BarChart,
    title: 'Visual Progress Tracking',
    description: 'See your entire village at a glance to identify what to focus on next.',
    color: 'text-green-400',
    avatar: heroAvatarAssets[0],
    subFeatures: [
      { icon: CheckCircle2, text: 'Town Hall & Builder Hall levels' },
      { icon: CheckCircle2, text: 'Individual building progress' },
      { icon: CheckCircle2, text: 'Real-time upgrade timers' },
    ]
  },
  {
    icon: BrainCircuit,
    title: 'AI Upgrade Strategy',
    description: 'Let our AI act as your personal strategist, saving you time and resources.',
    color: 'text-blue-400',
    avatar: heroAvatarAssets[1],
     subFeatures: [
      { icon: ShieldCheck, text: 'Optimal upgrade paths' },
      { icon: ShieldCheck, text: 'Resource management suggestions' },
      { icon: ShieldCheck, text: 'Calculates based on builder availability' },
    ]
  },
  {
    icon: Swords,
    title: 'Custom Army Compositions',
    description: 'Get powerful army suggestions for war, farming, or trophy pushing.',
    color: 'text-red-400',
    avatar: heroAvatarAssets[2],
    subFeatures: [
        { icon: Gem, text: 'Tailored to your Town Hall level' },
        { icon: Gem, text: 'Considers your available troop levels' },
        { icon: Gem, text: 'Generates multiple options' },
    ]
  },
];

export function LandingPage() {
  const [fanAvatar, setFanAvatar] = useState(heroAvatarAssets[0]);
  const { user } = useAuth();
  
  useScrollAnimation();

  useEffect(() => {
      setFanAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  }, []);

  return (
    <div className='w-full'>
       <div className='relative w-full'>

          {/* Hero Section */}
          <section className="relative w-full text-center min-h-[calc(80vh)] md:min-h-[calc(100vh-8rem)] flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('/assets/hero_bg.jpg')"}}>
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 backdrop-blur-sm"></div>
              <div className="container relative mx-auto px-4 z-10">
                  <div className="max-w-4xl mx-auto flex flex-col items-center">
                      
                      <div className='flex flex-col items-center gap-4 mb-4'>
                          <Image
                              src={appLogoPath}
                              alt="ProBuilder App Logo"
                              data-ai-hint="clash of clans logo"
                              width={120} 
                              height={120}
                              unoptimized
                              className='drop-shadow-lg'
                          />
                          <h1 className='font-headline text-5xl md:text-7xl text-primary drop-shadow-md'>ProBuilder</h1>
                      </div>

                      <h2 className="text-4xl lg:text-6xl font-extrabold font-headline tracking-tight text-foreground/90" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>
                          Master Your Village
                      </h2>
                      <p className="mt-6 max-w-2xl text-lg lg:text-xl text-foreground/80">
                          Stop guessing, start mastering. Get AI-powered upgrade suggestions, track your progress, and plan your attacks like a pro.
                      </p>
                      {!user && (
                          <Button asChild size="lg" className="mt-8 text-lg font-bold shadow-lg">
                              <Link href="/sign-in">Get Started for Free</Link>
                          </Button>
                      )}
                      <div className="mt-12 flex items-center justify-center gap-4 text-muted-foreground font-body">
                          <span className='text-sm'>The AI Companion for</span>
                          <Image
                              src={'/coc_logo.png'}
                              alt="Clash of Clans Logo"
                              data-ai-hint="clash of clans logo"
                              width={150} 
                              height={50}
                              unoptimized
                          />
                      </div>
                  </div>
              </div>
          </section>

          {/* Features Section */}
          <section className="w-full py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center font-headline mb-32">Unlock Your Village's Full Potential</h2>
              <div className="flex flex-col items-center gap-y-48">
                {features.map((feature, index) => (
                  <div key={index} className="relative opacity-0 feature-card w-full max-w-2xl">
                    <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-48 h-48 z-10">
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
                      subFeatures={feature.subFeatures}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

     
          <div className="container mx-auto px-4 my-20">
            <Image
                src={separator}
                alt="Section Separator"
                width={100}
                height={20}
                unoptimized
                className="w-40 h-auto object-contain opacity-70 mx-auto"
            />
          </div>


          {/* Fan Content Section */}
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
                      As a passionate Clash of Clans player, I built ProBuilder with my AI partner to enhance the strategic depth of the game we love. This app is a companion to your gaming experience, designed to take your strategy to the next level, not replace the incredible fun of playing.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      ProBuilder is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy.
                    </p>
                    <a href="https://supercell.com/en/fan-content-policy/" target="_blank" rel="noopener noreferrer" className='text-sm italic underline text-primary/80 hover:text-primary transition-colors'>supercell.com/en/fan-content-policy/</a>
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

            <div className="container mx-auto px-4">
            <Image
                src={separator}
                alt="Section Separator"
                width={100}
                height={20}
                unoptimized
                className="w-40 h-20 object-contain opacity-70 mx-auto"
            />
          </div>
          </footer>
      </div>
    </div>
  );
}
