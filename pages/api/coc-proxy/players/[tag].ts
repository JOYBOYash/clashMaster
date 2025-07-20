
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'clashofclans.js';

// Initialize the client.
// We use a singleton pattern to ensure the client is initialized only once.
let cocClient: Client | null = null;
let clientLoginPromise: Promise<Client> | null = null;

async function getClient(): Promise<Client> {
    // If we have a logged-in client, return it.
    if (cocClient) {
        return cocClient;
    }

    // If login is already in progress, wait for it to complete.
    if (clientLoginPromise) {
        return clientLoginPromise;
    }

    // Start a new login process.
    clientLoginPromise = (async () => {
        const newClient = new Client();
        const email = process.env.CLASH_OF_CLANS_DEVELOPER_EMAIL;
        const password = process.env.CLASH_OF_CLANS_DEVELOPER_PASSWORD;

        if (!email || !password) {
            throw new Error('Clash of Clans developer credentials are not set in .env file.');
        }

        try {
            await newClient.login({
                email,
                password,
                keyName: 'probuilder-dynamic-key' // A unique name for the key
            });
            cocClient = newClient; // Store the successfully logged-in client.
            return newClient;
        } catch (error) {
            clientLoginPromise = null; // Reset promise on failure to allow retries.
            console.error('[PROXY] Clash of Clans login failed:', error);
            throw new Error('Failed to login to Clash of Clans API. Check credentials.');
        }
    })();

    return clientLoginPromise;
}

const cocPlayerProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tag } = req.query;

  if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ reason: 'Bad Request: Missing or invalid player tag.' });
  }

  try {
    const client = await getClient();
    console.log(`[PROXY] Fetching player with tag: ${tag}`);
    const playerData = await client.players.get(tag);
    res.status(200).json(playerData);

  } catch (error: any) {
    console.error(`[PROXY] Error from clashofclans.js client:`, error);
    
    // The clashofclans.js library might throw errors with status codes.
    const status = error.status || 500;
    const reason = error.message || 'Failed to fetch from Clash of Clans API.';
    
    res.status(status).json({ reason, details: error.stack });
  }
};

export default cocPlayerProxy;
