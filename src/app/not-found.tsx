
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { probuilderAvatar } from '@/lib/image-paths';
import { Home } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { MainHeader } from '@/components/main-header';
import { AppWrapper } from '@/components/app-wrapper';
import RootLayout from './layout';

export default function NotFound() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-background">
        {!user && (
            <div className="flex flex-col items-center justify-center flex-grow text-center p-4">
                <div className="relative w-48 h-48 mb-8 animate-float">
                    <Image
                    src={probuilderAvatar}
                    alt="ProBuilder AI Assistant"
                    fill
                    className="object-contain"
                    unoptimized
                    />
                </div>
                <h1 className="text-6xl font-bold font-headline text-primary">404</h1>
                <h2 className="text-2xl font-semibold text-foreground mt-4 mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    Oops! It looks like the page you were trying to reach doesn't exist or has been moved.
                </p>
                <Button asChild size="lg">
                    <Link href="/">
                    <Home className="mr-2" />
                    Go Back Home
                    </Link>
                </Button>
            </div>
        )}
        {user && (
             <AppWrapper>
                 <div className="flex flex-col items-center justify-center flex-grow text-center p-4">
                    <div className="relative w-48 h-48 mb-8 animate-float">
                        <Image
                        src={probuilderAvatar}
                        alt="ProBuilder AI Assistant"
                        fill
                        className="object-contain"
                        unoptimized
                        />
                    </div>
                    <h1 className="text-6xl font-bold font-headline text-primary">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground mt-4 mb-2">Page Not Found</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm">
                        Oops! It looks like the page you were trying to reach doesn't exist or has been moved.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/">
                        <Home className="mr-2" />
                        Go Back Home
                        </Link>
                    </Button>
                </div>
            </AppWrapper>
        )}
    </div>
  );
}
