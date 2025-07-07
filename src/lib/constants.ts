
import type { z } from 'zod';
import { z as zod } from 'zod';
import { gameData } from './game-data';

export const BuildingSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  type: zod.enum(['defensive', 'army', 'resource', 'other', 'hero', 'trap']),
  base: zod.enum(['home', 'builder']),
  isUpgrading: zod.boolean().default(false),
  upgradeTime: zod.number().optional(), // in hours
  upgradeCost: zod.object({
    gold: zod.number().optional(),
    elixir: zod.number().optional(),
    darkElixir: zod.number().optional(),
  }).optional(),
  upgradeEndTime: zod.string().optional(), // ISO string
});

export type Building = z.infer<typeof BuildingSchema>;

export interface BuildingConfig {
  name: string;
  gameId: number;
  type: Building['type'];
  base: Building['base'];
  getMaxLevel: (thLevel: number) => number;
}

export const TroopSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  village: zod.enum(['home', 'builder']),
  elixirType: zod.enum(['regular', 'dark', 'none']),
});
export type Troop = z.infer<typeof TroopSchema>;

export interface TroopConfig {
    name: string;
    gameId: number;
    village: Troop['village'];
    elixirType: Troop['elixirType'];
    getMaxLevel: (thLevel: number) => number;
}

export const HeroSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  village: zod.enum(['home', 'builder']),
});
export type Hero = z.infer<typeof HeroSchema>;

export interface HeroConfig {
    name: string;
    gameId: number;
    village: Hero['village'];
    getMaxLevel: (thLevel: number) => number;
}


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

export interface EquipmentConfig {
    name: string;
    gameId: number;
    maxLevel: number;
}


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

// This is a simplified lookup. A more robust solution would map all game IDs.
// For now, this covers the most common buildings from the user's JSON.
const buildingNameMap: Record<string, Building['type']> = {
  'Cannon': 'defensive', 'Archer Tower': 'defensive', 'Mortar': 'defensive', 'Air Defense': 'defensive',
  'Wizard Tower': 'defensive', 'Air Sweeper': 'defensive', 'Hidden Tesla': 'defensive', 'Bomb Tower': 'defensive',
  'X-Bow': 'defensive', 'Inferno Tower': 'defensive', 'Eagle Artillery': 'defensive', 'Scattershot': 'defensive',
  'Spell Tower': 'defensive', 'Monolith': 'defensive', 'Town Hall': 'other', 'Clan Castle': 'army',
  'Blacksmith': 'army', 'Pet House': 'army', 'Gold Mine': 'resource', 'Elixir Collector': 'resource',
  'Dark Elixir Drill': 'resource', 'Gold Storage': 'resource', 'Elixir Storage': 'resource',
  'Dark Elixir Storage': 'resource', 'Barracks': 'army', 'Dark Barracks': 'army', 'Army Camp': 'army',
  'Laboratory': 'army', 'Spell Factory': 'army', 'Dark Spell Factory': 'army', 'Workshop': 'army',
  'Barbarian King Altar': 'hero', 'Archer Queen Altar': 'hero', 'Grand Warden Altar': 'hero', 'Royal Champion Altar': 'hero',
  // Traps
  'Bomb': 'trap', 'Spring Trap': 'trap', 'Air Bomb': 'trap', 'Giant Bomb': 'trap', 'Seeking Air Mine': 'trap',
  'Skeleton Trap': 'trap', 'Tornado Trap': 'trap',
  // Builder Base
  'Builder Hall': 'other', 'Double Cannon': 'defensive', 'Mega Tesla': 'defensive', 'Giant Cannon': 'defensive',
  'Firecrackers': 'defensive', 'Air Bombs': 'defensive', 'Roaster': 'defensive', 'Multi Mortar': 'defensive',
  'Crusher': 'defensive', 'Guard Post': 'defensive', 'Gem Mine': 'resource', 'Clock Tower': 'other',
  'Builder\'s Barracks': 'army', 'Star Laboratory': 'army', 'Reinforcement Camp': 'army', 'Healing Hut': 'army',
  'O.T.T.O Post': 'other', 'Battle Copter Post': 'hero', 'Battle Machine Post': 'hero',
  'Push Trap': 'trap', 'Mine': 'trap', 'Mega Mine': 'trap',
};

const snakeToTitle = (snake: string) => snake.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

// Generate configs from the new game data
const allThLevels = Object.keys(gameData.clash_of_clans_data.town_halls);
const lastThKey = allThLevels[allThLevels.length - 1] as keyof typeof gameData.clash_of_clans_data.town_halls;
const maxLevelData = gameData.clash_of_clans_data.town_halls[lastThKey];

