
/**
 * @fileOverview Client-side helper for fetching data from the Clash of Clans API.
 */

const apiToken = process.env.NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN;

// Note: This function is intended to be called from the client-side.
// The Clash of Clans API doesn't support CORS, so this call will be proxied
// by Next.js in a development environment. For production, you'd need a proper proxy.
export async function getPlayer(playerTag: string): Promise<any> {
    if (!apiToken || apiToken === 'YOUR_TOKEN_HERE') {
        throw new Error('The NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN is not configured in your .env file.');
    }

    // The official API requires the tag to be encoded
    const encodedPlayerTag = encodeURIComponent(playerTag);

    // We use a community-run CORS proxy to bypass API limitations in the browser.
    // This is suitable for development but you may want a dedicated proxy for production.
    const proxyUrl = 'https://proxy.clashofclans.com/v1';
    const url = `${proxyUrl}/players/${encodedPlayerTag}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            if (response.status === 403) {
                 throw new Error('Could not connect to the Clash of Clans API. Please check your API token and ensure your current IP is whitelisted in your developer account.');
            }
            if (response.status === 404) {
                throw new Error(`Player with tag ${playerTag} not found.`);
            }
            console.error("Error fetching player data:", errorBody);
            throw new Error(`API returned status ${response.status}: ${errorBody.reason || 'Unknown error'}`);
        }

        const player = await response.json();
        return player;
    } catch (error: any) {
        console.error("Full error details:", error);
        // Re-throw a clean error to be caught by the client-side component
        throw new Error(error.message || 'An unexpected error occurred while fetching player data.');
    }
}
