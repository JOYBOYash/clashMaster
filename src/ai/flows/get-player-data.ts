
'use server';
/**
 * @fileOverview A flow to fetch player data from the Clash of Clans API.
 *
 * - getPlayer - A function that takes a player tag and returns their data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import coc from 'clash-of-clans-api';

const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

const PlayerDataSchema = z.any(); // Using z.any() for now, can be refined later.

const getPlayerFlow = ai.defineFlow(
    {
        name: 'getPlayerFlow',
        inputSchema: z.string(),
        outputSchema: PlayerDataSchema,
    },
    async (playerTag) => {
        if (!apiToken || apiToken === 'YOUR_TOKEN_HERE') {
            throw new Error('The CLASH_OF_CLANS_API_TOKEN is not configured in your .env file.');
        }

        const client = coc({
            token: apiToken
        });

        try {
            const player = await client.playerByTag(playerTag);
            return player;
        } catch (error: any) {
            console.error("Error fetching player data:", error);
            if (error.status === 403) {
                throw new Error('Could not connect to the Clash of Clans API. Please check your API token and ensure your developer account IP is whitelisted.');
            }
            if (error.status === 404) {
                 throw new Error(`Player with tag ${playerTag} not found.`);
            }
            throw new Error('Failed to fetch player data. Please check your API token, network connection, and player tag.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