// This is still a challenge: mapping dynamic names to static game IDs from the export.
// We'll have to maintain a static list of game IDs and map them to the names from your new JSON.
// This is a *manual* mapping created by comparing your new JSON keys with the game IDs from the old file.
// THIS IS THE CRITICAL MAPPING that was missing before.
export const STATIC_GAME_ID_CONFIG = [
  // Home Village - General
  { name: 'Town Hall', gameId: 1000001, base: 'home' },
  { name: 'Clan Castle', gameId: 1000000, base: 'home' },
  { name: 'Blacksmith', gameId: 1000071, base: 'home' },
  { name: 'Pet House', gameId: 1000070, base: 'home' },
  // Home Village - Defenses
  { name: 'Cannon', gameId: 1000008, base: 'home' },
  { name: 'Archer Tower', gameId: 1000009, base: 'home' },
  { name: 'Mortar', gameId: 1000013, base: 'home' },
  { name: 'Air Defense', gameId: 1000012, base: 'home' },
  { name: 'Wizard Tower', gameId: 1000019, base: 'home' },
  { name: 'Air Sweeper', gameId: 1000028, base: 'home' },
  { name: 'Hidden Tesla', gameId: 1000021, base: 'home' },
  { name: 'Bomb Tower', gameId: 1000029, base: 'home' },
  { name: 'X-Bow', gameId: 1000027, base: 'home' },
  { name: 'Inferno Tower', gameId: 1000032, base: 'home' },
  { name: 'Eagle Artillery', gameId: 1000059, base: 'home' },
  { name: 'Scattershot', gameId: 1000068, base: 'home' },
  { name: 'Spell Tower', gameId: 1000075, base: 'home' },
  { name: 'Monolith', gameId: 1000076, base: 'home' },
  // Home Village - Traps
  { name: 'Bomb', gameId: 12000000, base: 'home' },
  { name: 'Spring Trap', gameId: 12000001, base: 'home' },
  { name: 'Air Bomb', gameId: 12000002, base: 'home' },
  { name: 'Giant Bomb', gameId: 12000005, base: 'home' },
  { name: 'Seeking Air Mine', gameId: 12000006, base: 'home' },
  { name: 'Skeleton Trap', gameId: 12000008, base: 'home' },
  { name: 'Tornado Trap', gameId: 12000016, base: 'home' },
  // Home Village - Resources
  { name: 'Gold Storage', gameId: 1000003, base: 'home' },
  { name: 'Elixir Storage', gameId: 1000004, base: 'home' },
  { name: 'Dark Elixir Storage', gameId: 1000005, base: 'home' },
  { name: 'Gold Mine', gameId: 1000006, base: 'home' },
  { name: 'Elixir Collector', gameId: 1000007, base: 'home' },
  { name: 'Dark Elixir Drill', gameId: 1000023, base: 'home' },
  // Home Village - Army
  { name: 'Barracks', gameId: 1000010, base: 'home' },
  { name: 'Dark Barracks', gameId: 1000020, base: 'home' },
  { name: 'Army Camp', gameId: 1000002, base: 'home' },
  { name: 'Laboratory', gameId: 1000014, base: 'home' },
  { name: 'Spell Factory', gameId: 1000015, base: 'home' },
  { name: 'Dark Spell Factory', gameId: 1000024, base: 'home' },
  { name: 'Workshop', gameId: 1000062, base: 'home' }, // 'Siege Workshop' in new data
  // Home Village - Hero Altars
  { name: 'Barbarian King Altar', gameId: 1000022, base: 'home' },
  { name: 'Archer Queen Altar', gameId: 1000025, base: 'home' },
  { name: 'Grand Warden Altar', gameId: 1000060, base: 'home' },
  { name: 'Royal Champion Altar', gameId: 1000069, base: 'home' },
  // Builder Base
  { name: 'Builder Hall', gameId: 1000034, base: 'builder' },
  { name: 'Double Cannon', gameId: 1000041, base: 'builder' },
  { name: 'Archer Tower', gameId: 1000035, base: 'builder' },
  { name: 'Hidden Tesla', gameId: 1000043, base: 'builder' },
  { name: 'Mega Tesla', gameId: 1000054, base: 'builder' },
  { name: 'Giant Cannon', gameId: 1000051, base: 'builder' },
  { name: 'Firecrackers', gameId: 1000045, base: 'builder' },
  { name: 'Air Bombs', gameId: 1000048, base: 'builder' },
  { name: 'Roaster', gameId: 1000052, base: 'builder' },
  { name: 'Multi Mortar', gameId: 1000046, base: 'builder' },
  { name: 'Crusher', gameId: 1000038, base: 'builder' },
  { name: 'Guard Post', gameId: 1000042, base: 'builder' },
  { name: 'Gem Mine', gameId: 1000039, base: 'builder' },
  { name: 'Clock Tower', gameId: 1000040, base: 'builder' },
  { name: 'Builder\'s Barracks', gameId: 1000036, base: 'builder' },
  { name: 'Star Laboratory', gameId: 1000044, base: 'builder' },
  { name: 'Reinforcement Camp', gameId: 1000050, base: 'builder' },
  { name: 'Healing Hut', gameId: 1000057, base: 'builder' },
  { name: 'O.T.T.O Post', gameId: 1000049, base: 'builder' },
  { name: 'Battle Copter Post', gameId: 1000080, base: 'builder' },
  { name: 'Battle Machine Post', gameId: 1000055, base: 'builder' },
  { name: 'Gold Storage', gameId: 1000033, base: 'builder' },
  { name: 'Elixir Storage', gameId: 1000037, base: 'builder' },
  // Builder Traps
  { name: 'Push Trap', gameId: 12000010, base: 'builder' },
  { name: 'Mine', gameId: 12000011, base: 'builder' },
  { name: 'Mega Mine', gameId: 12000013, base: 'builder' },
  { name: 'Spring Trap', gameId: 12000014, base: 'builder' },
  // Troops, Spells, Heroes, Pets, Equipment etc.
];

// In a real scenario, this would be a complete list.
// For now, this is representative.
export const BUILDING_ID_MAP = new Map(STATIC_GAME_ID_CONFIG.map(c => [c.gameId, {...c, type: buildingNameMap[c.name] || 'other' }]));
