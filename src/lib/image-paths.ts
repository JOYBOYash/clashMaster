/**
 * @fileOverview Centralized manifest for all static image assets.
 * 
 * This file provides functions that return root-relative string paths
 * to assets in the `public` directory. This is the correct way to handle
 * a large number of static assets in Next.js.
 * 
 * The `unoptimized` prop must be used on any `next/image` component
 * that consumes these string paths.
 */

// --- Lookup Functions ---
const defaultImagePath = 'https://placehold.co/128x128.png';

export const getHallImagePath = (base: 'home' | 'builder', level: number): string => {
    if (base === 'home') {
        // As per the JSON, town hall 12-16 have specific file names
        if (level === 12) return `/assets/_town-halls/Building_HV_Town_Hall_level_12_1.png`;
        if (level === 13) return `/assets/_town-halls/Building_HV_Town_Hall_level_13_1.png`;
        if (level === 14) return `/assets/_town-halls/Building_HV_Town_Hall_level_14_1.png`;
        if (level === 15) return `/assets/_town-halls/Building_HV_Town_Hall_level_15_2.png`;
        if (level === 16) return `/assets/_town-halls/Building_HV_Town_Hall_level_16_1.png`;
        if (level === 17) return `/assets/_town-halls/Building_HV_Town_Hall_level_17_1.png`;
        return `/assets/_town-halls/Building_HV_Town_Hall_level_${level}.png`;
    }
    // Placeholder for builder hall images as they are not in the provided JSON
    return `https://placehold.co/160x160.png`; 
};

// Maps names from game data to file names in the JSON
const buildingImageMap: Record<string, string> = {
    'Gold Storage': '/assets/_resources/storages/gold-storage/Building_HV_Gold_Storage_level_15.png', // Example, needs level
    'Elixir Storage': '/assets/_resources/storages/elixir-storage/Building_HV_Elixir_Storage_level_15.png', // Example
    'Dark Elixir Storage': '/assets/_resources/storages/dark-elixer-storage/Building_HV_Dark_Elixir_Storage_level_10.png', // Example
    'Gold Mine': '/assets/_resources/collectors/gold-mines/Building_HV_Gold_Mine_level_15.png', // Example
    'Elixir Collector': '/assets/_resources/collectors/elixir-collector/Building_HV_Elixir_Collector_level_15.png',
    'Dark Elixir Drill': '/assets/_resources/collectors/dark-elixer-drills/Building_HV_Dark_Elixir_Drill_level_9.png',
    'Cannon': '/assets/_defenses/cannon/Building_HV_Cannon_level_21.png',
    'Archer Tower': '/assets/_defenses/archer-tower/Building_HV_Archer_Tower_level_21.png',
    'Mortar': '/assets/_defenses/multi-mortar/Building_HV_Mortar_level_16.png',
    'Air Defense': '/assets/_defenses/air-defense/Building_HV_Air_Defense_level_15.png',
    'Wizard Tower': '/assets/_defenses/wizard-tower/Building_HV_Wizard_Tower_level_17.png',
    'Air Sweeper': '/assets/_defenses/air-sweeper/Building_HV_Air_Sweeper_level_7.png',
    'Hidden Tesla': '/assets/_defenses/hidden-tesla/Building_HV_Hidden_Tesla_level_15.png',
    'Bomb Tower': '/assets/_defenses/bomb-tower/Building_HV_Bomb_Tower_level_12.png',
    'X Bow': '/assets/_defenses/x-bow/Building_HV_X-Bow_level_11.png',
    'Inferno Tower': '/assets/_defenses/inferno-tower/Building_HV_Inferno_Tower_level_11.png',
    'Eagle Artillery': '/assets/_defenses/eagle-artillery/Building_HV_Eagle_Artillery_level_6.png',
    'Scattershot': '/assets/_defenses/scattershot/Building_HV_Scattershot_level_5.png',
    'Spell Tower': '/assets/_defenses/spell-tower/Building_HV_Spell_Tower_level_3_Rage_1_1.png', // Needs logic for type
    'Monolith': '/assets/_defenses/monolith/Building_HV_Monolith_level_4.png',
    'Wall': '/assets/_buildings/walls/Building_HV_Wall_level_18.png',
    'Builder Hut': '/assets/_buildings/builders-hut/Building_HV_Builder_Hut_level_7.png',
    'Clan Castle': '/assets/_buildings/clan-castle/Building_HV_Clan_Castle_level_13.png',
    'Blacksmith': '/assets/_buildings/blacksmith/Building_HV_Blacksmith_level_9.png',
    'Pet House': '/assets/_buildings/pet-house/Building_HV_Pet_House_level_11.png',
    'Barracks': '/assets/_buildings/barracks/barracks.png', // Assumes a generic image if not leveled
    'Dark Barracks': '/assets/_buildings/dark-barracks/Building_HV_Dark_Barracks_level_12.png',
    'Army Camp': '/assets/_buildings/army-camp/Building_HV_Army_Camp_level_11.png',
    'Laboratory': '/assets/_buildings/laboratory/Building_HV_Laboratory_level_15.png',
    'Spell Factory': '/assets/_buildings/spell-factory/Building_HV_Spell_Factory_level_7.png',
    'Dark Spell Factory': '/assets/_buildings/dark-spell-factory/Building_HV_Dark_Spell_Factory_level_6.png',
    'Workshop': '/assets/_buildings/workshop/Building_HV_Workshop_level_7.png',
    // Traps are not in the JSON, so we will use placeholders
    'Bomb': defaultImagePath,
    'Spring Trap': defaultImagePath,
    'Air Bomb': defaultImagePath,
    'Giant Bomb': defaultImagePath,
    'Seeking Air Mine': defaultImagePath,
    'Skeleton Trap': defaultImagePath,
    'Tornado Trap': defaultImagePath,
};

