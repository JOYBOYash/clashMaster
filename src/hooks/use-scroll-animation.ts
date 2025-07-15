
"use client";

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = () => {
  useEffect(() => {
    // Animate feature cards on scroll
    const featureCards = gsap.utils.toArray('.feature-card');
    featureCards.forEach((card: any) => {
      gsap.fromTo(card, 
        { 
          y: 50, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%', // When the top of the card is 85% from the top of the viewport
            end: 'bottom 20%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Cleanup function to kill ScrollTriggers on component unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
};
