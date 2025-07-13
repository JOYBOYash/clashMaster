
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
        const key = item.replace('.png', '').replace(/_/g, ' ').toLowerCase();
        map[key] = `${basePath}/${item}`;
    });
    return map;
};

// --- Town/Builder Hall Paths ---
export const townHallImageMap: Record<number, string> = {
    1: '/_halls/town_hall/Building_HV_Town_Hall_level_1.png',
    2: '/_halls/town_hall/Building_HV_Town_Hall_level_2.png',
    3: '/_halls/town_hall/Building_HV_Town_Hall_level_3.png',
    4: '/_halls/town_hall/Building_HV_Town_Hall_level_4.png',
    5: '/_halls/town_hall/Building_HV_Town_Hall_level_5.png',
    6: '/_halls/town_hall/Building_HV_Town_Hall_level_6.png',
    7: '/_halls/town_hall/Building_HV_Town_Hall_level_7.png',
    8: '/_halls/town_hall/Building_HV_Town_Hall_level_8.png',
    9: '/_halls/town_hall/Building_HV_Town_Hall_level_9.png',
    10: '/_halls/town_hall/Building_HV_Town_Hall_level_10.png',
    11: '/_halls/town_hall/Building_HV_Town_Hall_level_11.png',
    12: '/_halls/town_hall/Building_HV_Town_Hall_level_12_1.png',
    13: '/_halls/town_hall/Building_HV_Town_Hall_level_13_1.png',
    14: '/_halls/town_hall/Building_HV_Town_Hall_level_14_1.png',
    15: '/_halls/town_hall/Building_HV_Town_Hall_level_15_2.png',
    16: '/_halls/town_hall/Building_HV_Town_Hall_level_16_1.png',
};

// --- Building Image Paths ---
const buildingImageFiles = ['air_defense.png', 'air_sweeper.png', 'archer_queen_altar.png', 'archer_tower.png', 'army_camp.png', 'barbarian_king_altar.png', 'barracks.png', 'blacksmith.png', 'bomb.png', 'bomb_tower.png', 'builders_hut.png', 'cannon.png', 'clan_castle.png', 'dark_barracks.png', 'dark_elixir_drill.png', 'dark_elixir_storage.png', 'dark_spell_factory.png', 'eagle_artillery.png', 'elixir_collector.png', 'elixir_storage.png', 'giant_bomb.png', 'gold_mine.png', 'gold_storage.png', 'grand_warden_altar.png', 'hidden_tesla.png', 'inferno_tower.png', 'laboratory.png', 'monolith.png', 'mortar.png', 'pet_house.png', 'royal_champion_altar.png', 'scattershot.png', 'seeking_air_mine.png', 'skeleton_trap.png', 'spell_factory.png', 'spell_tower.png', 'spring_trap.png', 'tornado_trap.png', 'wall.png', 'workshop.png', 'wizard_tower.png', 'x-bow.png'];
const buildingImageMap = createPathMap('/_buildings', buildingImageFiles);

// --- Troop Image Paths ---
const troopImageFiles = ['apprentice_warden.png', 'archer.png', 'baby_dragon.png', 'balloon.png', 'barbarian.png', 'bat_spell.png', 'bowler.png', 'clone_spell.png', 'dragon.png', 'earthquake_spell.png', 'electro_titan.png', 'freeze_spell.png', 'giant.png', 'goblin.png', 'golem.png', 'haste_spell.png', 'headhunter.png', 'healer.png', 'healing_spell.png', 'hog_rider.png', 'ice_golem.png', 'invisibility_spell.png', 'jump_spell.png', 'lava_hound.png', 'lightning_spell.png', 'miner.png', 'minion.png', 'pekka.png', 'poison_spell.png', 'rage_spell.png', 'recall_spell.png', 'root_rider.png', 'skeleton_spell.png', 'valkyrie.png', 'wall_breaker.png', 'witch.png', 'wizard.png'];
const troopImageMap = createPathMap('/_troops', troopImageFiles);

// --- UI Asset Paths ---
export const heroAvatarAssets = [
    '/_avatars/bk_avatar.png',
    '/_avatars/bk_avatar2.png',
    '/_avatars/mp_avatar.png',
    '/_avatars/mp_avatar2.png',
];

export const carouselImageAssets = [
    { src: '/_login_carousel/barbarianKing-side-profile-login-carousel.png', alt: 'Barbarian King' },
    { src: '/_login_carousel/warden-side-profile-login-carousel.png', alt: 'Grand Warden' },
    { src: '/_login_carousel/prince-side-profile-login-carousel.png', alt: 'Minion Prince' },
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

export const getBuildingImagePath = (name: string): string => {
  return buildingImageMap[name.toLowerCase().replace(/ /g, '-')] || defaultImagePath;
};

export const getTroopImagePath = (name: string): string => {
  return troopImageMap[name.toLowerCase()] || defaultImagePath;
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
