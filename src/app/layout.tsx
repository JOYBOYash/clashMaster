import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';
import { AppWrapper } from '@/components/app-wrapper';

export const metadata: Metadata = {
  title: 'Blueprints',
  description: 'Master your Clash of Clans village with AI-powered upgrade suggestions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased font-body font-headline")}>
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
