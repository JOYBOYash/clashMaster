
/**
 * @fileOverview Centralized manifest for all static image assets.
 */

const defaultImagePath = 'https://placehold.co/128x128.png';

const nameToPathMap: Record<string, string> = {
    // Defenses
    'Cannon': 'defenses/cannon',
    'Archer Tower': 'defenses/archer-tower',
    'Mortar': 'defenses/mortar',
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
    "Builder's Hut": 'buildings/builders-hut',
    'Wall': 'buildings/walls',
};


export const getBuildingImagePathByLevel = (name: string, level: number): string => {
    const basePath = nameToPathMap[name];
    if (!basePath) return defaultImagePath;

    let fileName = '';
    if (name === 'Town Hall') {
        fileName = `Town_Hall_${level}.png`;
    } else if (name === 'Wall') {
        fileName = `Wall_${level}.png`;
    } else {
        fileName = `${name.replace(/'/g, '').replace(/ /g, '_')}_${level}.png`;
    }
    
    // Fallback for names that might not match the pattern exactly but are in the folder
    // This isn't perfect but handles some cases.
    return `/assets/${basePath}/${fileName}`;
};

export const getHallImagePath = (base: 'home' | 'builder', level: number): string => {
    if (base === 'home') {
        return getBuildingImagePathByLevel('Town Hall', level);
    }
    return `https://placehold.co/160x160.png`; 
};

export const getBuildingImagePath = (name: string): string => {
    return getBuildingImagePathByLevel(name, 1);
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
    'Apprentice Warden': '/assets/_troops/dark-elixir/apprentice-warden.png',
    'Bowler': '/assets/_troops/dark-elixir/bowler.png',
    'Druid': '/assets/_troops/dark-elixir/druid.png',
    'Golem': '/assets/_troops/dark-elixir/golem.png',
    'Headhunter': '/assets/_troops/dark-elixir/head-hunter.png',
    'Hog Rider': '/assets/_troops/dark-elixir/hog-rider.png',
    'Ice Golem': '/assets/_troops/dark-elixir/ice-golem.png',
    'Lava Hound': '/assets/_troops/dark-elixir/lava-hound.png',
    'Minion': '/assets/_troops/dark-elixir/minion.png',
    'Valkyrie': '/assets/_troops/dark-elixir/valkyrie.png',
    'Witch': '/assets/_troops/dark-elixir/witch.png',
    // Spells
    'Bat Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Bat.png',
    'Earthquake Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Earthquake.png',
    'Haste Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Haste.png',
    'Poison Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Poison.png',
    'Skeleton Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Skeleton.png',
    'Overgrowth Spell': '/assets/_spells/dark-elixir/Icon_HV_Dark_Spell_Overgrowth.png',
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
        return path;
    }
    return defaultImagePath;
};


// --- UI Asset Paths ---
export const heroAvatarAssets = [
    '/assets/_avatars/bk-avatar.png',
   '/assets/_avatars/bk-avatar2.png',
    '/assets/_avatars/mp-avatar.png',
  '/assets/_avatars/mp-avatar2.png',
  '/assets/_avatars/gw-avatar.png',
  '/assets/_avatars/aq-avatar.png',
  '/assets/_avatars/rc-avatar.png',
];

export const carouselImageAssets = [
  { src: '/assets/_login_carousel/BK_SideProfile.png', alt: '/assets/_Barbarian King' },
  { src: '/assets/_login_carousel/AQ_SideProfile.png', alt: '/assets/_Archer Queen' },
  { src: '/assets/_login_carousel/GW_SideProfile.png', alt: '/assets/_Grand Warden' },
  { src: '/assets/_login_carousel/MP_SideProfile.png', alt: '/assets/_Minion Prince' },
  { src: '/assets/_login_carousel/RC_SideProfile.png', alt: '/assets/_Royal Champion' },
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
    { title: '/assets/_Champion King', category: '/assets/_Hero Skin', price: '/assets/_1500 Gems', availability: '/assets/_Shop', imageUrl: '/assets/skins/champion_king.png', hint: '/assets/_gold king armor' },
    { title: '/assets/_P.E.K.K.A King', category: '/assets/_Hero Skin', price: '/assets/_Gold Pass', availability: '/assets/_Past Season', imageUrl: '/assets/skins/pekka_king.png', hint: '/assets/_robot king sword' },
  ],
  'Archer Queen': [
    { title: '/assets/_Ice Queen', category: '/assets/_Hero Skin', price: '/assets/_1500 Gems', availability: '/assets/_Limited', imageUrl: '/assets/skins/ice_queen.png', hint: '/assets/_ice queen crown' },
    { title: '/assets/_Valkyrie Queen', category: '/assets/_Hero Skin', price: '/assets/_Gold Pass', availability: '/assets/_Past Season', imageUrl: '/assets/skins/valkyrie_queen.png', hint: '/assets/_warrior queen axe' },
  ],
  'Grand Warden': [
    { title: '/assets/_Party Warden', category: '/assets/_Hero Skin', price: '/assets/_Gold Pass', availability: '/assets/_Past Season', imageUrl: '/assets/skins/party_warden.png', hint: '/assets/_dj wizard staff' },
    { title: '/assets/_Primal Warden', category: '/assets/_Hero Skin', price: '/assets/_Gold Pass', availability: '/assets/_Past Season', imageUrl: '/assets/skins/primal_warden.png', hint: '/assets/_shaman wizard staff' },
  ],
  'Royal Champion': [
    { title: '/assets/_Gladiator Champion', category: '/assets/_Hero Skin', price: '/assets/_1500 Gems', availability: '/assets/_Limited', imageUrl: '/assets/skins/gladiator_champion.png', hint: '/assets/_gladiator champion spear' },
    { title: '/assets/_Shadow Champion', category: '/assets/_Hero Skin', price: '/assets/_Gold Pass', availability: '/assets/_Past Season', imageUrl: '/assets/skins/shadow_champion.png', hint: '/assets/_ninja champion dark' },
  ],
};

const otherFeaturedItemAssets: FeaturedItem[] = [
  { title: "Magic Theater", category: "Scenery", price: '/assets/_$6.99', availability: '/assets/_Shop', imageUrl: "/assets/scenery/magic_theater.png", hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '/assets/_$6.99', availability: '/assets/_Shop', imageUrl: "/assets/scenery/shadow_scenery.png", hint: "dark castle night" },
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
