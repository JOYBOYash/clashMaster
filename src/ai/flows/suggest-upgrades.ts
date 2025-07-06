
'use server';

/**
 * @fileOverview An AI agent that suggests the best next upgrades for the user's base.
 *
 * - suggestUpgrades - A function that suggests the best next upgrades.
 * - SuggestUpgradesInput - The input type for the suggestUpgrades function.
 * - SuggestUpgradesOutput - The return type for the suggestUpgrades function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUpgradesInputSchema = z.object({
  base: z.enum(['home', 'builder']).describe('The base to suggest upgrades for (home or builder).'),
  townHallLevel: z.number().describe('The current level of the Town Hall.'),
  builderHallLevel: z.number().describe('The current level of the Builder Hall.'),
  buildingsUnderUpgrade: z.array(z.string()).describe('A list of buildings currently under upgrade.'),
  allBuildings: z.array(z.object({
    name: z.string().describe('The name of the building.'),
    level: z.number().describe('The current level of the building.'),
    maxLevel: z.number().describe('The absolute maximum level for this building in the game.'),
    type: z.string().describe('The type of the building like offensive, defensive, resource or other'),
  })).describe('A list of all buildings for the specified base and their current levels and upgrade costs, and types.'),
});

export type SuggestUpgradesInput = z.infer<typeof SuggestUpgradesInputSchema>;

const SuggestUpgradesOutputSchema = z.object({
  suggestedUpgrades: z.array(z.object({
    buildingName: z.string().describe('The name of the building to upgrade.'),
    reason: z.string().describe('The reason why this upgrade is suggested.'),
  })).max(3).describe('A list of exactly three suggested upgrades, with reasons.'),
});

export type SuggestUpgradesOutput = z.infer<typeof SuggestUpgradesOutputSchema>;

export async function suggestUpgrades(input: SuggestUpgradesInput): Promise<SuggestUpgradesOutput> {
  return suggestUpgradesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUpgradesPrompt',
  input: {schema: SuggestUpgradesInputSchema},
  output: {schema: SuggestUpgradesOutputSchema},
  prompt: `You are a world-class Clash of Clans data analyst. Your ONLY job is to analyze the provided list of buildings and suggest the top three most impactful upgrades.

**SOURCE OF TRUTH (Use ONLY this data for your analysis):**
- Player's Town Hall Level: {{{townHallLevel}}}
- Player's Buildings for the {{base}} base:
{{#each allBuildings}}
- {{{this.name}}}: Level {{{this.level}}}
{{/each}}
- Buildings currently being upgraded: {{#if buildingsUnderUpgrade}}{{#each buildingsUnderUpgrade}}{{{this}}}, {{/each}}{{else}}None{{/if}}

**CRITICAL RULES YOU MUST FOLLOW:**
1.  **NO INVALID UPGRADES:** You have expert knowledge of Town Hall level caps. For example, you know a Laboratory at Town Hall 12 cannot be upgraded past level 10. **NEVER suggest an upgrade for a building that is already at its maximum possible level for the player's Town Hall.** Check this for every building. A suggestion is invalid if the building's level is already max for the Town Hall.
2.  **NO GUESSING - USE DATA:** Your reasoning must be based on the specific building levels provided above. Do not say "you seem to focus on offense." Instead, say "I see your Cannons are level 12 but your Archer Towers are only level 10, suggesting a gap in your air defense."
3.  **EXACTLY THREE SUGGESTIONS:** You must provide exactly three unique and valid suggestions. Do not suggest anything that is listed as currently being upgraded.

Based on these strict rules and the data provided, generate your three upgrade suggestions.
`,
});

const suggestUpgradesFlow = ai.defineFlow(
  {
    name: 'suggestUpgradesFlow',
    inputSchema: SuggestUpgradesInputSchema,
    outputSchema: SuggestUpgradesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
