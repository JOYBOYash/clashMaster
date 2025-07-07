
import type { z } from 'zod';
import { z as zod } from 'zod';

export const BuildingSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  level: zod.number().min(0),
  maxLevel: zod.number().min(1),
  type: zod.enum(['defensive', 'army', 'resource', 'other', 'hero']),
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

// New config structure to handle unlocks and counts
export interface BuildingConfig {
  name: string;
  maxLevel: number;
  type: Building['type'];
  base: Building['base'];
  unlockedAt: number; // TH or BH level
  count?: Record<number, number>; // TH/BH level -> count
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
  heroes: zod.array(HeroSchema),
  pets: zod.array(PetSchema),
  equipment: zod.array(EquipmentSchema),
});

export type VillageState = z.infer<typeof VillageStateSchema>;

export const ALL_BUILDINGS_CONFIG: BuildingConfig[] = [
  // Home Village - General
  { name: 'Town Hall', maxLevel: 16, type: 'other', base: 'home', unlockedAt: 1, count: {1:1} },
  { name: 'Clan Castle', maxLevel: 12, type: 'army', base: 'home', unlockedAt: 3, count: {3:1} },
  { name: 'Blacksmith', maxLevel: 9, type: 'army', base: 'home', unlockedAt: 8, count: {8:1}},
  { name: 'Pet House', maxLevel: 9, type: 'army', base: 'home', unlockedAt: 14, count: {14:1}},
  // Home Village - Defenses
  { name: 'Cannon', maxLevel: 21, type: 'defensive', base: 'home', unlockedAt: 1, count: { 1: 2, 6: 3, 7: 4, 8: 5, 10: 6, 14: 7 } },
  { name: 'Archer Tower', maxLevel: 21, type: 'defensive', base: 'home', unlockedAt: 2, count: { 2: 1, 4: 2, 5: 3, 7: 4, 8: 5, 9: 6, 10: 7, 12: 8 } },
  { name: 'Mortar', maxLevel: 15, type: 'defensive', base: 'home', unlockedAt: 5, count: { 5: 1, 6: 2, 8: 3, 9: 4 } },
  { name: 'Air Defense', maxLevel: 13, type: 'defensive', base: 'home', unlockedAt: 4, count: { 4: 1, 6: 2, 7: 3, 9: 4 } },
  { name: 'Wizard Tower', maxLevel: 15, type: 'defensive', base: 'home', unlockedAt: 5, count: { 5: 1, 7: 2, 8: 3, 9: 4, 11: 5 } },
  { name: 'Air Sweeper', maxLevel: 8, type: 'defensive', base: 'home', unlockedAt: 6, count: { 6: 1, 9: 2 } },
  { name: 'Hidden Tesla', maxLevel: 13, type: 'defensive', base: 'home', unlockedAt: 7, count: { 7: 2, 8: 3, 9: 4, 11: 5 } },
  { name: 'Bomb Tower', maxLevel: 10, type: 'defensive', base: 'home', unlockedAt: 8, count: { 8: 1, 10: 2 } },
  { name: 'X-Bow', maxLevel: 10, type: 'defensive', base: 'home', unlockedAt: 9, count: { 9: 2, 10: 3, 11: 4 } },
  { name: 'Inferno Tower', maxLevel: 9, type: 'defensive', base: 'home', unlockedAt: 10, count: { 10: 2, 12: 3 } },
  { name: 'Eagle Artillery', maxLevel: 6, type: 'defensive', base: 'home', unlockedAt: 11, count: { 11: 1 } },
  { name: 'Scattershot', maxLevel: 4, type: 'defensive', base: 'home', unlockedAt: 13, count: { 13: 2 } },
  { name: 'Spell Tower', maxLevel: 3, type: 'defensive', base: 'home', unlockedAt: 15, count: { 15: 2 } },
  { name: 'Monolith', maxLevel: 2, type: 'defensive', base: 'home', unlockedAt: 15, count: { 15: 1 } },
  // Home Village - Resources
  { name: 'Gold Storage', maxLevel: 15, type: 'resource', base: 'home', unlockedAt: 1, count: { 1: 1, 3: 2, 7: 3, 8: 4 } },
  { name: 'Elixir Storage', maxLevel: 15, type: 'resource', base: 'home', unlockedAt: 1, count: { 1: 1, 3: 2, 7: 3, 8: 4 } },
  { name: 'Dark Elixir Storage', maxLevel: 10, type: 'resource', base: 'home', unlockedAt: 7, count: { 7: 1 } },
  { name: 'Gold Mine', maxLevel: 15, type: 'resource', base: 'home', unlockedAt: 1, count: { 1: 1, 2: 2, 3: 3, 4: 4, 6: 5, 7: 6, 9: 7 } },
  { name: 'Elixir Collector', maxLevel: 15, type: 'resource', base: 'home', unlockedAt: 1, count: { 1: 1, 2: 2, 3: 3, 4: 4, 6: 5, 7: 6, 9: 7 } },
  { name: 'Dark Elixir Drill', maxLevel: 9, type: 'resource', base: 'home', unlockedAt: 8, count: { 8: 1, 9: 2, 10: 3 } },
  // Home Village - Army
  { name: 'Barracks', maxLevel: 16, type: 'army', base: 'home', unlockedAt: 1, count: { 1: 1, 2: 2, 3: 3, 4: 4 } },
  { name: 'Dark Barracks', maxLevel: 10, type: 'army', base: 'home', unlockedAt: 7, count: { 7: 1, 8: 2 } },
  { name: 'Army Camp', maxLevel: 12, type: 'army', base: 'home', unlockedAt: 1, count: { 1: 1, 2: 2, 5: 3, 7: 4 } },
  { name: 'Laboratory', maxLevel: 14, type: 'army', base: 'home', unlockedAt: 3, count: { 3: 1 } },
  { name: 'Spell Factory', maxLevel: 7, type: 'army', base: 'home', unlockedAt: 5, count: { 5: 1 } },
  { name: 'Dark Spell Factory', maxLevel: 6, type: 'army', base: 'home', unlockedAt: 8, count: { 8: 1 } },
  { name: 'Workshop', maxLevel: 7, type: 'army', base: 'home', unlockedAt: 12, count: { 12: 1 } },
  // Home Village - Hero Altars
  { name: 'Barbarian King Altar', maxLevel: 1, type: 'hero', base: 'home', unlockedAt: 7, count: {7:1} },
  { name: 'Archer Queen Altar', maxLevel: 1, type: 'hero', base: 'home', unlockedAt: 9, count: {9:1} },
  { name: 'Grand Warden Altar', maxLevel: 1, type: 'hero', base: 'home', unlockedAt: 11, count: {11:1} },
  { name: 'Royal Champion Altar', maxLevel: 1, type: 'hero', base: 'home', unlockedAt: 13, count: {13:1} },
  // Builder Base
  { name: 'Builder Hall', maxLevel: 10, type: 'other', base: 'builder', unlockedAt: 1, count: { 1: 1 } },
  { name: 'Double Cannon', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 1, count: {1:1} },
  { name: 'Archer Tower', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 2, count: {2:1, 3:2} },
  { name: 'Hidden Tesla', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 4, count: {4:2, 5:3, 8:4} },
  { name: 'Mega Tesla', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 8, count: {8:1} },
  { name: 'Giant Cannon', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 6, count: {6:1} },
  { name: 'Firecrackers', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 4, count: {4:2, 6:3} },
  { name: 'Air Bombs', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 5, count: {5:1} },
  { name: 'Roaster', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 6, count: {6:1} },
  { name: 'Multi Mortar', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 5, count: {5:1} },
  { name: 'Crusher', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 3, count: {3:1, 5:2} },
  { name: 'Guard Post', maxLevel: 10, type: 'defensive', base: 'builder', unlockedAt: 4, count: {4:1} },
  { name: 'Gem Mine', maxLevel: 10, type: 'resource', base: 'builder', unlockedAt: 3, count: {3:1} },
  { name: 'Clock Tower', maxLevel: 10, type: 'other', base: 'builder', unlockedAt: 4, count: {4:1} },
  { name: 'Builder\'s Barracks', maxLevel: 10, type: 'army', base: 'builder', unlockedAt: 2, count: {2:1, 6:2} },
  { name: 'Star Laboratory', maxLevel: 10, type: 'army', base: 'builder', unlockedAt: 4, count: {4:1} },
  { name: 'Reinforcement Camp', maxLevel: 10, type: 'army', base: 'builder', unlockedAt: 6, count: {6:2} },
  { name: 'Healing Hut', maxLevel: 10, type: 'army', base: 'builder', unlockedAt: 6, count: {6:1} },
  { name: 'O.T.T.O Post', maxLevel: 10, type: 'other', base: 'builder', unlockedAt: 6, count: {6:1} },
];

