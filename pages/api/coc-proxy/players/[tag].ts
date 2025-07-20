
import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'clashofclans.js';

const cocPlayerProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tag } = req.query;

  if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ reason: 'Bad Request: Missing or invalid player tag.' });
  }

  try {
    const client = new Client();
    const email = process.env.CLASH_OF_CLANS_DEVELOPER_EMAIL;
    const password = process.env.CLASH_OF_CLANS_DEVELOPER_PASSWORD;

    if (!email || !password) {
        throw new Error('Clash of Clans developer credentials are not set in .env file.');
    }
    
    // Log in to the client
    await client.login({
        email,
        password,
        keyName: 'probuilder-dynamic-key' // A unique name for the key
    });
    
    console.log(`[PROXY] Fetching player with tag: ${tag}`);
    // Corrected method call from client.players.get(tag) to client.getPlayer(tag)
    const playerData = await client.getPlayer(tag);
    
    res.status(200).json(playerData);

  } catch (error: any) {
    console.error(`[PROXY] Error from clashofclans.js client:`, error);
    
    // The clashofclans.js library might throw errors with status codes.
    const status = error.status || 500;
    const reason = error.reason || error.message || 'Failed to fetch from Clash of Clans API.';
    
    res.status(status).json({ reason, details: error.stack });
  }
};

export default cocPlayerProxy;
