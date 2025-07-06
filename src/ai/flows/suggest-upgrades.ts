
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
  availableResources: z.object({
    gold: z.number().describe('The amount of gold available.'),
    elixir: z.number().describe('The amount of elixir available.'),
    darkElixir: z.number().describe('The amount of dark elixir available.'),
  }).describe('The available resources in the village.'),
  buildingsUnderUpgrade: z.array(z.string()).describe('A list of buildings currently under upgrade.'),
  allBuildings: z.array(z.object({
    name: z.string().describe('The name of the building.'),
    level: z.number().describe('The current level of the building.'),
    upgradeCost: z.object({
      gold: z.number().optional().describe('The gold cost to upgrade, if applicable.'),
      elixir: z.number().optional().describe('The elixir cost to upgrade, if applicable.'),
      darkElixir: z.number().optional().describe('The dark elixir cost to upgrade, if applicable.'),
    }).optional().describe('The cost to upgrade the building to the next level.'),
    upgradeTime: z.number().optional().describe('The time in hours to upgrade the building to the next level.'),
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
  prompt: `You are an expert Clash of Clans strategist. Your task is to provide exactly three highly personalized upgrade suggestions for the player's {{base}} base.

Player's State:
- Town Hall Level: {{{townHallLevel}}}
- Builder Hall Level: {{{builderHallLevel}}}
- Available Buildings for {{base}} base: {{#each allBuildings}}Name: {{{this.name}}}, Level: {{{this.level}}}, Type: {{{this.type}}}. {{/each}}
- Buildings currently upgrading: {{#if buildingsUnderUpgrade}}{{#each buildingsUnderUpgrade}}{{{this}}}, {{/each}}{{else}}None{{/if}}

Your analysis process:
1.  **Infer Playstyle:** Analyze the relative levels of the player's buildings. Do they prioritize 'defensive' structures, 'army' buildings for offense, or 'resource' collectors? Note which types are high-level and which are neglected.
2.  **Identify Priorities:** Based on their playstyle and general game knowledge (e.g., offense is key for progression), identify the most impactful upgrades.
3.  **Select Top 3:** From your analysis, select the top three most strategic upgrades. Do not suggest buildings that are already upgrading or maxed out.
4.  **Provide Reasons:** For each suggestion, provide a concise, compelling reason that explains *why* it's a smart move for *this specific player*.

Provide exactly three suggestions in your response.
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
