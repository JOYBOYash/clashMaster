
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
  quantity: z.number().optional().describe('The number of this unit, for troops or spells.'),
});

const SuggestWarArmyInputSchema = z.object({
  townHallLevel: z.number().describe("The player's Town Hall level."),
  troops: z.array(ArmyUnitSchema).describe('An array of troops in the player\'s army.'),
  heroes: z.array(ArmyUnitSchema).describe('An array of heroes and their levels.'),
  spells: z.array(ArmyUnitSchema).describe('An array of spells in the player\'s army.'),
  siegeMachine: z.string().optional().describe('The selected siege machine, if any.'),
});
export type SuggestWarArmyInput = z.infer<typeof SuggestWarArmyInputSchema>;


const StrategyStepSchema = z.object({
    title: z.string().describe("A short, descriptive title for this specific action (e.g., 'Create Funnel Left', 'Deploy Wall Wrecker', 'First Rage Spell')."),
    description: z.string().describe('A concise explanation of what to do in this step, including placement and timing.'),
    unitName: z.string().optional().describe("The name of the primary troop, hero, or spell used in this step (e.g., 'Barbarian King', 'Dragon', 'Rage Spell'). If it's a general instruction, use 'General'.")
});

const StrategyPhaseSchema = z.object({
    phaseName: z.string().describe("The name of the attack phase (e.g., 'Scouting', 'Funneling', 'Main Attack', 'Spell Deployment', 'Cleanup')."),
    steps: z.array(StrategyStepSchema).describe("An array of detailed steps within this phase.")
});

const SuggestWarArmyOutputSchema = z.object({
  armyName: z.string().describe('A creative and recognizable name for this army composition (e.g., "Queen Charge LavaLoon", "GoWiPe").'),
  strategySummary: z.string().describe('A brief, one or two-sentence summary of the overall strategy, its main goal, and the type of bases it is effective against.'),
  phases: z.array(StrategyPhaseSchema).describe("A structured breakdown of the attack into logical phases. The standard phases should be: Scouting, Funneling, Main Attack, and Spell & Ability Usage."),
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
  prompt: `You are an expert Clash of Clans strategist. A user has provided their army composition and Town Hall level. Your task is to provide a detailed, structured attack strategy.

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
  - Siege Machine: {{#if siegeMachine}}{{siegeMachine}}{{else}}None{{/if}}

  Based on this army, provide a complete, structured attack plan. The plan must be broken down into distinct phases: 'Scouting & Planning', 'Funneling', 'Main Attack Deployment', and 'Spells & Abilities'.

  For each phase, provide a series of clear, actionable steps. Each step should have a title, a description, and the name of the primary unit involved.

  Example Step:
  - title: "King Funnel Left"
  - description: "Deploy the Barbarian King on the left corner to clear outside buildings and create a path to the core."
  - unitName: "Barbarian King"

  Example Step 2:
  - title: "Rage on Core"
  - description: "As the main group approaches the Town Hall, drop a Rage Spell to cover them and the nearby Inferno Towers."
  - unitName: "Rage Spell"

  Be specific about timing and placement. The goal is to provide a guide that a player can follow during an attack.
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
