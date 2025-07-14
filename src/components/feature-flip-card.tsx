
import type { ElementType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className="themed-card p-6 h-full flex flex-col text-left pt-24">
      <CardHeader className="p-0 mb-4 text-center">
        <CardTitle className="flex items-center justify-center gap-3">
            <Icon className={cn("w-5 h-5", color)} />
            <span className='font-headline'>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-sm text-muted-foreground flex-grow text-center">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
