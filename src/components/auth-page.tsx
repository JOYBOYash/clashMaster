
"use client";

import { useState } from 'react';
<<<<<<< HEAD
=======
import { useRouter } from 'next/navigation';
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export const AuthPage = () => {
  const { signUp, signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
<<<<<<< HEAD
=======
  const router = useRouter();
>>>>>>> fd5258aa9186144357a3d0ca6b8f875a4375fbb4
  const [formLoading, setFormLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('sign-in');

  const { register: registerSignIn, handleSubmit: handleSignInSubmit, formState: { errors: signInErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSignIn: SubmitHandler<FormValues> = async (data) => {
    setFormLoading(true);
    try {
      await signIn(data.email, data.password);
      toast({ title: 'Sign In Successful', description: 'Welcome back!' });
      window.location.href = '/'; // Redirect to landing page on successful sign-in
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const onSignUp: SubmitHandler<FormValues> = async (data) => {
    setFormLoading(true);
    try {
      await signUp(data.email, data.password);
      toast({ title: 'Sign Up Successful', description: 'Welcome! You can now sign in.' });
      setActiveTab('sign-in');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: 'destructive',
          title: 'Account Exists',
          description: 'This email is already registered. Please sign in.',
        });
        setActiveTab('sign-in');
      } else {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: error.message || 'An unexpected error occurred.',
        });
      }
    } finally {
      setFormLoading(false);
    }
  };
  
  const isLoading = formLoading || authLoading;

  if (!authLoading && user) {
    window.location.href = '/';
  }

  return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign-in">
          <Card className="border-0 shadow-none transition-none hover:transform-none hover:shadow-none">
            <form onSubmit={handleSignInSubmit(onSignIn)}>
              <CardHeader className="px-1">
                <CardTitle className="font-headline text-3xl animate-fade-in-up">Welcome Back</CardTitle>
                <CardDescription className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Enter your credentials to access your account.</CardDescription>
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="sign-up">
          <Card className="border-0 shadow-none transition-none hover:transform-none hover:shadow-none">
            <form onSubmit={handleSignUpSubmit(onSignUp)}>
              <CardHeader className="px-1">
                <CardTitle className="font-headline text-3xl animate-fade-in-up">Create Account</CardTitle>
                <CardDescription className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Get started with your new account.</CardDescription>
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
                 <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
  );
}
