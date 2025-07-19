
'use server';
/**
 * @fileOverview A flow to fetch player data from the Clash of Clans API.
 *
 * - getPlayer - A function that takes a player tag and returns their data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from 'clashofclans.js';

const email = process.env.CLASH_OF_CLANS_EMAIL;
const password = process.env.CLASH_OF_CLANS_PASSWORD;

// Initialize the client.
const clashClient = new Client();

const PlayerDataSchema = z.any(); // Using z.any() for now, can be refined later.

// A self-invoking async function to log in and handle top-level errors.
(async () => {
    if (!email || !password) {
        console.warn('Clash of Clans email or password not set in .env file. API calls will fail.');
        return;
    }
    try {
        await clashClient.login({ email, password, keyName: 'probuilder-dev' });
        console.log('Successfully logged into Clash of Clans API.');
    } catch (error) {
        console.error('Failed to login to Clash of Clans API:', error);
    }
})();


const getPlayerFlow = ai.defineFlow(
    {
        name: 'getPlayerFlow',
        inputSchema: z.string(),
        outputSchema: PlayerDataSchema,
    },
    async (playerTag) => {
        if (!email || !password) {
            throw new Error('The CLASH_OF_CLANS_EMAIL and/or CLASH_OF_CLANS_PASSWORD are not configured in your .env file.');
        }

        // Check if the client is ready
        if (!clashClient.isReady()) {
            try {
                // Attempt to re-login if not ready
                 await clashClient.login({ email, password, keyName: 'probuilder-dev' });
            } catch (e) {
                 throw new Error('Could not log in to the Clash of Clans API. Please check your credentials in the .env file.');
            }
        }
        
        try {
            const player = await clashClient.players.get(playerTag);
            return player;
        } catch (error: any) {
            console.error("Error fetching player data:", error);
            if (error.status === 404) {
                 throw new Error(`Player with tag ${playerTag} not found.`);
            }
            throw new Error('Failed to fetch player data from the API. This could be due to an invalid API token or a network issue.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
