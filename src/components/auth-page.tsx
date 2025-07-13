
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

import { carouselImageAssets } from '@/lib/image-paths';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;


export function AuthPage() {
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register: registerSignIn, handleSubmit: handleSignInSubmit, formState: { errors: signInErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSignIn = async (data: FormValues) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (data: FormValues) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password);
      toast({
        title: 'Account Created',
        description: "You've been successfully signed up! You are now logged in.",
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex-grow flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl border">
        <div className="hidden md:block relative">
            <Carousel className="w-full h-full" autoplay>
              <CarouselContent>
                {carouselImageAssets.map((img, index) => (
                  <CarouselItem key={index} className="p-0">
                    <div className="relative w-full h-[550px]">
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
        </div>

        <div className="bg-card flex flex-col justify-center p-6 sm:p-10">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <Card className="border-0 shadow-none">
                <form onSubmit={handleSignInSubmit(onSignIn)}>
                  <CardHeader className="px-1">
                    <CardTitle className="font-headline text-3xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your village.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-1">
                    <div className="space-y-2">
                      <Label htmlFor="email-signin">Email</Label>
                      <Input id="email-signin" type="email" placeholder="m@example.com" {...registerSignIn('email')} />
                       {signInErrors.email && <p className="text-xs text-destructive">{signInErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signin">Password</Label>
                      <Input id="password-signin" type="password" {...registerSignIn('password')} />
                      {signInErrors.password && <p className="text-xs text-destructive">{signInErrors.password.message}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="px-1">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="sign-up">
              <Card className="border-0 shadow-none">
                <form onSubmit={handleSignUpSubmit(onSignUp)}>
                  <CardHeader className="px-1">
                    <CardTitle className="font-headline text-3xl">Create Account</CardTitle>
                    <CardDescription>Get started with AI-powered village analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-1">
                     <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <Input id="email-signup" type="email" placeholder="m@example.com" {...registerSignUp('email')} />
                      {signUpErrors.email && <p className="text-xs text-destructive">{signUpErrors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Password</Label>
                      <Input id="password-signup" type="password" {...registerSignUp('password')} />
                       {signUpErrors.password && <p className="text-xs text-destructive">{signUpErrors.password.message}</p>}
                    </div>
                  </CardContent>
                  <CardFooter className="px-1">
                     <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
