
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
          y: 60, 
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            // onEnter, onLeave, onEnterBack, onLeaveBack
            toggleActions: 'play reverse play reverse',
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
