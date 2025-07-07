"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Castle } from "lucide-react";

export function LoginPage() {
    const { signInWithGoogle } = useAuth();
    
    return (
        <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Castle className="mx-auto h-16 w-16 text-primary" />
                    <CardTitle className="font-headline text-4xl mt-4">Welcome to Clash Master</CardTitle>
                    <CardDescription>Sign in to continue to your village dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={signInWithGoogle} className="w-full text-lg py-6">
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 65.6l-67.4 66.8C314.6 114.5 283.5 96 248 96c-106.1 0-192 85.9-192 192s85.9 192 192 192c106.1 0 192-85.9 192-192 0-26.3-5.3-51.4-14.8-74.2H248v-85.3h236.1c2.3 12.7 3.9 25.9 3.9 39.4z"></path></svg>
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
