
/**
 * @fileOverview Centralized manifest for all static image assets.
 */

const defaultImagePath = 'https://placehold.co/128x128.png';

// --- NEW DYNAMIC IMAGE FUNCTIONS ---

const nameToPathMap: Record<string, string> = {
    // Defenses
    'Cannon': 'defenses/cannon',
    'Archer Tower': 'defenses/archer-tower',
    'Mortar': 'defenses/multi-mortar', // Note: Folder is multi-mortar
    'Air Defense': 'defenses/air-defense',
    'Wizard Tower': 'defenses/wizard-tower',
    'Air Sweeper': 'defenses/air-sweeper',
    'Hidden Tesla': 'defenses/hidden-tesla',
    'Bomb Tower': 'defenses/bomb-tower',
    'X-Bow': 'defenses/x-bow',
    'Inferno Tower': 'defenses/inferno-tower',
    'Eagle Artillery': 'defenses/eagle-artillery',
    'Scattershot': 'defenses/scattershot',
    'Spell Tower': 'defenses/spell-tower',
    'Monolith': 'defenses/monolith',
    'Ricochet Cannon': 'defenses/ricochet-cannon',
    'Multi-Archer Tower': 'defenses/multi-archer-tower',
    
    // Resources
    'Gold Mine': 'resources/collectors/gold-mines',
    'Elixir Collector': 'resources/collectors/elixir-collector',
    'Dark Elixir Drill': 'resources/collectors/dark-elixir-drills',
    'Gold Storage': 'resources/storages/gold-storage',
    'Elixir Storage': 'resources/storages/elixir-storage',
    'Dark Elixir Storage': 'resources/storages/dark-elixir-storage',

    // Army
    'Army Camp': 'buildings/army-camp',
    'Barracks': 'buildings/barracks',
    'Dark Barracks': 'buildings/dark-barracks',
    'Laboratory': 'buildings/laboratory',
    'Spell Factory': 'buildings/spell-factory',
    'Dark Spell Factory': 'buildings/dark-spell-factory',
    'Workshop': 'buildings/workshop',
    'Pet House': 'buildings/pet-house',
    'Blacksmith': 'buildings/blacksmith',

    // Other
    'Town Hall': 'town-halls',
    'Clan Castle': 'buildings/clan-castle',
    'Builder\'s Hut': 'buildings/builders-hut',
    'Wall': 'walls',
};


export const getBuildingImagePathByLevel = (name: string, level: number): string => {
    const basePath = nameToPathMap[name];
    if (!basePath) return defaultImagePath;

    // Special file name cases from JSON data
    let fileName = `Building_HV_${name.replace(/'/g, '')}_level_${String(level).padStart(2, '0')}.png`;
    if (name === 'Town Hall') {
        if (level === 12) fileName = 'Building_HV_Town_Hall_level_12_1.png';
        else if (level === 13) fileName = 'Building_HV_Town_Hall_level_13_1.png';
        else if (level === 14) fileName = 'Building_HV_Town_Hall_level_14_1.png';
        else if (level === 15) fileName = 'Building_HV_Town_Hall_level_15_2.png';
        else if (level === 16) fileName = 'Building_HV_Town_Hall_level_16_1.png';
        else if (level === 17) fileName = 'Building_HV_Town_Hall_level_17_1.png';
        else fileName = `Building_HV_Town_Hall_level_${level}.png`;
    } else if (name === 'Wall') {
        fileName = `Building_HV_Wall_level_${String(level).padStart(2, '0')}.png`;
    } else if (name === 'X-Bow') {
        fileName = `Building_HV_X-Bow_level_${level}.png`;
    } else if (name === 'Mortar') {
         fileName = `Building_HV_Mortar_level_${level}.png`;
    } else if (name === 'Builder\'s Hut') {
        fileName = `Building_HV_Builder_Hut_level_${level}.png`;
    } else if (name === 'Blacksmith') {
        const fileLevel = Math.ceil(level/2);
        fileName = `Building_HV_Blacksmith_level_${fileLevel}&${fileLevel === 4 ? 8 : fileLevel*2}.png`;
        if (level === 9) fileName = 'Building_HV_Blacksmith_level_9.png'
    } else {
        // Generic pattern for most buildings
        const cleanName = name.replace(/'/g, '').replace(/ /g, '_');
        fileName = `Building_HV_${cleanName}_level_${level}.png`;
    }

    return `/assets/${basePath}/${fileName}`;
};

// --- OLD FUNCTIONS (to be refactored or removed) ---

export const getHallImagePath = (base: 'home' | 'builder', level: number): string => {
    if (base === 'home') {
        return getBuildingImagePathByLevel('Town Hall', level);
    }
    return `https://placehold.co/160x160.png`; 
};

export const getBuildingImagePath = (name: string): string => {
    // This function is now simplified, as level-specific paths are preferred.
    // We return a default or a generic path.
    return getBuildingImagePathByLevel(name, 1); // Default to level 1 for generic list views
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
    'Bat Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Bat.png',
    'Earthquake Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Earthquake.png',
    'Haste Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Haste.png',
    'Poison Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Poison.png',
    'Skeleton Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Skeleton.png',
    'Overgrowth Spell': 'spells/dark-elixir/Icon_HV_Dark_Spell_Overgrowth.png',
    'Clone Spell': 'spells/elixir/Icon_HV_Spell_Clone.png',
    'Freeze Spell': 'spells/elixir/Icon_HV_Spell_Freeze_new.png',
    'Healing Spell': 'spells/elixir/Icon_HV_Spell_Heal.png',
    'Invisibility Spell': 'spells/elixir/Icon_HV_Spell_Invisibility.png',
    'Jump Spell': 'spells/elixir/Icon_HV_Spell_Jump.png',
    'Lightning Spell': 'spells/elixir/Icon_HV_Spell_Lightning_new.png',
    'Rage Spell': 'spells/elixir/Icon_HV_Spell_Rage.png',
    'Recall Spell': 'spells/elixir/Icon_HV_Spell_Recall.png',
    'Revive Spell': 'spells/elixir/Icon_HV_Spell_Revive.png',
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
    '/assets/hero/avatars/bk-avatar.png',
   '/assets/hero/avatars/bk-avatar2.png',
    '/assets/hero/avatars/mp-avatar.png',
  '/assets/hero/avatars/mp-avatar2.png',
];

export const carouselImageAssets = [
  { src: '/assets/hero/login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
  { src: '/assets/hero/login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
  { src: '/assets/hero/login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
  { src: '/assets/hero/login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
  { src: '/assets/hero/login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
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
