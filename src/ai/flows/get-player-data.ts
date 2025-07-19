
'use server';
/**
 * @fileOverview A Genkit flow for fetching Clash of Clans player data.
 *
 * This file defines a flow that uses the `clashofclans.js` library to retrieve
 * player information from the official Clash of Clans API using email/password
 * for authentication, which handles API key rotation and IP whitelisting.
 *
 * - getPlayer - A function that fetches player data.
 * - GetPlayerInput - The input type for the getPlayer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Client } from 'clashofclans.js';

// Initialize the Clash of Clans client
const clashClient = new Client();

// Immediately-invoked async function to log in at server start
(async () => {
  try {
    const email = process.env.CLASH_OF_CLANS_EMAIL;
    const password = process.env.CLASH_OF_CLANS_PASSWORD;

    if (!email || !password) {
      console.warn('Clash of Clans email or password not set in .env. API calls may fail.');
      return;
    }
    
    await clashClient.login({ email, password });
    console.log('Successfully logged into Clash of Clans API.');
  } catch (error) {
    console.error('Failed to login to Clash of Clans API on startup:', error);
  }
})();


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
    try {
      // Ensure we are logged in before making a request
      if (!clashClient.isLoggedIn()) {
         console.log('Not logged in, attempting to log in now...');
         await clashClient.login({ 
             email: process.env.CLASH_OF_CLANS_EMAIL!, 
             password: process.env.CLASH_OF_CLANS_PASSWORD! 
         });
      }

      const player = await clashClient.players.get(playerTag);
      return player;
    } catch (error: any) {
      console.error(`Failed to fetch player data for tag ${playerTag}:`, error);

      // Provide more specific error messages based on the status code
      if (error.status === 403) {
        throw new Error('API request failed. Please check your Clash of Clans developer account credentials in the .env file and ensure your account is active.');
      }
      if (error.status === 404) {
        throw new Error(`Player with tag "${playerTag}" not found.`);
      }
      
      throw new Error(`Failed to fetch player data. Please verify the player tag and check your API credentials.`);
    }
  }
);
