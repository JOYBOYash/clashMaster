
import type { ElementType } from 'react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
}

export function FlipCard({ icon: Icon, title, description, color }: FlipCardProps) {
  return (
    <div className="bg-transparent h-64 w-full [perspective:1000px] group">
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front of Card */}
        <div className="absolute inset-0 p-6 rounded-xl bg-card/60 border shadow-lg flex flex-col items-center justify-center text-center [backface-visibility:hidden]">
          <div className={cn("mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10", color)}>
            <Icon className="w-12 h-12" />
          </div>
          <h3 className="text-xl font-bold font-headline text-card-foreground">{title}</h3>
        </div>
        
        {/* Back of Card */}
        <div className="absolute inset-0 p-6 rounded-xl bg-primary/90 border-2 border-primary text-primary-foreground [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex flex-col items-center justify-center h-full text-center">
             <h3 className="text-xl font-bold font-headline mb-3">{title}</h3>
            <p className="text-sm text-primary-foreground/90">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
