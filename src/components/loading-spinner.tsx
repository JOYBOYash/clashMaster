
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  "The Royal Champion's spear can pierce a Town Hall from one end to the other."
];

export function LoadingSpinner({ show }: { show: boolean }) {
  const [currentTriviaIndex, setCurrentTriviaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    // Select a random trivia question on mount
    setCurrentTriviaIndex(Math.floor(Math.random() * trivia.length));
  }, []);

  useEffect(() => {
    // Control visibility with a fade effect
    if (!show) {
      // Start fade out
      const timer = setTimeout(() => setIsVisible(false), 500); // Wait for fade-out to complete
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [show]);

  const nextTrivia = () => {
    setCurrentTriviaIndex((prevIndex) => (prevIndex + 1) % trivia.length);
  };
  
  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn(
      "fixed inset-0 flex flex-col justify-center items-center bg-background/90 backdrop-blur-sm z-50 transition-opacity duration-500",
      show ? "opacity-100" : "opacity-0"
    )}>
      <div className="text-center p-8 max-w-md">
        <p className="text-lg text-foreground/80 mb-6 italic min-h-[6em]">
          {trivia[currentTriviaIndex] || "Loading interesting facts..."}
        </p>
        <div className="flex justify-center items-center space-x-2 mb-6">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
         <Button variant="outline" size="sm" onClick={nextTrivia}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Next Tip
        </Button>
      </div>
    </div>
  );
}
