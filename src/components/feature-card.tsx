
import type { ElementType } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

interface SubFeature {
  icon: ElementType;
  text: string;
}

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
  subFeatures: SubFeature[];
  avatar: string;
  reverse?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, color, subFeatures, avatar, reverse = false }: FeatureCardProps) {
  return (
    <div className={cn(
        "relative w-full bg-card shadow-2xl border border-border/20 overflow-hidden",
        "transition-all duration-300 hover:shadow-primary/20 hover:border-primary/40 hover:-translate-y-2",
        "feature-card opacity-0 [clip-path:polygon(0_0,_100%_0,_100%_100%,_0_100%)]" 
    )}
    style={{
        clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0 100%)'
    }}
    >
        <div className={cn(
            "absolute top-0 h-full w-2/3 bg-muted/30 -z-0",
            reverse ? "left-0 skew-x-[15deg] -translate-x-1/2" : "right-0 -skew-x-[15deg] translate-x-1/2"
        )}></div>
        
        <div className={cn("relative flex flex-col md:flex-row", reverse && "md:flex-row-reverse")}>

            {/* Column 1: Avatar (Now a separate block for mobile) */}
            <div className="relative w-full h-[280px] md:w-1/2 md:h-auto shrink-0 z-20">
                <div className={cn(
                    "absolute inset-0 w-full h-full flex items-center justify-center",
                    reverse ? "md:justify-start" : "md:justify-end"
                )}>
                    <div className={cn(
                        "relative w-[280px] h-[280px]", // Mobile size
                        "md:w-[450px] md:h-[450px]" // Desktop size
                    )}>
                        <Image
                            src={avatar}
                            alt={`${title} Avatar`}
                            fill
                            className="object-contain object-bottom drop-shadow-2xl animate-hero-glow"
                            unoptimized
                        />
                    </div>
                </div>
            </div>

            {/* Column 2: Content */}
            <div className="relative flex flex-col justify-center p-8 lg:p-12 md:w-1/2 z-10">
                <div className="flex items-center gap-4 mb-4">
                    <Icon className={cn("w-8 h-8", color)} />
                    <h3 className="font-headline text-3xl text-foreground/90">{title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6">{description}</p>

                <Separator className="my-4 bg-border/50" />

                <ul className='space-y-4 mt-4'>
                    {subFeatures.map((sub, index) => (
                        <li key={index} className='flex items-center gap-4 text-sm'>
                            <sub.icon className={cn("w-5 h-5 shrink-0", color)} />
                            <span className="text-foreground/80">{sub.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
}
