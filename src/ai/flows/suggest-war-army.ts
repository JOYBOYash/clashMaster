
'use server';
/**
 * @fileOverview An AI flow for generating Clash of Clans attack strategies.
 *
 * - suggestWarArmy - A function that provides attack advice based on a user's army.
 * - SuggestWarArmyInput - The input type for the suggestWarArmy function.
 * - SuggestWarArmyOutput - The return type for the suggestWarArmy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ArmyUnitSchema = z.object({
  name: z.string().describe('The name of the troop, hero, or spell.'),
  level: z.number().describe('The level of the unit.'),
  quantity: z.number().optional().describe('The number of this unit, for troops.'),
});

const SuggestWarArmyInputSchema = z.object({
  townHallLevel: z.number().describe('The player\'s Town Hall level.'),
  troops: z.array(ArmyUnitSchema).describe('An array of troops in the player\'s army.'),
  heroes: z.array(ArmyUnitSchema).describe('An array of heroes and their levels.'),
  spells: z.array(ArmyUnitSchema).describe('An array of spells in the player\'s army.'),
  siegeMachine: z.string().optional().describe('The selected siege machine, if any.'),
});
export type SuggestWarArmyInput = z.infer<typeof SuggestWarArmyInputSchema>;

const SuggestWarArmyOutputSchema = z.object({
  armyName: z.string().describe('A creative and recognizable name for this army composition (e.g., "Queen Charge LavaLoon", "GoWiPe").'),
  strategy: z.string().describe('A detailed, step-by-step guide on how to execute the attack with the given army.'),
  strengths: z.string().describe('The key strengths of this army composition and the types of bases it is effective against.'),
  weaknesses: z.string().describe('The potential weaknesses of this army and what to watch out for during an attack.'),
});
export type SuggestWarArmyOutput = z.infer<typeof SuggestWarArmyOutputSchema>;

export async function suggestWarArmy(input: SuggestWarArmyInput): Promise<SuggestWarArmyOutput> {
  return suggestWarArmyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestWarArmyPrompt',
  input: { schema: SuggestWarArmyInputSchema },
  output: { schema: SuggestWarArmyOutputSchema },
  prompt: `You are an expert Clash of Clans strategist. A user has provided their army composition and Town Hall level. Your task is to provide a detailed attack strategy.

  Player's Town Hall Level: {{townHallLevel}}

  Army Composition:
  - Heroes:
  {{#each heroes}}
    - {{name}} (Level {{level}})
  {{/each}}
  - Troops:
  {{#each troops}}
    - {{quantity}}x {{name}} (Level {{level}})
  {{/each}}
  - Spells:
  {{#each spells}}
    - {{quantity}}x {{name}} (Level {{level}})
  {{/each}}
  - Siege Machine: {{siegeMachine}}

  Based on this army, provide a detailed attack plan. Consider the most common base layouts for the given Town Hall level. The strategy should include:
  1.  **Funneling**: How to create a proper funnel for the main attack force.
  2.  **Deployment Order**: The sequence in which to deploy heroes, troops, and the siege machine.
  3.  **Spell Placement**: When and where to use the spells for maximum impact.
  4.  **Key Objectives**: What the primary targets for this army should be (e.g., Eagle Artillery, Inferno Towers, Town Hall).

  Also, provide a creative name for the army, its key strengths, and its potential weaknesses.
  `,
});

const suggestWarArmyFlow = ai.defineFlow(
  {
    name: 'suggestWarArmyFlow',
    inputSchema: SuggestWarArmyInputSchema,
    outputSchema: SuggestWarArmyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
