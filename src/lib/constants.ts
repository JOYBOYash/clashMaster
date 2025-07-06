
import type { z } from 'zod';
import { z as zod } from 'zod';

export const BuildingSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  type: zod.enum(['defensive', 'army', 'resource', 'other']),
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

export const TroopSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  village: zod.enum(['home', 'builderBase']),
  elixirType: zod.enum(['regular', 'dark', 'none']),
});
export type Troop = z.infer<typeof TroopSchema>;


export const ResourcesSchema = zod.object({
  gold: zod.number().min(0),
  elixir: zod.number().min(0),
  darkElixir: zod.number().min(0),
});

export type Resources = z.infer<typeof ResourcesSchema>;

export const VillageStateSchema = zod.object({
  townHallLevel: zod.number().min(1).max(16),
  builderHallLevel: zod.number().min(1).max(10),
  buildings: zod.array(BuildingSchema),
  troops: zod.array(TroopSchema),
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
  { name: 'Double Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Archer Tower', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Hidden Tesla', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Mega Tesla', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Giant Cannon', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Firecrackers', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Air Bombs', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Roaster', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Multi Mortar', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Crusher', maxLevel: 10, type: 'defensive', 'base': 'builder' },
  { name: 'Guard Post', maxLevel: 10, type: 'defensive', 'base': 'builder' },
  { name: 'Push Trap', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Gem Mine', maxLevel: 10, type: 'resource', base: 'builder' },
  { name: 'Clock Tower', maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Builder\'s Barracks', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Star Laboratory', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Battle Copter', maxLevel: 45, type: 'army', base: 'builder' },
  { name: 'Battle Machine', maxLevel: 45, type: 'army', base: 'builder' },
];

export const ALL_TROOPS_CONFIG = [
    // Home Village - Elixir
    { name: 'Barbarian', elixirType: 'regular' },
    { name: 'Archer', elixirType: 'regular' },
    { name: 'Goblin', elixirType: 'regular' },
    { name: 'Giant', elixirType: 'regular' },
    { name: 'Wall Breaker', elixirType: 'regular' },
    { name: 'Balloon', elixirType: 'regular' },
    { name: 'Wizard', elixirType: 'regular' },
    { name: 'Healer', elixirType: 'regular' },
    { name: 'Dragon', elixirType: 'regular' },
    { name: 'P.E.K.K.A', elixirType: 'regular' },
    { name: 'Baby Dragon', elixirType: 'regular' },
    { name: 'Miner', elixirType: 'regular' },
    { name: 'Electro Dragon', elixirType: 'regular' },
    { name: 'Yeti', elixirType: 'regular' },
    { name: 'Root Rider', elixirType: 'regular' },
    // Home Village - Dark Elixir
    { name: 'Minion', elixirType: 'dark' },
    { name: 'Hog Rider', elixirType: 'dark' },
    { name: 'Valkyrie', elixirType: 'dark' },
    { name: 'Golem', elixirType: 'dark' },
    { name: 'Witch', elixirType: 'dark' },
    { name: 'Lava Hound', elixirType: 'dark' },
    { name: 'Bowler', elixirType: 'dark' },
    { name: 'Ice Golem', elixirType: 'dark' },
    { name: 'Headhunter', elixirType: 'dark' },
    { name: 'Apprentice Warden', elixirType: 'dark' },
    // Builder Base
    { name: 'Raged Barbarian', elixirType: 'none' },
    { name: 'Sneaky Archer', elixirType: 'none' },
    { name: 'Boxer Giant', elixirType: 'none' },
    { name: 'Beta Minion', elixirType: 'none' },
    { name: 'Bomber', elixirType: 'none' },
    { name: 'Baby Dragon', elixirType: 'none' },
    { name: 'Cannon Cart', elixirType: 'none' },
    { name: 'Night Witch', elixirType: 'none' },
    { name: 'Drop Ship', elixirType: 'none' },
    { name: 'Power P.E.K.K.A', elixirType: 'none' },
    { name: 'Hog Glider', elixirType: 'none' },
    { name: 'Electrofire Wizard', elixirType: 'none' },
];


export const DEMO_VILLAGE_STATE: VillageState = {
  townHallLevel: 12,
  builderHallLevel: 9,
  buildings: [
    { id: 'TownHall-1', name: 'Town Hall', level: 12, maxLevel: 16, type: 'other', base: 'home', isUpgrading: false },
    { id: 'ClanCastle-1', name: 'Clan Castle', level: 8, maxLevel: 12, type: 'army', base: 'home', isUpgrading: false },
    { id: 'Laboratory-1', name: 'Laboratory', level: 10, maxLevel: 14, type: 'army', base: 'home', isUpgrading: false },
    { id: 'ArmyCamp-1', name: 'Army Camp', level: 10, maxLevel: 12, type: 'army', base: 'home', isUpgrading: false },
    { id: 'ArmyCamp-2', name: 'Army Camp', level: 10, maxLevel: 12, type: 'army', base: 'home', isUpgrading: false },
    { id: 'ArmyCamp-3', name: 'Army Camp', level: 10, maxLevel: 12, type: 'army', base: 'home', isUpgrading: false },
    { id: 'ArmyCamp-4', name: 'Army Camp', level: 9, maxLevel: 12, type: 'army', base: 'home', isUpgrading: true, upgradeEndTime: new Date(Date.now() + 86400000).toISOString() },
    { id: 'Cannon-1', name: 'Cannon', level: 16, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'Cannon-2', name: 'Cannon', level: 16, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'Cannon-3', name: 'Cannon', level: 15, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'ArcherTower-1', name: 'Archer Tower', level: 16, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'ArcherTower-2', name: 'Archer Tower', level: 15, maxLevel: 21, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'WizardTower-1', name: 'Wizard Tower', level: 11, maxLevel: 15, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'AirDefense-1', name: 'Air Defense', level: 10, maxLevel: 13, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'X-Bow-1', name: 'X-Bow', level: 6, maxLevel: 10, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'InfernoTower-1', name: 'Inferno Tower', level: 6, maxLevel: 9, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'EagleArtillery-1', name: 'Eagle Artillery', level: 3, maxLevel: 6, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'GoldStorage-1', name: 'Gold Storage', level: 13, maxLevel: 15, type: 'resource', base: 'home', isUpgrading: false },
    { id: 'ElixirStorage-1', name: 'Elixir Storage', level: 13, maxLevel: 15, type: 'resource', base: 'home', isUpgrading: false },
    // Builder Base
    { id: 'BuilderHall-1', name: 'Builder Hall', level: 9, maxLevel: 10, type: 'other', base: 'builder', isUpgrading: false },
    { id: 'Roaster-1', name: 'Roaster', level: 9, maxLevel: 10, type: 'defensive', base: 'builder', isUpgrading: false },
    { id: 'GiantCannon-1', name: 'Giant Cannon', level: 9, maxLevel: 10, type: 'defensive', base: 'builder', isUpgrading: false },
    { id: 'MultiMortar-1', name: 'Multi Mortar', level: 8, maxLevel: 10, type: 'defensive', base: 'builder', isUpgrading: false },
    { id: 'BattleMachine-1', name: 'Battle Machine', level: 30, maxLevel: 45, type: 'army', base: 'builder', isUpgrading: false },
    { id: 'StarLaboratory-1', name: 'Star Laboratory', level: 9, maxLevel: 10, type: 'army', base: 'builder', isUpgrading: false },
  ],
  troops: [
    { id: 'Barbarian-1', name: 'Barbarian', level: 8, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { id: 'Archer-1', name: 'Archer', level: 8, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { id: 'Dragon-1', name: 'Dragon', level: 7, maxLevel: 10, village: 'home', elixirType: 'regular' },
    { id: 'HogRider-1', name: 'Hog Rider', level: 8, maxLevel: 12, village: 'home', elixirType: 'dark' },
    { id: 'BoxerGiant-1', name: 'Boxer Giant', level: 18, maxLevel: 20, village: 'builderBase', elixirType: 'none' },
    { id: 'CannonCart-1', name: 'Cannon Cart', level: 18, maxLevel: 20, village: 'builderBase', elixirType: 'none' },
  ],
};

// This is no longer used for initial data but can be useful for type inference.
export const initialVillageState: VillageState = {
  townHallLevel: 1,
  builderHallLevel: 1,
  buildings: [],
  troops: [],
};
