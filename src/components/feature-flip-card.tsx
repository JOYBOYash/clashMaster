
import type { ElementType } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
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
}

export function FeatureCard({ icon: Icon, title, description, color, subFeatures }: FeatureCardProps) {
  return (
    <Card className="themed-card p-6 h-full flex flex-col text-left pt-28 shadow-2xl">
      <CardHeader className="p-0 mb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-xl">
            <Icon className={cn("w-6 h-6", color)} />
            <span className='font-headline'>{title}</span>
        </CardTitle>
        <CardDescription className="mt-2 text-center text-sm px-4">
          {description}
        </CardDescription>
      </CardHeader>
      
      <Separator className='my-4 bg-border/50' />

      <CardContent className="p-0 flex-grow">
        <ul className='space-y-3'>
          {subFeatures.map((sub, index) => (
            <li key={index} className='flex items-center gap-3 text-sm text-muted-foreground'>
              <sub.icon className={cn("w-5 h-5 shrink-0", color)} />
              <span>{sub.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
