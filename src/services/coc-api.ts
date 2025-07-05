
'use server';

// A simplified version of the Clash of Clans Player API response
type ApiBuilding = {
  name: string;
  level: number;
  maxLevel: number;
  village: 'home' | 'builderBase';
};

export type PlayerApiResponse = {
  tag: string;
  name: string;
  townHallLevel: number;
  builderHallLevel?: number;
  buildings: ApiBuilding[];
};

export async function getPlayerInfo(playerTag: string): Promise<PlayerApiResponse> {
  const token = process.env.COC_API_TOKEN;
  // Use a proxy to avoid IP whitelisting issues in cloud environments.
  const baseUrl = process.env.COC_API_BASE_URL || 'https://cocproxy.royaleapi.dev/v1';

  if (!token) {
    console.error('COC_API_TOKEN is not set in the environment variables.');
    throw new Error('Server is not configured to connect to the Clash of Clans API.');
  }
  
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
      // Use Next.js revalidation to cache the response
      next: { revalidate: 3600 } // Cache for 1 hour
    });
  } catch (error) {
    console.error("Network error fetching from CoC API:", error);
    throw new Error("Could not connect to the Clash of Clans API. Please try again later.");
  }


  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ reason: 'unknown' }));
    console.error(`CoC API request failed with status ${response.status}:`, errorData);
    if (response.status === 403) {
      // Now that we use a proxy, this error is most likely due to an invalid token.
      throw new Error("Invalid API token. Please check the token in your .env file and try again.");
    }
    if (response.status === 404) {
      throw new Error("Player not found. Please check the tag and try again.");
    }
    throw new Error(errorData.reason || `API request failed with status ${response.status}`);
  }

  return response.json();
}
