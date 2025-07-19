
'use server';
/**
 * @fileOverview A flow to fetch player data from the Clash of Clans API.
 *
 * - getPlayer - A function that takes a player tag and returns their data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import fetch from 'node-fetch';

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

        // The official API requires the tag to be encoded
        const encodedPlayerTag = encodeURIComponent(playerTag);
        const url = `https://api.clashofclans.com/v1/players/${encodedPlayerTag}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 403) {
                     throw new Error('Could not connect to the Clash of Clans API. Please check your API token and ensure your developer account IP is whitelisted.');
                }
                if (response.status === 404) {
                    throw new Error(`Player with tag ${playerTag} not found.`);
                }
                const errorBody = await response.json();
                console.error("Error fetching player data:", errorBody);
                throw new Error(`API returned status ${response.status}: ${errorBody.reason || 'Unknown error'}`);
            }

            const player = await response.json();
            return player;
        } catch (error: any) {
            console.error("Full error details:", error);
            // Re-throw a new, clean error to be caught by the client-side component
            throw new Error(error.message || 'An unexpected error occurred while fetching player data.');
        }
    }
);

export async function getPlayer(playerTag: string): Promise<any> {
    return getPlayerFlow(playerTag);
}
