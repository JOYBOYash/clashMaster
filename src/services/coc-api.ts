
'use server';

// A simplified version of the Clash of Clans Player API response
type ApiBuilding = {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
};

type ApiTroop = {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
};

export type PlayerApiResponse = {
  tag: string;
  name:string;
  townHallLevel: number;
  builderHallLevel?: number;
  buildings: ApiBuilding[];
  troops: ApiTroop[];
};

export async function getPlayerInfo(playerTag: string): Promise<PlayerApiResponse> {
  const token = process.env.COC_API_TOKEN;

  if (!token || token.trim() === '') {
    console.error('COC_API_TOKEN is not set or is empty in the environment variables.');
    throw new Error('Server configuration error: The Clash of Clans API token is missing. Please add your token to the .env file.');
  }

  // NOTE: This uses the official API directly.
  const baseUrl = 'https://api.clashofclans.com/v1';
  const encodedTag = encodeURIComponent(playerTag);
  const url = `${baseUrl}/players/${encodedTag}`;

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Ensure data is always fresh by not caching the response.
      cache: 'no-store',
    });
  } catch (error) {
    console.error("Network error fetching from CoC API:", error);
    throw new Error("Could not connect to the Clash of Clans API. The service might be temporarily down.");
  }


  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`CoC API request failed with status ${response.status}:`, errorBody);
    
    if (response.status === 404) {
      throw new Error("Player Not Found (404). Please check the player tag and try again.");
    }
    if (response.status === 400) {
        throw new Error("Bad Request (400). The player tag might be malformed.");
    }
     if (response.status === 403) {
      throw new Error("Access Denied (403 Forbidden). This means your API token is correct, but the request came from an IP address that is not whitelisted in your CoC Developer account. To fix this for local development, run the app on a machine with a whitelisted IP.");
    }
    
    let reason = 'An unknown error occurred';
    try {
        const errorJson = JSON.parse(errorBody);
        reason = errorJson.reason || reason;
    } catch (e) {
        reason = `The API returned an unexpected error (Status: ${response.status})`;
    }
    throw new Error(reason);
  }

  return await response.json() as PlayerApiResponse;
}
