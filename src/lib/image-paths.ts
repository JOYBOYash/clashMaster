/**
 * @fileOverview Centralized manifest for all static image assets.
 * 
 * This file provides functions that return root-relative string paths
 * to assets in the `public` directory. This is the correct way to handle
 * a large number of static assets in Next.js without using static imports,
 * which cannot resolve modules from the `public` folder.
 * 
 * The `unoptimized` prop must be used on any `next/image` component
 * that consumes these string paths.
 */

const createPathMap = (basePath: string, items: string[]): Record<string, string> => {
    const map: Record<string, string> = {};
    items.forEach(item => {
        // Use the item name directly, replacing underscores with spaces and removing the extension.
        // This preserves casing.
        const key = item.replace('.png', '').replace(/_/g, ' ');
        map[key] = `${basePath}/${item}`;
    });
    return map;
};

// --- Town/Builder Hall Paths ---
export const townHallImageMap: Record<number, string> = {
    1: '/assets/_town-halls/Building_HV_Town_Hall_level_1.png',
    2: '/assets/_town-halls/Building_HV_Town_Hall_level_2.png',
    3: '/assets/_town-halls/Building_HV_Town_Hall_level_3.png',
    4: '/assets/_town-halls/Building_HV_Town_Hall_level_4.png',
    5: '/assets/_town-halls/Building_HV_Town_Hall_level_5.png',
    6: '/assets/_town-halls/Building_HV_Town_Hall_level_6.png',
    7: '/assets/_town-halls/Building_HV_Town_Hall_level_7.png',
    8: '/assets/_town-halls/Building_HV_Town_Hall_level_8.png',
    9: '/assets/_town-halls/Building_HV_Town_Hall_level_9.png',
    10: '/assets/_town-halls/Building_HV_Town_Hall_level_10.png',
    11: '/assets/_town-halls/Building_HV_Town_Hall_level_11.png',
    12: '/assets/_town-halls/Building_HV_Town_Hall_level_12_1.png',
    13: '/assets/_town-halls/Building_HV_Town_Hall_level_13_1.png',
    14: '/assets/_town-halls/Building_HV_Town_Hall_level_14_1.png',
    15: '/assets/_town-halls/Building_HV_Town_Hall_level_15_2.png',
    16: '/assets/_town-halls/Building_HV_Town_Hall_level_16_1.png',
};

// --- Building Image Paths ---
// We create a map where the key is the building name as it appears in game data (e.g., "Archer Tower")
const buildingImageFiles = ['Air Defense.png', 'Air Sweeper.png', 'Archer Queen Altar.png', 'Archer Tower.png', 'Army Camp.png', 'Barbarian King Altar.png', 'Barracks.png', 'Blacksmith.png', 'Bomb.png', 'Bomb Tower.png', 'Builder Hut.png', 'Cannon.png', 'Clan Castle.png', 'Dark Barracks.png', 'Dark Elixir Drill.png', 'Dark Elixir Storage.png', 'Dark Spell Factory.png', 'Eagle Artillery.png', 'Elixir Collector.png', 'Elixir Storage.png', 'Giant Bomb.png', 'Gold Mine.png', 'Gold Storage.png', 'Grand Warden Altar.png', 'Hidden Tesla.png', 'Inferno Tower.png', 'Laboratory.png', 'Monolith.png', 'Mortar.png', 'Pet House.png', 'Royal Champion Altar.png', 'Scattershot.png', 'Seeking Air Mine.png', 'Skeleton Trap.png', 'Spell Factory.png', 'Spell Tower.png', 'Spring Trap.png', 'Tornado Trap.png', 'Wall.png', 'Workshop.png', 'Wizard Tower.png', 'X-Bow.png'];
const buildingImageMap = createPathMap('/_buildings', buildingImageFiles);

