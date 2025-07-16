
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart, BrainCircuit, Swords, CheckCircle2, ShieldCheck, Gem } from 'lucide-react';
import Image from 'next/image';
import { heroAvatarAssets, separator, appLogoPath, probuilderAvatar } from '@/lib/image-paths';
import { FeatureCard } from './feature-card';
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
          <section className="relative w-full text-center py-20 lg:py-32 min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 bg-background"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 60%)'
                }}
              ></div>
               <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent"></div>

              <div className="container relative mx-auto px-4 z-10 flex flex-col items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src={appLogoPath}
                            alt="ProBuilder App Logo"
                            data-ai-hint="clash of clans logo"
                            width={80} 
                            height={80}
                            unoptimized
                            className='drop-shadow-lg'
                        />
                        <h1 className='font-headline text-5xl md:text-7xl text-primary drop-shadow-md'>ProBuilder</h1>
                    </div>
                    <h2 className="mt-2 text-2xl lg:text-3xl font-bold font-headline tracking-tight text-foreground/90" style={{textShadow: '1px 1px 2px hsl(var(--background) / 0.5)'}}>
                        Master Your Village
                    </h2>
                    <p className="mt-4 max-w-2xl text-base lg:text-lg text-foreground/80">
                        Stop guessing, start mastering. Get AI-powered upgrade suggestions, track your progress, and plan your attacks like a pro.
                    </p>
                    <div className="relative w-[300px] h-[350px] md:w-[400px] md:h-[500px] my-4 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 w-full h-full bg-no-repeat bg-center"
                        style={{
                          backgroundImage: `
                            conic-gradient(from 90deg at 50% 50%,
                              hsl(var(--primary) / 0.5) 0%,
                              hsl(var(--primary) / 0.5) 5%,
                              transparent 5%,
                              transparent 15%,
                              hsl(var(--primary) / 0.5) 15%,
                              hsl(var(--primary) / 0.5) 20%,
                              transparent 20%,
                              transparent 30%,
                              hsl(var(--primary) / 0.5) 30%,
                              hsl(var(--primary) / 0.5) 35%,
                              transparent 35%,
                              transparent 45%,
                              hsl(var(--primary) / 0.5) 45%,
                              hsl(var(--primary) / 0.5) 50%,
                              transparent 50%,
                              transparent 60%,
                              hsl(var(--primary) / 0.5) 60%,
                              hsl(var(--primary) / 0.5) 65%,
                              transparent 65%,
                              transparent 75%,
                              hsl(var(--primary) / 0.5) 75%,
                              hsl(var(--primary) / 0.5) 80%,
                              transparent 80%,
                              transparent 90%,
                              hsl(var(--primary) / 0.5) 90%,
                              hsl(var(--primary) / 0.5) 95%,
                              transparent 95%,
                              transparent 100%
                            )
                          `,
                           maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
                        }}
                      >
                        <div className="absolute inset-0 w-full h-full animate-spin-slow bg-no-repeat bg-center"
                          style={{
                             backgroundImage: `
                              conic-gradient(from 270deg at 50% 50%,
                                transparent 0%,
                                transparent 5%,
                                hsl(var(--primary) / 0.5) 5%,
                                hsl(var(--primary) / 0.5) 15%,
                                transparent 15%,
                                transparent 25%,
                                hsl(var(--primary) / 0.5) 25%,
                                hsl(var(--primary) / 0.5) 35%,
                                transparent 35%,
                                transparent 45%,
                                hsl(var(--primary) / 0.5) 45%,
                                hsl(var(--primary) / 0.5) 55%,
                                transparent 55%,
                                transparent 65%,
                                hsl(var(--primary) / 0.5) 65%,
                                hsl(var(--primary) / 0.5) 75%,
                                transparent 75%,
                                transparent 85%,
                                hsl(var(--primary) / 0.5) 85%,
                                hsl(var(--primary) / 0.5) 95%,
                                transparent 95%
                              )
                            `,
                             maskImage: 'radial-gradient(circle at center, black 0%, transparent 70%)',
                          }}
                        />
                      </div>
                      <Image 
                          src={probuilderAvatar}
                          alt="ProBuilder AI Assistant"
                          fill
                          className="object-contain animate-hero-glow z-10"
                          unoptimized
                      />
                    </div>
                    {!user && (
                        <Button asChild size="lg" className="mt-4 text-lg font-bold shadow-lg">
                            <Link href="/sign-in">Get Started for Free</Link>
                        </Button>
                    )}
                    <div className="mt-10 flex items-center justify-center gap-4 text-muted-foreground font-body">
                        <span className='text-sm'>The AI Companion for</span>
                        <Image
                            src={'/coc_logo.png'}
                            alt="Clash of Clans Logo"
                            data-ai-hint="clash of clans logo"
                            width={120} 
                            height={40}
                            unoptimized
                        />
                    </div>
              </div>
          </section>

          <div className="container mx-auto px-4 my-20">
            <Image
                src={separator}
                alt="Section Separator"
                width={300}
                height={40}
                unoptimized
                className="w-40 h-auto object-contain opacity-70 mx-auto"
            />
          </div>

          {/* Features Section */}
          <section className="w-full py-20 lg:py-32 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center font-headline mb-24">Unlock Your Village's Full Potential</h2>
              <div className="flex flex-col items-center gap-y-24">
                {features.map((feature, index) => (
                  <div key={index} className="w-full max-w-5xl">
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      color={feature.color}
                      subFeatures={feature.subFeatures}
                      avatar={feature.avatar}
                      reverse={index % 2 !== 0}
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
                width={300}
                height={40}
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
          </footer>
      </div>
    </div>
  );
}
