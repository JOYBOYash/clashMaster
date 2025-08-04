
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { getWarRoomListener } from '@/lib/firebase-service';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ShieldCheck } from 'lucide-react';

// This will be the main component for the strategy board
function StrategyBoard({ room }: { room: any }) {
    // For now, it's a placeholder. We will build this out.
    return (
        <div className="w-full h-[600px] bg-green-900/20 border-4 border-dashed border-green-700/30 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground text-2xl font-bold">Strategy Board Area</p>
        </div>
    );
}


export default function WarRoomPage() {
    const { user } = useAuth();
    const params = useParams();
    const roomId = params.roomId as string;
    const [room, setRoom] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomId || !user) {
            setLoading(false);
            return;
        };

        const unsubscribe = getWarRoomListener(roomId, (roomData) => {
            if (roomData) {
                // Check if current user is a member
                if (!roomData.members.includes(user.uid)) {
                    setError("You don't have access to this war room.");
                    setRoom(null);
                } else {
                    setRoom(roomData);
                    setError(null);
                }
            } else {
                setError("War room not found.");
                setRoom(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();

    }, [roomId, user]);

    if (loading) {
        return <LoadingSpinner show={true} />;
    }

    if (error) {
        return (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }
    
    if (!room) {
        return <LoadingSpinner show={true} />;
    }
    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                           <ShieldCheck className="w-8 h-8 text-primary"/>
                           {room.name}
                        </CardTitle>
                        <CardDescription>
                            Room ID: <span className="font-mono bg-muted p-1 rounded-md">{room.id}</span> (Share this with your clanmates)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-bold mb-2">Members ({room.members.length}):</h4>
                        <div className="flex flex-wrap gap-2">
                            {room.members.map((memberId: string) => (
                                <div key={memberId} className="bg-primary/10 text-primary-foreground/80 text-xs font-bold p-2 rounded-full">
                                    {memberId.substring(0, 6)}...
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <StrategyBoard room={room} />
                    </div>
                    <div>
                        <Card>
                            <CardHeader><CardTitle>Saved Armies</CardTitle></CardHeader>
                            <CardContent>
                                 <p className="text-muted-foreground text-center">Army selection will be here.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

