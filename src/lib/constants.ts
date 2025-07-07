
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

export const ALL_BUILDINGS_CONFIG: Omit<Building, 'id' | 'level' | 'isUpgrading'>[] = [
  // Home Village - General
  { name: 'Town Hall', maxLevel: 16, type: 'other', base: 'home' },
  { name: 'Clan Castle', maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Blacksmith', maxLevel: 9, type: 'army', base: 'home' },
  { name: 'Pet House', maxLevel: 9, type: 'army', base: 'home' },
  // Home Village - Defenses
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
  // Home Village - Resources
  { name: 'Gold Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Storage', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Storage', maxLevel: 10, type: 'resource', base: 'home' },
  { name: 'Gold Mine', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Elixir Collector', maxLevel: 15, type: 'resource', base: 'home' },
  { name: 'Dark Elixir Drill', maxLevel: 9, type: 'resource', base: 'home' },
  // Home Village - Army
  { name: 'Barracks', maxLevel: 16, type: 'army', base: 'home' },
  { name: 'Dark Barracks', maxLevel: 10, type: 'army', base: 'home' },
  { name: 'Army Camp', maxLevel: 12, type: 'army', base: 'home' },
  { name: 'Laboratory', maxLevel: 14, type: 'army', base: 'home' },
  { name: 'Spell Factory', maxLevel: 7, type: 'army', base: 'home' },
  { name: 'Dark Spell Factory', maxLevel: 6, type: 'army', base: 'home' },
  { name: 'Workshop', maxLevel: 7, type: 'army', base: 'home' },
  // Home Village - Hero Altars
  { name: 'Barbarian King Altar', maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Archer Queen Altar', maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Grand Warden Altar', maxLevel: 1, type: 'hero', base: 'home' },
  { name: 'Royal Champion Altar', maxLevel: 1, type: 'hero', base: 'home' },
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
  { name: 'Crusher', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Guard Post', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Push Trap', maxLevel: 10, type: 'defensive', base: 'builder' },
  { name: 'Gem Mine', maxLevel: 10, type: 'resource', base: 'builder' },
  { name: 'Clock Tower', maxLevel: 10, type: 'other', base: 'builder' },
  { name: 'Builder\'s Barracks', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Star Laboratory', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Reinforcement Camp', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'Healing Hut', maxLevel: 10, type: 'army', base: 'builder' },
  { name: 'O.T.T.O Post', maxLevel: 10, type: 'other', base: 'builder' },
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

    