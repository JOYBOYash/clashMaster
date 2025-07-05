
import type { z } from 'zod';
import { z as zod } from 'zod';

export const BuildingSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  type: zod.enum(['defensive', 'offensive', 'resource', 'army', 'other']),
  base: zod.enum(['home', 'builder']),
  isUpgrading: zod.boolean(),
  upgradeTime: zod.number().optional(), // in hours
  upgradeCost: zod.object({
    gold: zod.number().optional(),
    elixir: zod.number().optional(),
    darkElixir: zod.number().optional(),
  }).optional(),
  upgradeEndTime: zod.string().optional(), // ISO string
});

export type Building = z.infer<typeof BuildingSchema>;

export const ResourcesSchema = zod.object({
  gold: zod.number().min(0),
  elixir: zod.number().min(0),
  darkElixir: zod.number().min(0),
});

export type Resources = z.infer<typeof ResourcesSchema>;

export const VillageStateSchema = zod.object({
  townHallLevel: zod.number().min(1).max(16),
  builderHallLevel: zod.number().min(1).max(10),
  resources: ResourcesSchema,
  buildings: zod.array(BuildingSchema),
});

export type VillageState = z.infer<typeof VillageStateSchema>;

export const ALL_BUILDINGS_CONFIG = [
  // Home Village
  { name: 'Town Hall', maxLevel: 16, type: 'other', base: 'home' },
  { name: 'Clan Castle', maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Cannon', maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Archer Tower', maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Mortar', maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'Air Defense', maxLevel: 13, type: 'defensive', base: 'home' },
  { name: 'Wizard Tower', maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'Air Sweeper', maxLevel: 8, type: 'defensive', base: 'home' },
  { name: 'Hidden Tesla', maxLevel: 13, type: 'defensive', base: 'home' },
  { name: 'Bomb Tower', maxLevel: 10, type: 'defensive', base: 'home' },
  { name: 'X-Bow', maxLevel: 10, type: 'defensive', base: 'home' },
  { name: 'Inferno Tower', maxLevel: 9, type: 'defensive', base: 'home' },
  { name: 'Eagle Artillery', maxLevel: 6, type: 'defensive', base: 'home' },
  { name: 'Scattershot', maxLevel: 4, type: 'defensive', base: 'home' },
  { name: 'Spell Tower', maxLevel: 3, type: 'defensive', base: 'home' },
  { name: 'Monolith', maxLevel: 2, type: 'defensive', base: 'home' },
  { name: 'Gold Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Storage', maxLevel: 10, type: 'resource', base: 'home' },
  { name: 'Gold Mine', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Collector', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Drill', maxLevel: 9, type: 'resource', base: 'home' },
  { name: 'Barracks', maxLevel: 16, type: 'army', base: 'home' },
  { name: 'Dark Barracks', maxLevel: 10, type: 'army', base: 'home' },
  { name: 'Army Camp', maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Laboratory', maxLevel: 14, type: 'army', base: 'home' },
  { name: 'Spell Factory', maxLevel: 7, type: 'army', base: 'home' },
  { name: 'Dark Spell Factory', maxLevel: 6, type: 'army', base: 'home' },
  { name: 'Workshop', maxLevel: 7, type: 'army', base: 'home' },
  { name: 'Pet House', maxLevel: 9, type: 'army', base: 'home' },
  // Builder Base
  { name: 'Builder Hall', maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Cannon Cart', maxLevel: 20, type: 'offensive', base: 'builder' },
  { name: 'Double Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Archer Tower', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Hidden Tesla', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Mega Tesla', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Giant Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Firecrackers', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Air Bombs', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Roaster', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Multi Mortar', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Crusher', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Push Trap', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Gem Mine', maxLevel: 10, type: 'resource', base: 'builder' },
  { name: 'Clock Tower', maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Builder\'s Barracks', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Star Laboratory', maxLevel: 10, type: 'army', base: 'builder' },
];


// This is no longer used for initial data but can be useful for type inference.
export const initialVillageState: VillageState = {
  townHallLevel: 1,
  builderHallLevel: 1,
  resources: {
    gold: 0,
    elixir: 0,
    darkElixir: 0,
  },
  buildings: [],
};
