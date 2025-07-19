
import type { NextApiRequest, NextApiResponse } from 'next';

const cocApiProxy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { path } = req.query;
  const apiToken = process.env.CLASH_OF_CLANS_API_TOKEN;

  if (!apiToken) {
    return res.status(500).json({ reason: 'API token not configured on server.' });
  }

  // Join the path segments and prepend the base URL
  const cocUrl = `https://api.clashofclans.com/v1/${(path as string[]).join('/')}`;

  try {
    const apiResponse = await fetch(cocUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await apiResponse.json();

    res.status(apiResponse.status).json(data);

  } catch (error: any) {
    res.status(500).json({ reason: 'Failed to fetch from Clash of Clans API.', details: error.message });
  }
};

export default cocApiProxy;