export const ALL_TROOPS_CONFIG: Omit<Troop, 'id' | 'level'>[] = [
    // Home Village - Elixir
    { name: 'Barbarian', maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Archer', maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Goblin', maxLevel: 8, village: 'home', elixirType: 'regular' },
    { name: 'Giant', maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Wall Breaker', maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Balloon', maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'Wizard', maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Healer', maxLevel: 8, village: 'home', elixirType: 'regular' },
    { name: 'Dragon', maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'P.E.K.K.A', maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'Baby Dragon', maxLevel: 9, village: 'home', elixirType: 'regular' },
    { name: 'Miner', maxLevel: 9, village: 'home', elixirType: 'regular' },
    { name: 'Electro Dragon', maxLevel: 6, village: 'home', elixirType: 'regular' },
    { name: 'Yeti', maxLevel: 5, village: 'home', elixirType: 'regular' },
    { name: 'Dragon Rider', maxLevel: 4, village: 'home', elixirType: 'regular' },
    { name: 'Electro Titan', maxLevel: 4, village: 'home', elixirType: 'regular' },
    { name: 'Root Rider', maxLevel: 3, village: 'home', elixirType: 'regular' },
    // Home Village - Dark Elixir
    { name: 'Minion', maxLevel: 11, village: 'home', elixirType: 'dark' },
    { name: 'Hog Rider', maxLevel: 12, village: 'home', elixirType: 'dark' },
    { name: 'Valkyrie', maxLevel: 10, village: 'home', elixirType: 'dark' },
    { name: 'Golem', maxLevel: 12, village: 'home', elixirType: 'dark' },
    { name: 'Witch', maxLevel: 6, village: 'home', elixirType: 'dark' },
    { name: 'Lava Hound', maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Bowler', maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Ice Golem', maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Headhunter', maxLevel: 4, village: 'home', elixirType: 'dark' },
    { name: 'Apprentice Warden', maxLevel: 4, village: 'home', elixirType: 'dark' },
    // Builder Base
    { name: 'Raged Barbarian', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Sneaky Archer', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Boxer Giant', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Beta Minion', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Bomber', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Baby Dragon', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Cannon Cart', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Night Witch', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Drop Ship', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Power P.E.K.K.A', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Hog Glider', maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Electrofire Wizard', maxLevel: 20, village: 'builder', elixirType: 'none' },
];

export const ALL_HEROES_CONFIG: Omit<Hero, 'id' | 'level'>[] = [
    { name: 'Barbarian King', maxLevel: 95, village: 'home' },
    { name: 'Archer Queen', maxLevel: 95, village: 'home' },
    { name: 'Grand Warden', maxLevel: 70, village: 'home' },
    { name: 'Royal Champion', maxLevel: 45, village: 'home' },
    { name: 'Battle Machine', maxLevel: 45, village: 'builder' },
    { name: 'Battle Copter', maxLevel: 45, village: 'builder' },
];

export const ALL_PETS_CONFIG: Omit<Pet, 'id' | 'level'>[] = [
    { name: 'L.A.S.S.I', maxLevel: 15 },
    { name: 'Electro Owl', maxLevel: 15 },
    { name: 'Mighty Yak', maxLevel: 15 },
    { name: 'Unicorn', maxLevel: 15 },
    { name: 'Frosty', maxLevel: 15 },
    { name: 'Diggy', maxLevel: 15 },
    { name: 'Poison Lizard', maxLevel: 15 },
    { name: 'Phoenix', maxLevel: 15 },
    { name: 'Spirit Fox', maxLevel: 15 },
    { name: 'Angry Jelly', maxLevel: 15 },
];

export const ALL_EQUIPMENT_CONFIG: Omit<Equipment, 'id' | 'level'>[] = [
    // Barbarian King
    { name: 'Barbarian Puppet', maxLevel: 18 },
    { name: 'Rage Vial', maxLevel: 18 },
    { name: 'Archer Puppet', maxLevel: 18 },
    { name: 'Hog Rider Puppet', maxLevel: 18 },
    { name: 'Earthquake Boots', maxLevel: 18 },
    { name: 'Vampstache', maxLevel: 27 },
    { name: 'Giant Gauntlet', maxLevel: 27 },
    // Archer Queen
    { name: 'Archer Puppet', maxLevel: 18 },
    { name: 'Invisibility Vial', maxLevel: 18 },
    { name: 'Healer Puppet', maxLevel: 18 },
    { name: 'Giant Arrow', maxLevel: 18 },
    { name: 'Frozen Arrow', maxLevel: 27 },
    // Grand Warden
    { name: 'Eternal Tome', maxLevel: 18 },
    { name: 'Life Gem', maxLevel: 18 },
    { name: 'Rage Gem', maxLevel: 18 },
    { name: 'Healing Tome', maxLevel: 18 },
    { name: 'Fireball', maxLevel: 27 },
    // Royal Champion
    { name: 'Seeking Shield', maxLevel: 18 },
    { name: 'Royal Gem', maxLevel: 18 },
    { name: 'Haste Vial', maxLevel: 18 },
    { name: 'Hog Rider Puppet', maxLevel: 18 },
];


export const DEMO_VILLAGE_STATE: VillageState = {
  townHallLevel: 12,
  builderHallLevel: 9,
  buildings: [
    { id: 'TownHall-1', name: 'Town Hall', level: 12, maxLevel: 16, type: 'other', base: 'home', isUpgrading: false },
    { id: 'ClanCastle-1', name: 'Clan Castle', level: 8, maxLevel: 12, type: 'army', base: 'home', isUpgrading: false },
    { id: 'Laboratory-1', name: 'Laboratory', level: 10, maxLevel: 14, type: 'army', base: 'home', isUpgrading: false },
    { id: 'Blacksmith-1', name: 'Blacksmith', level: 5, maxLevel: 9, type: 'army', base: 'home', isUpgrading: false },
    { id: 'ArmyCamp-4', name: 'Army Camp', level: 9, maxLevel: 12, type: 'army', base: 'home', isUpgrading: true, upgradeEndTime: new Date(Date.now() + 86400000).toISOString() },
    { id: 'EagleArtillery-1', name: 'Eagle Artillery', level: 3, maxLevel: 6, type: 'defensive', base: 'home', isUpgrading: false },
    { id: 'BuilderHall-1', name: 'Builder Hall', level: 9, maxLevel: 10, type: 'other', base: 'builder', isUpgrading: false },
  ],
  troops: [
    { id: 'Dragon-1', name: 'Dragon', level: 7, maxLevel: 10, village: 'home', elixirType: 'regular' },
    { id: 'HogRider-1', name: 'Hog Rider', level: 8, maxLevel: 12, village: 'home', elixirType: 'dark' },
    { id: 'CannonCart-1', name: 'Cannon Cart', level: 18, maxLevel: 20, village: 'builder', elixirType: 'none' },
  ],
  heroes: [
    { id: 'BarbarianKing-1', name: 'Barbarian King', level: 65, maxLevel: 95, village: 'home' },
    { id: 'ArcherQueen-1', name: 'Archer Queen', level: 65, maxLevel: 95, village: 'home' },
    { id: 'GrandWarden-1', name: 'Grand Warden', level: 40, maxLevel: 70, village: 'home' },
    { id: 'BattleMachine-1', name: 'Battle Machine', level: 30, maxLevel: 45, village: 'builder' },
  ],
  pets: [],
  equipment: [
      { id: 'BarbarianPuppet-1', name: 'Barbarian Puppet', level: 12, maxLevel: 18 },
      { id: 'RageVial-1', name: 'Rage Vial', level: 12, maxLevel: 18 },
      { id: 'InvisibilityVial-1', name: 'Invisibility Vial', level: 12, maxLevel: 18 },
  ],
};

// This is no longer used for initial data but can be useful for type inference.
export const initialVillageState: VillageState = {
  townHallLevel: 1,
  builderHallLevel: 1,
  buildings: [],
  troops: [],
  heroes: [],
  pets: [],
  equipment: [],
};
