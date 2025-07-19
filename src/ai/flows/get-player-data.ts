
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
            await clashClient.login({ email, password, keyName: 'probuilder-dev' });
            const player = await clashClient.players.get(playerTag);
            return player;
        } catch (error: any) {
            console.error("Error fetching player data:", error);
            if (error.status === 403) {
                throw new Error('Could not log in to the Clash of Clans API. Please check your credentials in the .env file and ensure your developer account IP is whitelisted.');
            }
            if (error.status === 404) {
                 throw new Error(`Player with tag ${playerTag} not found.`);
            }
            throw new Error('Failed to login and fetch player data. Please check your credentials and network.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
