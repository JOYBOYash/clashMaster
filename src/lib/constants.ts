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
  { name: 'Cannon', maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Archer Tower', maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Mortar', maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'Air Defense', maxLevel: 13, type: 'defensive', base: 'home' },
  { name: 'Wizard Tower', maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'X-Bow', maxLevel: 10, type: 'defensive', base: 'home' },
  { name: 'Inferno Tower', maxLevel: 9, type: 'defensive', base: 'home' },
  { name: 'Eagle Artillery', maxLevel: 6, type: 'defensive', base: 'home' },
  { name: 'Gold Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Storage', maxLevel: 10, type: 'resource', base: 'home' },
  { name: 'Barracks', maxLevel: 16, type: 'army', base: 'home' },
  { name: 'Army Camp', maxLevel: 12, type: 'army', base: 'home' },
  // Builder Base
  { name: 'Builder Hall', maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Cannon Cart', maxLevel: 20, type: 'offensive', base: 'builder' },
  { name: 'Double Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Mega Tesla', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Giant Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
];


export const initialVillageState: VillageState = {
  townHallLevel: 12,
  builderHallLevel: 9,
  resources: {
    gold: 5000000,
    elixir: 6000000,
    darkElixir: 100000,
  },
  buildings: [
    { id: 'th', name: 'Town Hall', level: 12, maxLevel: 16, type: 'other', base: 'home', isUpgrading: false, upgradeCost: { gold: 12000000 }, upgradeTime: 288 },
    { id: 'bh', name: 'Builder Hall', level: 9, maxLevel: 10, type: 'other', base: 'builder', isUpgrading: false, upgradeCost: { gold: 4800000 }, upgradeTime: 192 },
    { id: 'cannon1', name: 'Cannon', level: 15, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: true, upgradeTime: 120, upgradeCost: { gold: 7500000 }, upgradeEndTime: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString() },
    { id: 'archer1', name: 'Archer Tower', level: 15, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false, upgradeTime: 144, upgradeCost: { gold: 8000000 } },
    { id: 'gs1', name: 'Gold Storage', level: 13, maxLevel: 15, type: 'resource', base: 'home', isUpgrading: false, upgradeTime: 96, upgradeCost: { elixir: 2000000 } },
    { id: 'es1', name: 'Elixir Storage', level: 13, maxLevel: 15, type: 'resource', base: 'home', isUpgrading: false, upgradeTime: 96, upgradeCost: { gold: 2000000 } },
    { id: 'dc1', name: 'Double Cannon', level: 8, maxLevel: 10, type: 'defensive', base: 'builder', isUpgrading: true, upgradeTime: 72, upgradeCost: { gold: 3000000 }, upgradeEndTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() },
  ],
};
