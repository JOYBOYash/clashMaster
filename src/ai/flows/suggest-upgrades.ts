
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
  })).describe('A list of all buildings for the specified base and their current levels.'),
  allHeroes: z.array(z.object({
      name: z.string(),
      level: z.number(),
  })).optional().describe("A list of all the player's heroes and their levels."),
  allPets: z.array(z.object({
      name: z.string(),
      level: z.number(),
  })).optional().describe("A list of all the player's pets and their levels."),
    allEquipment: z.array(z.object({
      name: z.string(),
      level: z.number(),
  })).optional().describe("A list of all the player's hero equipment and their levels."),
});

export type SuggestUpgradesInput = z.infer<typeof SuggestUpgradesInputSchema>;

const SuggestUpgradesOutputSchema = z.object({
  suggestedUpgrades: z.array(z.object({
    buildingName: z.string().describe('The name of the building, hero, pet, or equipment to upgrade.'),
    reason: z.string().describe('The reason why this upgrade is suggested, personalized to the player.'),
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
  prompt: `You are a world-class Clash of Clans data analyst and strategist. Your ONLY job is to analyze the provided list of buildings, heroes, pets, and equipment to suggest the top three most impactful upgrades for the player's {{base}} base.

**SOURCE OF TRUTH (Use ONLY this data for your analysis):**
- Player's Town Hall Level: {{{townHallLevel}}}
{{#if builderHallLevel}}- Player's Builder Hall Level: {{{builderHallLevel}}}{{/if}}
- Player's Buildings for the {{base}} base:
{{#each allBuildings}}
- {{{this.name}}}: Level {{{this.level}}}
{{/each}}
{{#if allHeroes}}
- Player's Heroes:
{{#each allHeroes}}
- {{{this.name}}}: Level {{{this.level}}}
{{/each}}
{{/if}}
{{#if allPets}}
- Player's Pets:
{{#each allPets}}
- {{{this.name}}}: Level {{{this.level}}}
{{/each}}
{{/if}}
{{#if allEquipment}}
- Player's Hero Equipment:
{{#each allEquipment}}
- {{{this.name}}}: Level {{{this.level}}}
{{/each}}
{{/if}}
- Buildings currently being upgraded: {{#if buildingsUnderUpgrade}}{{#each buildingsUnderUpgrade}}{{{this}}}, {{/each}}{{else}}None{{/if}}

**CRITICAL RULES YOU MUST FOLLOW:**
1.  **KNOW THE GAME LOGIC:** You have expert knowledge of Town Hall level caps for all buildings, heroes, and pets. You know the Blacksmith building is required to upgrade Hero Equipment. You know the Pet House is required to upgrade Pets.
2.  **NO INVALID UPGRADES:** NEVER suggest an upgrade for a building, hero, or pet that is already at its maximum possible level for the player's Town Hall. Check this for every single item. A suggestion is invalid if the item's level is already max for the Town Hall. For equipment, if the Blacksmith is not at its max level for the Town Hall, suggest upgrading the Blacksmith first. For pets, if the Pet House is not maxed, suggest upgrading the Pet House.
3.  **NO GUESSING - USE DATA & BE SPECIFIC:** Your reasoning must be based on the specific levels provided. Do not use vague terms like "rushed". Instead, say things like "I see your Cannons are level 12 but your Archer Towers are only level 10, suggesting a gap in your point defenses." or "Your Barbarian King is 10 levels behind your Archer Queen; upgrading him will balance your hero power."
4.  **EXACTLY THREE SUGGESTIONS:** You must provide exactly three unique and valid suggestions. Do not suggest anything that is listed as currently being upgraded. Your suggestions can be buildings, heroes, pets, or equipment.

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

    