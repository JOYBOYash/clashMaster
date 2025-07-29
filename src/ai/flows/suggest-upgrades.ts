
'use server';
/**
 * @fileOverview An AI flow for suggesting Clash of Clans village upgrades.
 * 
 * - suggestUpgrades - A function that provides upgrade advice based on village data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { VillageAnalysis } from '@/lib/village-analyzer';
import { SuggestUpgradesOutputSchema, type SuggestUpgradesOutput, type SuggestUpgradesInput } from '@/ai/schemas';

export async function suggestUpgrades(input: SuggestUpgradesInput): Promise<SuggestUpgradesOutput> {
  return suggestUpgradesFlow(input);
}

const formatObject = (obj: Record<string, any>) => {
    return Object.entries(obj).map(([key, value]) => `- ${key}: Level ${Array.isArray(value) ? value.join('/') : value}`).join('\n');
}

const prompt = ai.definePrompt({
  name: 'suggestUpgradesPrompt',
  input: { schema: z.any() }, // Using any because the input is complex
  output: { schema: SuggestUpgradesOutputSchema },
  prompt: `
You are an expert Clash of Clans strategist. Your task is to analyze a player's village and provide 5 strategic upgrade suggestions tailored to their current progress.

Analyze the following village data:
Player Town Hall Level: {{player.townHallLevel}}

Current Building Levels:
{{buildingsFormatted}}

Current Hero Levels:
{{heroesFormatted}}

Current Troop Levels:
{{unitsFormatted}}

Current Spell Levels:
{{spellsFormatted}}

Based on this data, provide a list of 5 prioritized upgrade suggestions. Focus on what will provide the most value for their Town Hall level. Consider both offensive and defensive strengths. Explain the reasoning for each suggestion.

Priorities should be:
- High: Critical for offense or defense at this TH level.
- Medium: Strong, important upgrades.
- Low: Good to have, but not as urgent.

Example Output Suggestion:
- title: "Upgrade Cannons"
- description: "Your cannons are behind for TH13. Upgrading them is crucial for defending against ground attacks like Hybrid and Pekka Smash, which are common at this level."
- priority: "High"
  `,
});

const suggestUpgradesFlow = ai.defineFlow(
  {
    name: 'suggestUpgradesFlow',
    inputSchema: z.any(),
    outputSchema: SuggestUpgradesOutputSchema,
  },
  async (input: VillageAnalysis) => {
    
    // Format the complex objects into readable strings for the prompt
    const promptInput = {
        ...input,
        buildingsFormatted: formatObject(input.buildings),
        heroesFormatted: formatObject(input.heroes),
        unitsFormatted: formatObject(input.units),
        spellsFormatted: formatObject(input.spells)
    };
    
    const { output } = await prompt(promptInput);
    if (!output) {
      throw new Error("The AI failed to provide suggestions.");
    }
    return output;
  }
);