// Simplified lookup as we don't have leveled building images in the JSON for all types
export const getBuildingImagePath = (name: string): string => {
    const path = buildingImageMap[name] || defaultImagePath;
    // For paths that are not complete, we just return the best guess or default.
    // This is a simplification because the JSON doesn't provide level-to-file mapping for all buildings.
    if (path.startsWith('https')) return path;
    return `/assets/${path}`;
};


const troopNameToPathMap: Record<string, string> = {
    // Elixir
    'Archer': '/assets/_troops/elixir/archer.png',
    'Baby Dragon': '/assets/_troops/elixir/baby-dragon.png',
    'Balloon': '/assets/_troops/elixir/balloon.png',
    'Barbarian': '/assets/_troops/elixir/barbarian.png',
    'Dragon Rider': '/assets/_troops/elixir/dragon-rider.png',
    'Dragon': '/assets/_troops/elixir/dragon.png',
    'Electro Dragon': '/assets/_troops/elixir/electro-dragon.png',
    'Electro Titan': '/assets/_troops/elixir/electro-titan.png',
    'Giant': '/assets/_troops/elixir/giant.png',
    'Goblin': '/assets/_troops/elixir/goblin.png',
    'Healer': '/assets/_troops/elixir/healer.png',
    'Miner': '/assets/_troops/elixir/miner.png',
    'P.E.K.K.A': '/assets/_troops/elixir/pekka.png',
    'Root Rider': '/assets/_troops/elixir/root-rider.png',
    'Thrower': '/assets/_troops/elixir/thrower.png',
    'Wall Breaker': '/assets/_troops/elixir/wall-breaker.png',
    'Wizard': '/assets/_troops/elixir/wizard.png',
    'Yeti': '/assets/_troops/elixir/yeti.png',
    // Dark Elixir
    'Apprentice Warden': '/assets/_troops/dark-elixer/apprentice-warden.png',
    'Bowler': '/assets/_troops/dark-elixer/bowler.png',
    'Druid': '/assets/_troops/dark-elixer/druid.png',
    'Golem': '/assets/_troops/dark-elixer/golem.png',
    'Headhunter': '/assets/_troops/dark-elixer/head-hunter.png',
    'Hog Rider': '/assets/_troops/dark-elixer/hog-rider.png',
    'Ice Golem': '/assets/_troops/dark-elixer/ice-golem.png',
    'Lava Hound': '/assets/_troops/dark-elixer/lava-hound.png',
    'Minion': '/assets/_troops/dark-elixer/minion.png',
    'Valkyrie': '/assets/_troops/dark-elixer/valkyrie.png',
    'Witch': '/assets/_troops/dark-elixer/witch.png',
    // Spells
    'Bat Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Bat.png',
    'Earthquake Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Earthquake.png',
    'Haste Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Haste.png',
    'Poison Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Poison.png',
    'Skeleton Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Skeleton.png',
    'Overgrowth Spell': '/assets/_spells/dark-elixer/Icon_HV_Dark_Spell_Overgrowth.png',
    'Clone Spell': '/assets/_spells/elixir/Icon_HV_Spell_Clone.png',
    'Freeze Spell': '/assets/_spells/elixir/Icon_HV_Spell_Freeze_new.png',
    'Healing Spell': '/assets/_spells/elixir/Icon_HV_Spell_Heal.png',
    'Invisibility Spell': '/assets/_spells/elixir/Icon_HV_Spell_Invisibility.png',
    'Jump Spell': '/assets/_spells/elixir/Icon_HV_Spell_Jump.png',
    'Lightning Spell': '/assets/_spells/elixir/Icon_HV_Spell_Lightning_new.png',
    'Rage Spell': '/assets/_spells/elixir/Icon_HV_Spell_Rage.png',
    'Recall Spell': '/assets/_spells/elixir/Icon_HV_Spell_Recall.png',
    'Revive Spell': '/assets/_spells/elixir/Icon_HV_Spell_Revive.png',
};

