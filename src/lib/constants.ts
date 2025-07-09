import type { z } from 'zod';
import { z as zod } from 'zod';

export const BuildingSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  type: zod.enum(['defensive', 'army', 'resource', 'other', 'hero', 'trap']),
  base: zod.enum(['home', 'builder']),
  isUpgrading: zod.boolean().default(false),
  upgradeTime: zod.number().optional(), 
  upgradeCost: zod.object({
    gold: zod.number().optional(),
    elixir: zod.number().optional(),
    darkElixir: zod.number().optional(),
  }).optional(),
  upgradeEndTime: zod.string().optional(),
});

export type Building = z.infer<typeof BuildingSchema>;

export const TroopSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  village: zod.enum(['home', 'builder']),
  elixirType: zod.enum(['regular', 'dark', 'none']),
});
export type Troop = z.infer<typeof TroopSchema>;

export const HeroSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  village: zod.enum(['home', 'builder']),
});
export type Hero = z.infer<typeof HeroSchema>;

export const PetSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
});
export type Pet = z.infer<typeof PetSchema>;

export const EquipmentSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

export const VillageStateSchema = zod.object({
  townHallLevel: zod.number().min(1).max(17),
  builderHallLevel: zod.number().min(1).max(10),
  buildings: zod.array(BuildingSchema),
  troops: zod.array(TroopSchema),
  heroes: zod.array(HeroSchema),
  pets: zod.array(PetSchema),
  equipment: zod.array(EquipmentSchema),
});

export type VillageState = z.infer<typeof VillageStateSchema>;

export const buildingNameToType: Record<string, Building['type']> = {
    'Cannon': 'defensive',
    'Archer Tower': 'defensive',
    'Mortar': 'defensive',
    'Air Defense': 'defensive',
    'Wizard Tower': 'defensive',
    'Air Sweeper': 'defensive',
    'Hidden Tesla': 'defensive',
    'Bomb Tower': 'defensive',
    'X-Bow': 'defensive',
    'Inferno Tower': 'defensive',
    'Eagle Artillery': 'defensive',
    'Scattershot': 'defensive',
    'Spell Tower': 'defensive',
    'Monolith': 'defensive',
    'Town Hall': 'other',
    'Wall': 'other',
    'Builder\'s Hut': 'other',
    'Clan Castle': 'army',
    'Blacksmith': 'army',
    'Pet House': 'army',
    'Gold Mine': 'resource',
    'Elixir Collector': 'resource',
    'Dark Elixir Drill': 'resource',
    'Gold Storage': 'resource',
    'Elixir Storage': 'resource',
    'Dark Elixir Storage': 'resource',
    'Barracks': 'army',
    'Dark Barracks': 'army',
    'Army Camp': 'army',
    'Laboratory': 'army',
    'Spell Factory': 'army',
    'Dark Spell Factory': 'army',
    'Workshop': 'army',
    'Barbarian King Altar': 'hero',
    'Archer Queen Altar': 'hero',
    'Grand Warden Altar': 'hero',
    'Royal Champion Altar': 'hero',
    'Bomb': 'trap',
    'Spring Trap': 'trap',
    'Air Bomb': 'trap',
    'Giant Bomb': 'trap',
    'Seeking Air Mine': 'trap',
    'Skeleton Trap': 'trap',
    'Tornado Trap': 'trap'
};
