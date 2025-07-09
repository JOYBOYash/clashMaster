
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary/50 border border-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="relative h-full w-full flex-1 bg-gradient-to-r from-accent to-primary/80 transition-transform duration-500 ease-out"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      {/* The two divs below create the "sloshing liquid" effect */}
      <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-liquid-rotate">
        <div 
          className="w-full h-full bg-primary/20"
          style={{
            borderRadius: '45%',
            animation: 'liquid-rotate 7s linear infinite',
            animationDelay: '-1s'
          }}
        />
      </div>
      <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 animate-liquid-rotate">
        <div
          className="w-full h-full bg-accent/20"
          style={{
            borderRadius: '40%',
            animation: 'liquid-rotate 10s linear infinite reverse',
          }}
        />
      </div>
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
