
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
  prompt: `You are an expert Clash of Clans strategist with deep knowledge of upgrade paths and priorities for every Town Hall level. Your task is to provide exactly three highly personalized upgrade suggestions for the player's {{base}} base.

Player's State:
- Town Hall Level: {{{townHallLevel}}}
- Builder Hall Level: {{{builderHallLevel}}}
- Available Buildings for {{base}} base: {{#each allBuildings}}Name: {{{this.name}}}, Current Level: {{{this.level}}}, Max Possible Level in Game: {{{this.maxLevel}}}, Type: {{{this.type}}}. {{/each}}
- Buildings currently upgrading: {{#if buildingsUnderUpgrade}}{{#each buildingsUnderUpgrade}}{{{this}}}, {{/each}}{{else}}None{{/if}}

**CRITICAL INSTRUCTIONS:**
1.  **Town Hall Limits are KEY:** You MUST use your expert knowledge of the game to determine if a building can actually be upgraded at the player's current Town Hall level. The 'Max Possible Level in Game' is the absolute maximum and often irrelevant. For example, you know a Laboratory cannot be upgraded past level 10 at Town Hall 12. **NEVER suggest an upgrade for a building that is already maxed out for the player's Town Hall level.**
2.  **Infer Playstyle:** Analyze the relative levels of the player's buildings. Does this player neglect 'defensive' structures while maxing 'army' buildings? Do they focus on one type of resource collector? This is their playstyle.
3.  **Personalize Your Reasons:** For each of your three suggestions, provide a compelling reason that directly references your playstyle analysis. Don't just say "it's a good upgrade." Say "Since you've focused heavily on your air troops, upgrading your Air Defenses is crucial to protect against the mirror attacks you likely face in war."
4.  **Select Top 3:** Based on your analysis, select the top three most strategic upgrades. Do not suggest buildings that are already upgrading. Provide exactly three suggestions.
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
