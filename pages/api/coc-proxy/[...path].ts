
import type { NextApiRequest, NextApiResponse } from 'next';

const cocApiProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

  if (!apiToken) {
    console.error('CLASH_OF_CLANS_API_TOKEN is not set in .env file.');
    return res.status(500).json({ reason: 'API token not configured on server.' });
  }

  // The 'path' query will be an array of segments if there are slashes, or a string if not.
  const cocPath = Array.isArray(path) ? path.join('/') : path;

  if (!cocPath) {
      return res.status(400).json({ reason: 'Bad Request: Missing path parameter.' });
  }

  const cocUrl = `https://api.clashofclans.com/v1/${cocPath}`;
  console.log(`[PROXY] Forwarding request to: ${cocUrl}`);

  try {
    const apiResponse = await fetch(cocUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
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

export default cocApiProxy;