// --- Troop Image Paths ---
// Keys are the troop names as they appear in game data (e.g., "Baby Dragon")
const troopImageFiles = ['Apprentice Warden.png', 'Archer.png', 'Baby Dragon.png', 'Balloon.png', 'Barbarian.png', 'Bat Spell.png', 'Bowler.png', 'Clone Spell.png', 'Dragon.png', 'Earthquake Spell.png', 'Electro Titan.png', 'Freeze Spell.png', 'Giant.png', 'Goblin.png', 'Golem.png', 'Haste Spell.png', 'Headhunter.png', 'Healer.png', 'Healing Spell.png', 'Hog Rider.png', 'Ice Golem.png', 'Invisibility Spell.png', 'Jump Spell.png', 'Lava Hound.png', 'Lightning Spell.png', 'Miner.png', 'Minion.png', 'P.E.K.K.A.png', 'Poison Spell.png', 'Rage Spell.png', 'Recall Spell.png', 'Root Rider.png', 'Skeleton Spell.png', 'Valkyrie.png', 'Wall Breaker.png', 'Witch.png', 'Wizard.png'];
const troopImageMap = createPathMap('/_troops', troopImageFiles);

// --- UI Asset Paths ---
export const heroAvatarAssets = [
    './assets/_avatars/bk_avatar.png',
    './assets/_avatars/bk_avatar2.png',
    './assets/_avatars/mp_avatar.png',
    './assets/_avatars/mp_avatar2.png',
];

export const carouselImageAssets = [
  { src: '@/public/assets/_login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
    { src: '@/src/assets/_login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
    { src: '../assets/_login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
    { src: '../assets/_login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
    { src: '../assets/_login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
];

export type FeaturedItem = {
    title: string;
    category: string;
    price: string;
    availability: string;
    imageUrl: string;
    hint: string;
};

const skinAssets: Record<string, FeaturedItem[]> = {
  'Barbarian King': [
    { title: 'Champion King', category: 'Hero Skin', price: '1500 Gems', availability: 'Shop', imageUrl: '/_skins/champion_king.png', hint: 'gold king armor' },
    { title: 'P.E.K.K.A King', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/_skins/pekka_king.png', hint: 'robot king sword' },
  ],
  'Archer Queen': [
    { title: 'Ice Queen', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: '/_skins/ice_queen.png', hint: 'ice queen crown' },
    { title: 'Valkyrie Queen', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/_skins/valkyrie_queen.png', hint: 'warrior queen axe' },
  ],
  'Grand Warden': [
    { title: 'Party Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/_skins/party_warden.png', hint: 'dj wizard staff' },
    { title: 'Primal Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/_skins/primal_warden.png', hint: 'shaman wizard staff' },
  ],
  'Royal Champion': [
    { title: 'Gladiator Champion', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: '/_skins/gladiator_champion.png', hint: 'gladiator champion spear' },
    { title: 'Shadow Champion', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: '/_skins/shadow_champion.png', hint: 'ninja champion dark' },
  ],
};

const otherFeaturedItemAssets: FeaturedItem[] = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/magic_theater.png", hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/shadow_scenery.png", hint: "dark castle night" },
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

// --- Lookup Functions ---
const defaultImagePath = '/_misc/default.png';

export const getHallImagePath = (base: 'home' | 'builder', level: number): string => {
    if (base === 'home') {
        return townHallImageMap[level] || defaultImagePath;
    }
    // Placeholder for builder hall images
    return defaultImagePath;
};

// Simple lookup, no case conversion
export const getBuildingImagePath = (name: string): string => {
  // Special case for X-Bow which has a dash in the filename
  if (name === 'X Bow') {
      return buildingImageMap['X-Bow'] || defaultImagePath;
  }
  return buildingImageMap[name] || defaultImagePath;
};

// Simple lookup, no case conversion
export const getTroopImagePath = (name: string): string => {
    // Special case for P.E.K.K.A. which has periods in the filename
  if (name === 'P.E.K.K.A') {
      return troopImageMap['P.E.K.K.A.'] || defaultImagePath;
  }
  return troopImageMap[name] || defaultImagePath;
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
