"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SurveyProgressProps {
  totalSteps: number;
  currentStep: number;
}

export function SurveyProgress({ totalSteps, currentStep }: SurveyProgressProps) {
  return (
    <div className="flex items-center w-full py-4" aria-label="Survey progress">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={index}>
            <div className="relative shrink-0">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-border',
                  isActive && 'border-primary'
                )}
              >
                {isCompleted && <Check className="w-5 h-5" />}
              </div>
              {isActive && (
                <div className="absolute top-0 left-0 w-full h-full rounded-full ring-4 ring-primary/20 animate-pulse" />
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 transition-colors duration-300 mx-1",
                  isCompleted ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
