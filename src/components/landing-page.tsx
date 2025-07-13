
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Castle, ShieldCheck, BarChart, Wand2, Heart } from 'lucide-react';
import Image from 'next/image';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card/50 border border-border/50">
    <div className="p-4 bg-primary/10 rounded-full mb-4">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-xl font-bold font-headline text-card-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);


export function LandingPage() {
  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full text-center py-20 lg:py-32 bg-gradient-to-b from-background to-muted/40">
        <div className="container mx-auto px-4">
            <div className="flex justify-center mb-6">
                <Image
                    src="https://placehold.co/400x150.png"
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

      <section className="w-full py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center font-headline mb-12">Why You'll Love Clash Master</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Wand2} 
              title="AI Upgrade Advisor" 
              description="Our smart AI analyzes your village and suggests the most optimal upgrades to maximize your progress." 
            />
            <FeatureCard 
              icon={BarChart} 
              title="Progress Tracking" 
              description="Visualize your entire village progress. See how far you've come and what's left to max out your base." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Strategic Army Guides" 
              description="Receive powerful army compositions tailored to your Town Hall and troop levels for any situation." 
            />
          </div>
        </div>
      </section>

      <section className="w-full py-20 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold font-headline mb-4">A Tool Built By Fans, For Fans</h2>
          <p className="text-lg text-foreground/80 mb-6">
            We're passionate Clash of Clans players, just like you. We built Clash Master to enhance the strategic depth of the game we love, providing tools to help you plan and progress more effectively. This app is a companion to your gaming experience, designed to take your strategy to the next level, not replace the incredible fun of playing.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Clash Master is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy: www.supercell.com/fan-content-policy.
          </p>
        </div>
      </section>

      <footer className="w-full py-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="font-headline text-lg font-bold">Clash Master</p>
          <p className="text-sm">built for fans by a fan</p>
        </div>
      </footer>
    </div>
  );
}
