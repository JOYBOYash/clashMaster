import type { Metadata } from 'next';
import { Inter, Lilita_One } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';
import { MainHeader } from '@/components/main-header';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const fontHeadline = Lilita_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-headline',
})

export const metadata: Metadata = {
  title: 'Clash Master',
  description: 'Master your Clash of Clans village with AI-powered upgrade suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-body antialiased", fontBody.variable, fontHeadline.variable)}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
            <MainHeader />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Toaster />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
