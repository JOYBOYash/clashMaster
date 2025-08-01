
"use client";

import { useState, useEffect } from 'react';

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

export function LoadingSpinner() {
  const [randomTrivia, setRandomTrivia] = useState('');

  useEffect(() => {
    // Select a random trivia question on the client-side to avoid hydration mismatch
    setRandomTrivia(trivia[Math.floor(Math.random() * trivia.length)]);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-background/90 backdrop-blur-sm z-50">
      <div className="text-center p-8 max-w-md">
        <p className="text-lg text-foreground/80 mb-6 italic">
          {randomTrivia || "Loading interesting facts..."}
        </p>
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
