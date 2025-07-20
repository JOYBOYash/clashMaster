
/**
 * @fileOverview Client-side function to fetch Clash of Clans player data via a server proxy.
 */

export async function getPlayer(playerTag: string) {
  // Pass the tag as a query parameter to avoid issues with the '#' character in the URL path.
  const path = 'players';
  const url = `/api/coc-proxy/${path}?tag=${playerTag}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorDetails = 'An unknown error occurred.';
      try {
        const errorJson = await response.json();
        // The proxy will forward the 'reason' from the CoC API.
        errorDetails = errorJson.reason || JSON.stringify(errorJson);
      } catch (e) {
        // If the response isn't JSON, use the status text.
        errorDetails = response.statusText;
      }

      if (response.status === 400) {
        throw new Error(`API request failed with status ${response.status}: Bad Request: ${errorDetails}`);
      }

      if (response.status === 403) {

         if (errorDetails.includes('invalidIp')) {
          throw new Error(`IP Address Not Allowed by API. FIX: Go to developer.clashofclans.com, select your key, and add this server's IP to the allowed list. For cloud hosting, use 0.0.0.0/0 to allow all IPs.`);
        }
        throw new Error(`API request forbidden: ${errorDetails}. Please check that your API token in the .env file is correct.`);

      }
      if (response.status === 404) {
        throw new Error(`Player with tag "${playerTag}" not found. Please check the tag and try again.`);
      }
      
      throw new Error(`API request failed with status ${response.status}: ${errorDetails}`);
    }

    const player = await response.json();
    return player;

  } catch (error: any) {
    console.error(`Failed to fetch player data for tag ${playerTag}:`, error);
    // Re-throw a clean, user-facing error.
    throw new Error(error.message);
  }
}
