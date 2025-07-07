
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
  maxLevel: number;
  type: Building['type'];
  base: Building['base'];
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
    maxLevel: number;
    village: Troop['village'];
    elixirType: Troop['elixirType'];
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
    maxLevel: number;
    village: Hero['village'];
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
  { name: 'Town Hall', gameId: 1000001, maxLevel: 16, type: 'other', base: 'home' },
  { name: 'Clan Castle', gameId: 1000000, maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Blacksmith', gameId: 1000071, maxLevel: 9, type: 'army', base: 'home' },
  { name: 'Pet House', gameId: 1000070, maxLevel: 9, type: 'army', base: 'home' },
  // Home Village - Defenses
  { name: 'Cannon', gameId: 1000008, maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Archer Tower', gameId: 1000009, maxLevel: 21, type: 'defensive', base: 'home' },
  { name: 'Mortar', gameId: 1000013, maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'Air Defense', gameId: 1000012, maxLevel: 13, type: 'defensive', base: 'home' },
  { name: 'Wizard Tower', gameId: 1000019, maxLevel: 15, type: 'defensive', base: 'home' },
  { name: 'Air Sweeper', gameId: 1000028, maxLevel: 8, type: 'defensive', base: 'home' },
  { name: 'Hidden Tesla', gameId: 1000021, maxLevel: 13, type: 'defensive', base: 'home' },
  { name: 'Bomb Tower', gameId: 1000029, maxLevel: 10, type: 'defensive', base: 'home' },
  { name: 'X-Bow', gameId: 1000027, maxLevel: 10, type: 'defensive', base: 'home' },
  { name: 'Inferno Tower', gameId: 1000032, maxLevel: 9, type: 'defensive', base: 'home' },
  { name: 'Eagle Artillery', gameId: 1000059, maxLevel: 6, type: 'defensive', base: 'home' },
  { name: 'Scattershot', gameId: 1000068, maxLevel: 4, type: 'defensive', base: 'home' },
  { name: 'Spell Tower', gameId: 1000075, maxLevel: 3, type: 'defensive', base: 'home' },
  { name: 'Monolith', gameId: 1000076, maxLevel: 2, type: 'defensive', base: 'home' },
  // Home Village - Traps
  { name: 'Bomb', gameId: 12000000, maxLevel: 11, type: 'trap', base: 'home' },
  { name: 'Spring Trap', gameId: 12000001, maxLevel: 5, type: 'trap', base: 'home' },
  { name: 'Air Bomb', gameId: 12000002, maxLevel: 10, type: 'trap', base: 'home' },
  { name: 'Giant Bomb', gameId: 12000005, maxLevel: 9, type: 'trap', base: 'home' },
  { name: 'Seeking Air Mine', gameId: 12000006, maxLevel: 5, type: 'trap', base: 'home' },
  { name: 'Skeleton Trap', gameId: 12000008, maxLevel: 5, type: 'trap', base: 'home' },
  { name: 'Tornado Trap', gameId: 12000016, maxLevel: 3, type: 'trap', base: 'home' },
  // Home Village - Resources
  { name: 'Gold Storage', gameId: 1000003, maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Storage', gameId: 1000004, maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Storage', gameId: 1000005, maxLevel: 10, type: 'resource', base: 'home' },
  { name: 'Gold Mine', gameId: 1000006, maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Collector', gameId: 1000007, maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Drill', gameId: 1000023, maxLevel: 9, type: 'resource', base: 'home' },
  // Home Village - Army
  { name: 'Barracks', gameId: 1000010, maxLevel: 16, type: 'army', base: 'home' },
  { name: 'Dark Barracks', gameId: 1000020, maxLevel: 10, type: 'army', base: 'home' },
  { name: 'Army Camp', gameId: 1000002, maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Laboratory', gameId: 1000014, maxLevel: 14, type: 'army', base: 'home' },
  { name: 'Spell Factory', gameId: 1000015, maxLevel: 7, type: 'army', base: 'home' },
  { name: 'Dark Spell Factory', gameId: 1000024, maxLevel: 6, type: 'army', base: 'home' },
  { name: 'Workshop', gameId: 1000062, maxLevel: 7, type: 'army', base: 'home' },
  // Home Village - Hero Altars
  { name: 'Barbarian King Altar', gameId: 1000022, maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Archer Queen Altar', gameId: 1000025, maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Grand Warden Altar', gameId: 1000060, maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Royal Champion Altar', gameId: 1000069, maxLevel: 1, type: 'hero', base: 'home' },
  // Builder Base
  { name: 'Builder Hall', gameId: 1000034, maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Double Cannon', gameId: 1000041, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Archer Tower', gameId: 1000035, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Hidden Tesla', gameId: 1000043, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Mega Tesla', gameId: 1000054, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Giant Cannon', gameId: 1000051, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Firecrackers', gameId: 1000045, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Air Bombs', gameId: 1000048, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Roaster', gameId: 1000052, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Multi Mortar', gameId: 1000046, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Crusher', gameId: 1000038, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Guard Post', gameId: 1000042, maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Gem Mine', gameId: 1000039, maxLevel: 10, type: 'resource', base: 'builder' },
  { name: 'Clock Tower', gameId: 1000040, maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Builder\'s Barracks', gameId: 1000036, maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Star Laboratory', gameId: 1000044, maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Reinforcement Camp', gameId: 1000050, maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Healing Hut', gameId: 1000057, maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'O.T.T.O Post', gameId: 1000049, maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Battle Copter Post', gameId: 1000080, maxLevel: 1, type: 'hero', base: 'builder' },
  { name: 'Battle Machine Post', gameId: 1000055, maxLevel: 1, type: 'hero', base: 'builder' },
  { name: 'Gold Storage', gameId: 1000033, maxLevel: 10, type: 'resource', base: 'builder' },
  { name: 'Elixir Storage', gameId: 1000037, maxLevel: 10, type: 'resource', base: 'builder' },
  // Builder Traps
  { name: 'Push Trap', gameId: 12000010, maxLevel: 10, type: 'trap', base: 'builder' },
  { name: 'Mine', gameId: 12000011, maxLevel: 10, type: 'trap', base: 'builder' },
  { name: 'Mega Mine', gameId: 12000013, maxLevel: 10, type: 'trap', base: 'builder' },
  { name: 'Spring Trap', gameId: 12000014, maxLevel: 5, type: 'trap', base: 'builder' },
];

export const ALL_TROOPS_CONFIG: TroopConfig[] = [
    // Home Village - Elixir
    { name: 'Barbarian', gameId: 4000000, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Archer', gameId: 4000001, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Giant', gameId: 4000003, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Goblin', gameId: 4000002, maxLevel: 8, village: 'home', elixirType: 'regular' },
    { name: 'Wall Breaker', gameId: 4000004, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Balloon', gameId: 4000005, maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'Wizard', gameId: 4000006, maxLevel: 11, village: 'home', elixirType: 'regular' },
    { name: 'Healer', gameId: 4000007, maxLevel: 8, village: 'home', elixirType: 'regular' },
    { name: 'Dragon', gameId: 4000008, maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'P.E.K.K.A', gameId: 4000009, maxLevel: 10, village: 'home', elixirType: 'regular' },
    { name: 'Baby Dragon', gameId: 4000023, maxLevel: 9, village: 'home', elixirType: 'regular' },
    { name: 'Miner', gameId: 4000024, maxLevel: 9, village: 'home', elixirType: 'regular' },
    { name: 'Electro Dragon', gameId: 4000039, maxLevel: 6, village: 'home', elixirType: 'regular' },
    { name: 'Yeti', gameId: 4000047, maxLevel: 5, village: 'home', elixirType: 'regular' },
    { name: 'Dragon Rider', gameId: 4000054, maxLevel: 4, village: 'home', elixirType: 'regular' },
    { name: 'Electro Titan', gameId: 4000059, maxLevel: 4, village: 'home', elixirType: 'regular' },
    { name: 'Root Rider', gameId: 4000065, maxLevel: 3, village: 'home', elixirType: 'regular' },
    // Home Village - Dark Elixir
    { name: 'Minion', gameId: 4000010, maxLevel: 11, village: 'home', elixirType: 'dark' },
    { name: 'Hog Rider', gameId: 4000011, maxLevel: 12, village: 'home', elixirType: 'dark' },
    { name: 'Valkyrie', gameId: 4000012, maxLevel: 10, village: 'home', elixirType: 'dark' },
    { name: 'Golem', gameId: 4000013, maxLevel: 12, village: 'home', elixirType: 'dark' },
    { name: 'Witch', gameId: 4000015, maxLevel: 6, village: 'home', elixirType: 'dark' },
    { name: 'Lava Hound', gameId: 4000017, maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Bowler', gameId: 4000028, maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Ice Golem', gameId: 4000043, maxLevel: 7, village: 'home', elixirType: 'dark' },
    { name: 'Headhunter', gameId: 4000050, maxLevel: 4, village: 'home', elixirType: 'dark' },
    { name: 'Apprentice Warden', gameId: 4000062, maxLevel: 4, village: 'home', elixirType: 'dark' },
    // Home Village - Spells
    { name: 'Lightning Spell', gameId: 26000000, maxLevel: 10, village: 'home', elixirType: 'regular'},
    { name: 'Healing Spell', gameId: 26000001, maxLevel: 8, village: 'home', elixirType: 'regular'},
    { name: 'Rage Spell', gameId: 26000002, maxLevel: 7, village: 'home', elixirType: 'regular'},
    { name: 'Jump Spell', gameId: 26000003, maxLevel: 4, village: 'home', elixirType: 'regular'},
    { name: 'Freeze Spell', gameId: 26000005, maxLevel: 8, village: 'home', elixirType: 'regular'},
    { name: 'Clone Spell', gameId: 26000016, maxLevel: 8, village: 'home', elixirType: 'regular'},
    { name: 'Invisibility Spell', gameId: 26000027, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Recall Spell', gameId: 26000035, maxLevel: 4, village: 'home', elixirType: 'regular'},
    // Home Village - Dark Spells
    { name: 'Poison Spell', gameId: 26000009, maxLevel: 10, village: 'home', elixirType: 'dark'},
    { name: 'Earthquake Spell', gameId: 26000010, maxLevel: 5, village: 'home', elixirType: 'dark'},
    { name: 'Haste Spell', gameId: 26000011, maxLevel: 5, village: 'home', elixirType: 'dark'},
    { name: 'Skeleton Spell', gameId: 26000013, maxLevel: 8, village: 'home', elixirType: 'dark'},
    { name: 'Bat Spell', gameId: 26000020, maxLevel: 6, village: 'home', elixirType: 'dark'},
    // Home Village - Siege Machines
    { name: 'Wall Wrecker', gameId: 4000040, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Battle Blimp', gameId: 4000041, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Stone Slammer', gameId: 4000044, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Siege Barracks', gameId: 4000048, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Log Launcher', gameId: 4000051, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Flame Flinger', gameId: 4000052, maxLevel: 5, village: 'home', elixirType: 'regular'},
    { name: 'Battle Drill', gameId: 4000060, maxLevel: 5, village: 'home', elixirType: 'regular'},
    // Builder Base
    { name: 'Raged Barbarian', gameId: 4000018, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Sneaky Archer', gameId: 4000019, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Boxer Giant', gameId: 4000021, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Beta Minion', gameId: 4000020, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Bomber', gameId: 4000022, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Baby Dragon', gameId: 4000026, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Cannon Cart', gameId: 4000029, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Night Witch', gameId: 4000030, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Drop Ship', gameId: 4000031, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Power P.E.K.K.A', gameId: 4000032, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Hog Glider', gameId: 4000034, maxLevel: 20, village: 'builder', elixirType: 'none' },
    { name: 'Electrofire Wizard', gameId: 4000042, maxLevel: 20, village: 'builder', elixirType: 'none' },
];

export const ALL_HEROES_CONFIG: HeroConfig[] = [
    { name: 'Barbarian King', gameId: 28000000, maxLevel: 95, village: 'home' },
    { name: 'Archer Queen', gameId: 28000001, maxLevel: 95, village: 'home' },
    { name: 'Grand Warden', gameId: 28000002, maxLevel: 70, village: 'home' },
    { name: 'Royal Champion', gameId: 28000006, maxLevel: 45, village: 'home' },
    { name: 'Battle Machine', gameId: 28000003, maxLevel: 45, village: 'builder' },
    { name: 'Battle Copter', gameId: 28000005, maxLevel: 45, village: 'builder' },
];

export const ALL_PETS_CONFIG: {name: string, gameId: number, maxLevel: number}[] = [
    { name: 'L.A.S.S.I', gameId: 28000007, maxLevel: 15 },
    { name: 'Electro Owl', gameId: 28000008, maxLevel: 15 },
    { name: 'Mighty Yak', gameId: 28000009, maxLevel: 15 },
    { name: 'Unicorn', gameId: 28000010, maxLevel: 15 },
    { name: 'Frosty', gameId: 28000011, maxLevel: 15 },
    { name: 'Diggy', gameId: 28000012, maxLevel: 15 },
    { name: 'Poison Lizard', gameId: 28000013, maxLevel: 15 },
    { name: 'Phoenix', gameId: 28000014, maxLevel: 15 },
    { name: 'Spirit Fox', gameId: 28000015, maxLevel: 15 },
    { name: 'Angry Jelly', gameId: 28000016, maxLevel: 15 },
];

export const ALL_EQUIPMENT_CONFIG: EquipmentConfig[] = [
    // Barbarian King
    { name: 'Barbarian Puppet', gameId: 90000000, maxLevel: 18 },
    { name: 'Rage Vial', gameId: 90000001, maxLevel: 18 },
    { name: 'Earthquake Boots', gameId: 90000002, maxLevel: 18 },
    { name: 'Vampstache', gameId: 90000003, maxLevel: 27 },
    { name: 'Hog Rider Puppet', gameId: 90000020, maxLevel: 18 },
    { name: 'Giant Gauntlet', gameId: 90000023, maxLevel: 27 },
    // Archer Queen
    { name: 'Archer Puppet', gameId: 90000004, maxLevel: 18 },
    { name: 'Invisibility Vial', gameId: 90000005, maxLevel: 18 },
    { name: 'Giant Arrow', gameId: 90000006, maxLevel: 18 },
    { name: 'Healer Puppet', gameId: 90000007, maxLevel: 18 },
    { name: 'Frozen Arrow', gameId: 90000022, maxLevel: 27 },
    // Grand Warden
    { name: 'Eternal Tome', gameId: 90000008, maxLevel: 18 },
    { name: 'Life Gem', gameId: 90000009, maxLevel: 18 },
    { name: 'Rage Gem', gameId: 90000010, maxLevel: 18 },
    { name: 'Healing Tome', gameId: 90000011, maxLevel: 18 },
    { name: 'Fireball', gameId: 90000024, maxLevel: 27 },
    // Royal Champion
    { name: 'Seeking Shield', gameId: 90000012, maxLevel: 18 },
    { name: 'Haste Vial', gameId: 90000013, maxLevel: 18 },
    { name: 'Royal Gem', gameId: 90000014, maxLevel: 18 },
    { name: 'Hog Rider Puppet', gameId: 90000015, maxLevel: 18 },
];
