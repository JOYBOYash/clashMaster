
import type { NextApiRequest, NextApiResponse } from 'next';

const cocApiProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

  if (!apiToken) {
    console.error('CLASH_OF_CLANS_API_TOKEN is not set in .env file.');
    return res.status(500).json({ reason: 'API token not configured on server.' });
  }

  const pathSegments = (path as string[]).join('/');
  const cocUrl = `https://api.clashofclans.com/v1/${pathSegments}`;
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
    // Try to parse as JSON, but fall back to text if it fails
    let data;
    try {
        data = JSON.parse(responseBody);
    } catch {
        data = { reason: responseBody };
    }

    res.status(apiResponse.status).json(data);

  } catch (error: any) {
    console.error(`[PROXY] Error fetching from Clash of Clans API:`, error);
    res.status(500).json({ reason: 'Failed to fetch from Clash of Clans API.', details: error.message });
  }
};

export default cocApiProxy;
