
'use server';
/**
 * @fileOverview A server-side flow to securely fetch Clash of Clans player data.
 *
 * - getPlayer: An async function to be called from the client to fetch player data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from 'clashofclans.js';

// Initialize the Clash of Clans client
const cocClient = new Client({ keys: [process.env.CLASH_OF_CLANS_API_TOKEN!] });

// Define the input schema for the flow
const PlayerTagInputSchema = z.string().refine(val => val.startsWith('#'), {
  message: 'Player tag must start with #',
});

// Define the output schema for the flow (can be 'any' for complex, nested objects)
const PlayerDataOutputSchema = z.any();

/**
 * A wrapper function that is safe to export from a "use server" module.
 * It takes the player tag, calls the underlying Genkit flow, and returns the data.
 *
 * @param playerTag The player's Clash of Clans tag (e.g., "#2PP").
 * @returns The player's data as a JSON object.
 */
export async function getPlayer(playerTag: string): Promise<any> {
  return getPlayerFlow(playerTag);
}

// Define the Genkit flow
const getPlayerFlow = ai.defineFlow(
  {
    name: 'getPlayerFlow',
    inputSchema: PlayerTagInputSchema,
    outputSchema: PlayerDataOutputSchema,
  },
  async (playerTag) => {
    try {
      // Use the clashofclans.js client to fetch player data
      const data = await cocClient.getPlayer(playerTag);
      return data;
    } catch (error: any) {
      // Handle potential errors, such as invalid tags or API issues
      if (error.status === 404) {
        throw new Error(`Player with tag "${playerTag}" not found.`);
      }
      if (error.status === 403) {
         throw new Error(`API request forbidden: ${error.message}. Please check your API token and ensure your server IP is whitelisted in your Clash of Clans developer account.`);
      }
      // Log the full error for debugging on the server
      console.error("Clash of Clans API Error:", error);
      throw new Error(error.message || 'Failed to fetch player data from the Clash of Clans API.');
    }
  }
);
