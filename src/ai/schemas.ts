
import { z } from 'genkit';
import type { VillageAnalysis } from '@/lib/village-analyzer';

export type SuggestUpgradesInput = VillageAnalysis;

export const UpgradeSuggestionSchema = z.object({
  title: z.string().describe("A short, clear title for the upgrade suggestion (e.g., 'Upgrade Air Defenses', 'Unlock Lava Hounds')."),
  description: z.string().describe("A concise explanation of why this upgrade is strategically important for the player's current Town Hall level."),
  priority: z.enum(['High', 'Medium', 'Low']).describe("The priority of the suggestion. 'High' for crucial offensive/defensive upgrades, 'Medium' for important but less critical ones, and 'Low' for long-term improvements."),
});
export type UpgradeSuggestion = z.infer<typeof UpgradeSuggestionSchema>;

export const SuggestUpgradesOutputSchema = z.object({
  suggestions: z.array(UpgradeSuggestionSchema).describe("An array of at least 5 strategic upgrade suggestions."),
});
export type SuggestUpgradesOutput = z.infer<typeof SuggestUpgradesOutputSchema>;
