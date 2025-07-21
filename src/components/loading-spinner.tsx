
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from './ui/progress';
import { heroAvatarAssets } from '@/lib/image-paths';

const trivia = [
  "Did you know? The P.E.K.K.A's armor is so heavy that the Spring Trap doesn't affect her.",
  "What is a group of Wizards called? A Coven? A flock? Nobody knows.",
  "The Wall Breaker's true passion is actually landscape gardening.",
  "Legend says the Barbarian King's sword was forged from a fallen star.",
  "The Hog Rider's hog is named 'Hog'. Creative, right?",
  "An Archer's favorite food is arrow-root stew.",
  "Goblins can smell gold from over a mile away. It's both a blessing and a curse.",
  "A Dragon's fire is hot enough to toast a marshmallow from 50 paces away.",
  "The Healer once tried to heal a broken heart. It didn't work.",
  "Minions are made of pure Dark Elixir and a hint of mischief.",
  "The Grand Warden can float because he simply forgot how gravity works.",
  "The Royal Champion's spear can pierce a Town Hall from one end to the other.",
  "Never underestimate an angry Barbarian. Or a happy one. Just... be careful with Barbarians.",
  "Giants love a good spa day. All that smashing is tough on the muscles.",
  "The Builder's favorite song is 'We Will Rock You'.",
];

export function LoadingSpinner({ show, progress, total }: { show: boolean, progress?: number, total?: number }) {
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [currentAvatar, setCurrentAvatar] = useState(heroAvatarAssets[0]);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setCurrentTriviaIndex(Math.floor(Math.random() * trivia.length));
    setCurrentAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  }, []);

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [show]);

  const nextTrivia = () => {
    setCurrentTriviaIndex((prevIndex) => (prevIndex + 1) % trivia.length);
    setCurrentAvatar(heroAvatarAssets[Math.floor(Math.random() * heroAvatarAssets.length)]);
  };
  
  if (!isVisible) {
    return null;
  }

  const showProgress = typeof progress === 'number' && typeof total === 'number' && total > 0;
  const loadedCount = showProgress ? Math.round((progress / 100) * total) : 0;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex flex-col md:flex-row items-center justify-center transition-opacity duration-500 bg-background",
      show ? "opacity-100" : "opacity-0"
    )}>
       <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.15), transparent 70%)'
        }}
      ></div>

      {/* Left side: Hero Avatar */}
      <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8 overflow-hidden">
         <div className="absolute inset-0 bg-muted/20 skew-x-[-15deg] -translate-x-1/2 md:translate-x-0"></div>
         <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[550px] md:h-[550px]">
            <Image
                src={currentAvatar}
                alt="Hero Avatar"
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(var(--primary-rgb),0.3)] animate-float"
                priority
                unoptimized
            />
        </div>
      </div>

      {/* Right side: Content */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center md:items-start p-8 md:p-16 relative z-10">
        <div className="flex flex-col items-center md:items-start max-w-lg w-full text-center md:text-left">
          
          <div className="flex items-start gap-4 mb-8 w-full min-h-[10rem] md:min-h-[12rem]">
            <div className="flex-grow">
              <p className="font-headline text-2xl md:text-3xl lg:text-4xl text-primary drop-shadow-sm">
                <span className="text-6xl lg:text-7xl opacity-50">“</span>
                {trivia[currentTriviaIndex] || "Loading interesting facts..."}
                <span className="text-6xl lg:text-7xl opacity-50">”</span>
              </p>
            </div>
          </div>
          
          {showProgress ? (
            <div className="w-full mb-6">
              <Progress value={progress} className="w-full h-2.5 bg-muted/50" />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground mt-2">
                  Syncing Village Data...
                </p>
                 <p className="text-sm text-muted-foreground mt-2 font-mono">
                  {loadedCount} / {total}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center md:justify-start items-center space-x-2 mb-6 w-full">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={nextTrivia}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Next Tip
          </Button>
        </div>
      </div>
    </div>
  );
}
