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
        if (level === 12) return `/assets/town-halls/Building_HV_Town_Hall_level_12_1.png`;
        if (level === 13) return `/assets/town-halls/Building_HV_Town_Hall_level_13_1.png`;
        if (level === 14) return `/assets/town-halls/Building_HV_Town_Hall_level_14_1.png`;
        if (level === 15) return `/assets/town-halls/Building_HV_Town_Hall_level_15_2.png`;
        if (level === 16) return `/assets/town-halls/Building_HV_Town_Hall_level_16_1.png`;
        if (level === 17) return `/assets/town-halls/Building_HV_Town_Hall_level_17_1.png`;
        return `/assets/town-halls/Building_HV_Town_Hall_level_${level}.png`;
    }
    // Placeholder for builder hall images as they are not in the provided JSON
    return `https://placehold.co/160x160.png`; 
};

// Maps names from game data to file names in the JSON
const buildingImageMap: Record<string, string> = {
    'Gold Storage': 'gold-storage/Building_HV_Gold_Storage_level_15.png', // Example, needs level
    'Elixir Storage': 'storages/elixir-storage/Building_HV_Elixir_Storage_level_15.png', // Example
    'Dark Elixir Storage': 'storages/dark-elixir-storage/Building_HV_Dark_Elixir_Storage_level_10.png', // Example
    'Gold Mine': 'collectors/gold-mines/Building_HV_Gold_Mine_level_15.png', // Example
    'Elixir Collector': 'resources/collectors/elixir-collector/Building_HV_Elixir_Collector_level_15.png',
    'Dark Elixir Drill': 'resources/collectors/dark-elixir-drills/Building_HV_Dark_Elixir_Drill_level_9.png',
    'Cannon': 'defenses/cannon/Building_HV_Cannon_level_21.png',
    'Archer Tower': 'defenses/archer-tower/Building_HV_Archer_Tower_level_21.png',
    'Mortar': 'defenses/multi-mortar/Building_HV_Mortar_level_16.png',
    'Air Defense': 'defenses/air-defense/Building_HV_Air_Defense_level_15.png',
    'Wizard Tower': 'defenses/wizard-tower/Building_HV_Wizard_Tower_level_17.png',
    'Air Sweeper': 'defenses/air-sweeper/Building_HV_Air_Sweeper_level_7.png',
    'Hidden Tesla': 'defenses/hidden-tesla/Building_HV_Hidden_Tesla_level_15.png',
    'Bomb Tower': 'defenses/bomb-tower/Building_HV_Bomb_Tower_level_12.png',
    'X Bow': 'defenses/x-bow/Building_HV_X-Bow_level_11.png',
    'Inferno Tower': 'defenses/inferno-tower/Building_HV_Inferno_Tower_level_11.png',
    'Eagle Artillery': 'defenses/eagle-artillery/Building_HV_Eagle_Artillery_level_6.png',
    'Scattershot': 'defenses/scattershot/Building_HV_Scattershot_level_5.png',
    'Spell Tower': 'defenses/spell-tower/Building_HV_Spell_Tower_level_3_Rage_1_1.png', // Needs logic for type
    'Monolith': 'defenses/monolith/Building_HV_Monolith_level_4.png',
    'Wall': 'walls/Building_HV_Wall_level_18.png',
    'Builder Hut': 'builders-hut/Building_HV_Builder_Hut_level_7.png',
    'Clan Castle': 'clan-castle/Building_HV_Clan_Castle_level_13.png',
    'Blacksmith': 'blacksmith/Building_HV_Blacksmith_level_9.png',
    'Pet House': 'pet-house/Building_HV_Pet_House_level_11.png',
    'Barracks': 'army/barracks.png', // Assumes a generic image if not leveled
    'Dark Barracks': 'dark-barracks/Building_HV_Dark_Barracks_level_12.png',
    'Army Camp': 'army/army-camp.png',
    'Laboratory': 'laboratory/Building_HV_Laboratory_level_15.png',
    'Spell Factory': 'spell-factory/Building_HV_Spell_Factory_level_7.png',
    'Dark Spell Factory': 'dark-spell-factory/Building_HV_Dark_Spell_Factory_level_6.png',
    'Workshop': 'workshop/Building_HV_Workshop_level_7.png',
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
    'Archer': 'troops/elixir/archer.png',
    'Baby Dragon': 'troops/elixir/baby-dragon.png',
    'Balloon': 'troops/elixir/balloon.png',
    'Barbarian': 'troops/elixir/barbarian.png',
    'Dragon Rider': 'troops/elixir/dragon-rider.png',
    'Dragon': 'troops/elixir/dragon.png',
    'Electro Dragon': 'troops/elixir/electro-dragon.png',
    'Electro Titan': 'troops/elixir/electro-titan.png',
    'Giant': 'troops/elixir/giant.png',
    'Goblin': 'troops/elixir/goblin.png',
    'Healer': 'troops/elixir/healer.png',
    'Miner': 'troops/elixir/miner.png',
    'P.E.K.K.A': 'troops/elixir/pekka.png',
    'Root Rider': 'troops/elixir/root-rider.png',
    'Thrower': 'troops/elixir/thrower.png',
    'Wall Breaker': 'troops/elixir/wall-breaker.png',
    'Wizard': 'troops/elixir/wizard.png',
    'Yeti': 'troops/elixir/yeti.png',
    // Dark Elixir
    'Apprentice Warden': 'troops/dark-elixir/apprentice-warden.png',
    'Bowler': 'troops/dark-elixir/bowler.png',
    'Druid': 'troops/dark-elixir/druid.png',
    'Golem': 'troops/dark-elixir/golem.png',
    'Headhunter': 'troops/dark-elixir/head-hunter.png',
    'Hog Rider': 'troops/dark-elixir/hog-rider.png',
    'Ice Golem': 'troops/dark-elixir/ice-golem.png',
    'Lava Hound': 'troops/dark-elixir/lava-hound.png',
    'Minion': 'troops/dark-elixir/minion.png',
    'Valkyrie': 'troops/dark-elixir/valkyrie.png',
    'Witch': 'troops/dark-elixir/witch.png',
    // Spells
    'Bat Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Bat.png',
    'Earthquake Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Earthquake.png',
    'Haste Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Haste.png',
    'Poison Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Poison.png',
    'Skeleton Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Skeleton.png',
    'Overgrowth Spell': 'skins/spells/dark-elixir/Icon_HV_Dark_Spell_Overgrowth.png',
    'Clone Spell': 'skins/spells/elixir/Icon_HV_Spell_Clone.png',
    'Freeze Spell': 'skins/spells/elixir/Icon_HV_Spell_Freeze_new.png',
    'Healing Spell': 'skins/spells/elixir/Icon_HV_Spell_Heal.png',
    'Invisibility Spell': 'skins/spells/elixir/Icon_HV_Spell_Invisibility.png',
    'Jump Spell': 'skins/spells/elixir/Icon_HV_Spell_Jump.png',
    'Lightning Spell': 'skins/spells/elixir/Icon_HV_Spell_Lightning_new.png',
    'Rage Spell': 'skins/spells/elixir/Icon_HV_Spell_Rage.png',
    'Recall Spell': 'skins/spells/elixir/Icon_HV_Spell_Recall.png',
    'Revive Spell': 'skins/spells/elixir/Icon_HV_Spell_Revive.png',
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
    '/assets/hero/hero_equipment/login_carousel/BK_SideProfile.png',
    '/assets/hero/hero_equipment/login_carousel/AQ_SideProfile.png',
    '/assets/hero/hero_equipment/login_carousel/GW_SideProfile.png',
    '/assets/hero/hero_equipment/login_carousel/MP_SideProfile.png',
    '/assets/hero/hero_equipment/login_carousel/RC_SideProfile.png'
];

export const carouselImageAssets = [
  { src: '/assets/hero/hero_equipment/login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
  { src: '/assets/hero/hero_equipment/login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
  { src: '/assets/hero/hero_equipment/login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
  { src: '/assets/hero/hero_equipment/login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
  { src: '/assets/hero/hero_equipment/login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
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
