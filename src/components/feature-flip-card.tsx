
import type { ElementType } from 'react';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ElementType;
  title: string;
  description: string;
  color: string;
}

export function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className="themed-card p-6 h-full text-center flex flex-col items-center">
      <div className={cn("mb-4 flex items-center justify-center w-20 h-20 rounded-full bg-primary/10", color)}>
        <Icon className="w-12 h-12" />
      </div>
      <h3 className="text-xl font-bold font-headline text-card-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}
