
'use server';

/**
 * @fileOverview An AI agent that suggests an army composition for Clash of Clans.
 * 
 * - suggestArmy - A function that suggests a powerful army.
 * - SuggestArmyInput - The input type for the suggestArmy function.
 * - SuggestArmyOutput - The return type for the suggestArmy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestArmyInputSchema = z.object({
  townHallLevel: z.number().describe('The current level of the Town Hall.'),
  troops: z.array(z.object({
    name: z.string().describe('The name of the troop.'),
    level: z.number().describe('The current level of the troop.'),
  })).describe('A list of all available troops and their levels.'),
});
export type SuggestArmyInput = z.infer<typeof SuggestArmyInputSchema>;

const SuggestArmyOutputSchema = z.object({
    armyName: z.string().describe("The common name for this army composition (e.g., 'Queen Charge Hybrid', 'Zap Titans')."),
    description: z.string().describe('A brief description of how to use this army and why it is effective.'),
    units: z.array(z.object({
        name: z.string().describe('The name of the troop or spell.'),
        count: z.number().describe('The number of this unit to include in the army.'),
    })).describe('The list of units that make up the army composition.'),
});
export type SuggestArmyOutput = z.infer<typeof SuggestArmyOutputSchema>;

export async function suggestArmy(input: SuggestArmyInput): Promise<SuggestArmyOutput> {
  return suggestArmyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestArmyPrompt',
  input: {schema: SuggestArmyInputSchema},
  output: {schema: SuggestArmyOutputSchema},
  prompt: `You are an expert Clash of Clans strategist specializing in army compositions. 
Given the user's Town Hall level and their available troops with levels, suggest one powerful and effective army composition.
The army can be for general use, farming, or war. Prioritize strategies that are strong for the given Town Hall level.

Town Hall Level: {{{townHallLevel}}}

Available Troops:
{{#each troops}}
- {{{this.name}}} (Level {{{this.level}}})
{{/each}}

Based on this information, provide a single, potent army composition.
Explain briefly why you chose it and what its main strategy is.
List the required troops, spells, and siege machines with their counts.
`,
});

const suggestArmyFlow = ai.defineFlow(
  {
    name: 'suggestArmyFlow',
    inputSchema: SuggestArmyInputSchema,
    outputSchema: SuggestArmyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
