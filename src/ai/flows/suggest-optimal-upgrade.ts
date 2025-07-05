
'use server';

/**
 * @fileOverview An AI agent that suggests the best next upgrades for the user's base, considering
 * resource costs, upgrade times, and their impact on the village's progress.
 * 
 * - suggestOptimalUpgrade - A function that suggests the best next upgrades.
 * - SuggestOptimalUpgradeInput - The input type for the suggestOptimalUpgrade function.
 * - SuggestOptimalUpgradeOutput - The return type for the suggestOptimalUpgrade function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalUpgradeInputSchema = z.object({
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
  })).describe('A list of all buildings and their current levels and upgrade costs, and types.'),
});

export type SuggestOptimalUpgradeInput = z.infer<typeof SuggestOptimalUpgradeInputSchema>;

const SuggestOptimalUpgradeOutputSchema = z.object({
  suggestedUpgrades: z.array(z.object({
    buildingName: z.string().describe('The name of the building to upgrade.'),
    reason: z.string().describe('The reason why this upgrade is suggested.'),
  })).describe('A list of suggested upgrades, with reasons.'),
});

export type SuggestOptimalUpgradeOutput = z.infer<typeof SuggestOptimalUpgradeOutputSchema>;

export async function suggestOptimalUpgrade(input: SuggestOptimalUpgradeInput): Promise<SuggestOptimalUpgradeOutput> {
  return suggestOptimalUpgradeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalUpgradePrompt',
  input: {schema: SuggestOptimalUpgradeInputSchema},
  output: {schema: SuggestOptimalUpgradeOutputSchema},
  prompt: `You are an expert Clash of Clans strategist. Given the current state of the base,
you will suggest the best next upgrades to optimize progress. Consider resource availability,
and the impact of the upgrade on the base\'s overall strength. Do not suggest
upgrades for buildings that are already under upgrade.

Town Hall Level: {{{townHallLevel}}}
Builder Hall Level: {{{builderHallLevel}}}
Available Resources: Gold: {{{availableResources.gold}}}, Elixir: {{{availableResources.elixir}}}, Dark Elixir: {{{availableResources.darkElixir}}}
Buildings Under Upgrade: {{#each buildingsUnderUpgrade}}{{{this}}}, {{/each}}

All Buildings: {{#each allBuildings}}Name: {{{this.name}}}, Level: {{{this.level}}}, Type: {{{this.type}}}. {{/each}}
Base your suggestions on general game knowledge for upgrade priorities, as specific costs and times may not be provided.

Suggest the best next upgrades:
`,
});

const suggestOptimalUpgradeFlow = ai.defineFlow(
  {
    name: 'suggestOptimalUpgradeFlow',
    inputSchema: SuggestOptimalUpgradeInputSchema,
    outputSchema: SuggestOptimalUpgradeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