export const getTroopImagePath = (name: string): string => {
    const path = troopNameToPathMap[name];
    if (path) {
        return `/assets/${path}`;
    }
    return defaultImagePath;
};


// --- UI Asset Paths ---
export const heroAvatarAssets = [
    '/assets/_avatars/bk-avatar.png',
   '/assets/_avatars/bk-avatar2.png',
    '/assets/_avatars/mp-avatar.png',
  '/assets/_avatars/mp-avatar2.png',
];

export const carouselImageAssets = [
  { src: '/assets/_login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
  { src: '/assets/_login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
  { src: '/assets/_login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
  { src: '/assets/_login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
  { src: '/assets/_login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
];


export type FeaturedItem = {
    title: string;
    category: string;
    price: string;
    availability: string;
    imageUrl: string;
    hint: string;
};

// This data is not in the JSON, so we keep it as-is for now.
const skinAssets: Record<string, FeaturedItem[]> = {
  'Barbarian King': [
    { title: 'Champion King', category: 'Hero Skin', price: '1500 Gems', availability: 'Shop', imageUrl: '/assets/skins/champion_king.png', hint: 'gold king armor' },
    { title: 'P.E.K.K.A King', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/assets/skins/pekka_king.png', hint: 'robot king sword' },
  ],
  'Archer Queen': [
    { title: 'Ice Queen', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: '/assets/skins/ice_queen.png', hint: 'ice queen crown' },
    { title: 'Valkyrie Queen', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/assets/skins/valkyrie_queen.png', hint: 'warrior queen axe' },
  ],
  'Grand Warden': [
    { title: 'Party Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/assets/skins/party_warden.png', hint: 'dj wizard staff' },
    { title: 'Primal Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/assets/skins/primal_warden.png', hint: 'shaman wizard staff' },
  ],
  'Royal Champion': [
    { title: 'Gladiator Champion', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: '/assets/skins/gladiator_champion.png', hint: 'gladiator champion spear' },
    { title: 'Shadow Champion', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/assets/skins/shadow_champion.png', hint: 'ninja champion dark' },
  ],
};

const otherFeaturedItemAssets: FeaturedItem[] = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/assets/scenery/magic_theater.png", hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/assets/scenery/shadow_scenery.png", hint: "dark castle night" },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

export const getFeaturedItems = (unlockedHeroNames: string[]): FeaturedItem[] => {
    let availableSkins: FeaturedItem[] = [];
    for (const heroName of unlockedHeroNames) {
      if (skinAssets[heroName as keyof typeof skinAssets]) {
        availableSkins = availableSkins.concat(skinAssets[heroName as keyof typeof skinAssets]);
      }
    }

    const combinedPool = [...availableSkins, ...otherFeaturedItemAssets];
    const shuffled = shuffleArray(combinedPool);
    return shuffled.slice(0, 3);
};
