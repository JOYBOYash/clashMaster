
import type { NextApiRequest, NextApiResponse } from 'next';

const cocApiProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

  if (!apiToken) {
    console.error('CLASH_OF_CLANS_API_TOKEN is not set in .env file.');
    return res.status(500).json({ reason: 'API token not configured on server.' });
  }

  // The path array will contain the segments, e.g., ['players', '#GU82PJVGJ']
  // We need to encode the player tag specifically, which is the last segment.
  const pathSegments = (path as string[]);
  if (pathSegments.length > 1) {
    pathSegments[pathSegments.length - 1] = encodeURIComponent(pathSegments[pathSegments.length - 1]);
  }
  const cocPath = pathSegments.join('/');

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
        data = { reason: responseBody.trim() };
    }

    res.status(apiResponse.status).json(data);

  } catch (error: any) {
    console.error(`[PROXY] Error fetching from Clash of Clans API:`, error);
    res.status(500).json({ reason: 'Failed to fetch from Clash of Clans API.', details: error.message });
  }
};

export default cocApiProxy;
