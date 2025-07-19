
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
// This was removed as it was likely causing the issue. The client will login on demand.
(async () => {
    if (!email || !password) {
        console.warn('Clash of Clans email or password not set in .env file. API calls will fail.');
        return;
    }
    try {
        await clashClient.login({ email, password, keyName: 'probuilder-dev' });
        console.log('Successfully logged into Clash of Clans API on startup.');
    } catch (error) {
        console.error('Failed to login to Clash of Clans API on startup:', error);
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

        try {
            // The client will automatically handle login if needed.
            const player = await clashClient.players.get(playerTag);
            return player;
        } catch (error: any) {
            console.error("Error fetching player data:", error);
            if (error.status === 404) {
                 throw new Error(`Player with tag ${playerTag} not found.`);
            }
            if (error.status === 403) {
                throw new Error('Could not log in to the Clash of Clans API. Please check your credentials in the .env file and ensure your developer account IP is whitelisted.');
            }
            // Add a check to see if the client is not logged in and attempt to log in.
            if (!clashClient.isLoggedIn) {
                 try {
                    await clashClient.login({ email, password, keyName: 'probuilder-dev' });
                    console.log('Successfully logged into Clash of Clans API.');
                    const player = await clashClient.players.get(playerTag);
                    return player;
                } catch (loginError: any) {
                     console.error('Failed to login to Clash of Clans API:', loginError);
                     throw new Error('Failed to login and fetch player data. Please check your credentials.');
                }
            }
            throw new Error('Failed to fetch player data from the API. This could be due to an invalid API token or a network issue.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
