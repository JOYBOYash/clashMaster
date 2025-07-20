
/**
 * @fileOverview Client-side function to fetch Clash of Clans player data via a server proxy.
 */

export async function getPlayer(playerTag: string) {
  // The player tag from the game includes a '#', which needs to be handled carefully in URLs.
  // We will pass the raw tag to our proxy and let the server handle the final encoding.
  // Example: #GU82PJVGJ becomes players/%23GU82PJVGJ on the server-side.
  const pathSegment = `players/${playerTag}`;
  
  // NOTE: The /api/coc-proxy path here is a special Next.js convention.
  // We are proxying the request through our own Next.js server to avoid CORS issues
  // and to hide the API token from the client's network requests.
  const url = `/api/coc-proxy/${pathSegment}`;
  
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

      if (response.status === 403) {
        throw new Error(`API request forbidden: ${errorDetails}. Please check your API token and ensure your server's IP address is whitelisted in your Clash of Clans developer account. For cloud environments, you may need to whitelist '0.0.0.0/0'.`);
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
    throw new Error(`Failed to fetch player data. Please verify the player tag and check your API credentials. Original error: ${error.message}`);
  }
}
