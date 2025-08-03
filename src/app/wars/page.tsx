
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, PlusCircle, Users } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function WarsPage() {
    const { user } = useAuth();
    const [roomName, setRoomName] = useState('');

    if (!user) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>You must be signed in to access the War Room.</AlertDescription>
            </Alert>
        );
    }

    const handleCreateRoom = () => {
        // Placeholder for future functionality
        alert(`Creating room: "${roomName}"`);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                        <Shield className="w-8 h-8 text-primary" />
                        War Room
                    </CardTitle>
                    <CardDescription>
                        Collaborate with clanmates. Plan your war attacks with a shared visual strategy board.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Create a New War Room</CardTitle>
                        <CardDescription>
                            Start a new strategy session and invite your clanmates to join.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="room-name">Room Name</Label>
                            <Input
                                id="room-name"
                                placeholder="e.g., War against 'The Titans'"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                        </div>
                        <Button className="w-full" onClick={handleCreateRoom} disabled={!roomName}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Room
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Join an Existing Room</CardTitle>
                        <CardDescription>
                            Enter an invite code from a clanmate to join their strategy session.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label htmlFor="invite-code">Invite Code</Label>
                            <Input
                                id="invite-code"
                                placeholder="Enter code..."
                            />
                        </div>
                        <Button variant="secondary" className="w-full">
                            <Users className="mr-2 h-4 w-4" />
                            Join Room
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        Your currently active war rooms will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        You have no active war rooms.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
