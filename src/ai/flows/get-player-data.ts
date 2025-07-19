
'use server';
/**
 * @fileOverview A flow to fetch player data from the Clash of Clans API.
 *
 * - getPlayer - A function that takes a player tag and returns their data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from 'clashofclans.js';

// Initialize the client with your API token.
const clashClient = new Client({
    token: process.env.CLASH_OF_CLANS_API_TOKEN!,
});

const PlayerDataSchema = z.any(); // Using z.any() for now, can be refined later.

const getPlayerFlow = ai.defineFlow(
    {
        name: 'getPlayerFlow',
        inputSchema: z.string(),
        outputSchema: PlayerDataSchema,
    },
    async (playerTag) => {
        try {
            // In v2.8.0, getPlayer is an async method on the client instance.
            const player = await clashClient.players.get(playerTag);
            return player;
        } catch (error: any) {
            // The clashofclans.js library throws errors for not found, etc.
            console.error("Error fetching player data:", error);
            if (error.status === 404) {
                 throw new Error(`Player with tag ${playerTag} not found.`);
            }
            throw new Error('Failed to fetch player data from the API.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
