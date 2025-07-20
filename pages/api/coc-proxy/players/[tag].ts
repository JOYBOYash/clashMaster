
import type { NextApiRequest, NextApiResponse } from 'next';

const cocPlayerProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { tag } = req.query;
  const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

  if (!apiToken) {
    console.error('CLASH_OF_CLANS_API_TOKEN is not set in .env file.');
    return res.status(500).json({ reason: 'API token not configured on server.' });
  }

  if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ reason: 'Bad Request: Missing or invalid player tag.' });
  }

  // The tag is already encoded by the client, but we ensure it's a valid string.
  // The final URL needs the tag to be encoded to handle the '#' character.
  const cocUrl = `https://api.clashofclans.com/v1/players/${tag}`;
  console.log(`[PROXY] Forwarding request to: ${cocUrl}`);

  try {
    const apiResponse = await fetch(cocUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      // Do not forward body for GET requests
      body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
    });

    const responseBody = await apiResponse.text();
    let data;
    try {
        data = JSON.parse(responseBody);
    } catch (e) {
        // If the API returns a non-JSON error (like a simple string for 'invalidIp'), wrap it.
        data = { reason: responseBody.trim() };
    }

    res.status(apiResponse.status).json(data);

  } catch (error: any) {
    console.error(`[PROXY] Error fetching from Clash of Clans API:`, error);
    res.status(500).json({ reason: 'Failed to fetch from Clash of Clans API.', details: error.message });
  }
};

export default cocPlayerProxy;
