import type { Metadata } from 'next';
import { Inter, Lilita_One } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
