
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
    <Card className="themed-card p-6 h-full flex flex-col text-left">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="flex items-center gap-3">
            <Icon className={cn("w-6 h-6", color)} />
            <span className='font-headline'>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 text-sm text-muted-foreground flex-grow">
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}
