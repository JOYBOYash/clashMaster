import { Castle } from 'lucide-react';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Castle className="h-8 w-8 mr-2 text-primary" />
          <h1 className="text-2xl font-bold text-primary font-headline">
            ClashTrack
          </h1>
        </div>
      </div>
    </header>
  );
}
