
'use server';
/**
 * @fileOverview A Genkit flow for fetching Clash of Clans player data.
 *
 * This file defines a flow that uses node-fetch to retrieve
 * player information directly from the official Clash of Clans API.
 *
 * - getPlayer - A function that fetches player data.
 * - GetPlayerInput - The input type for the getPlayer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const GetPlayerInputSchema = z.string().min(4, 'Player tag is required.');
export type GetPlayerInput = z.infer<typeof GetPlayerInputSchema>;

export async function getPlayer(playerTag: GetPlayerInput) {
  return getPlayerFlow(playerTag);
}

const getPlayerFlow = ai.defineFlow(
  {
    name: 'getPlayerFlow',
    inputSchema: GetPlayerInputSchema,
    outputSchema: z.any(),
  },
  async (playerTag) => {
    const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

    if (!apiToken) {
      throw new Error(
        'Clash of Clans API token is not configured. Please add CLASH_OF_CLANS_API_TOKEN to your .env file.'
      );
    }

    // The player tag from the game includes a '#', but the API needs it to be URL-encoded (%23).
    const encodedPlayerTag = encodeURIComponent(playerTag);
    const url = `https://api.clashofclans.com/v1/players/${encodedPlayerTag}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        let errorDetails = 'An unknown error occurred.';
        try {
          const errorJson = await response.json();
          errorDetails = errorJson.reason || JSON.stringify(errorJson);
        } catch (e) {
          // Could not parse error JSON
          errorDetails = response.statusText;
        }

        if (response.status === 403) {
          throw new Error(`API request forbidden: ${errorDetails}. Please check your API token and ensure the server's IP address is whitelisted in your Clash of Clans developer account.`);
        }
        if (response.status === 404) {
          throw new Error(`Player with tag "${playerTag}" not found.`);
        }
        
        throw new Error(`API request failed with status ${response.status}: ${errorDetails}`);
      }

      const player = await response.json();
      return player;
    } catch (error: any) {
      console.error(`Failed to fetch player data for tag ${playerTag}:`, error);
      // Re-throw the error with a more descriptive message
      throw new Error(`Failed to fetch player data. Please verify the player tag and check your API credentials. Original error: ${error.message}`);
    }
  }
);
