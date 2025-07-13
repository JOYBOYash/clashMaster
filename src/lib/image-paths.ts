
export const carouselImages = [
    { src: '/_login_carousel/barbarianKing-side-profile-login-carousel.png', alt: 'Barbarian King' },
    { src: '/_login_carousel/warden-side-profile-login-carousel.png', alt: 'Grand Warden' },
    { src: '/_login_carousel/prince-side-profile-login-carousel.png', alt: 'Minion Prince' },
];

export const heroAvatars = [
    '/_avatars/bk_avatar.png',
    '/_avatars/aq_avatar.png',
    '/_avatars/gw_avatar.png',
    '/_avatars/rc_avatar.png',
];

export const allSkins = {
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

export const otherFeaturedItems = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/magic_theater.png", hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/shadow_scenery.png", hint: "dark castle night" },
];

export const townHallImageMap: Record<number, string> = {
    1: 'Building_HV_Town_Hall_level_1.png',
    2: 'Building_HV_Town_Hall_level_2.png',
    3: 'Building_HV_Town_Hall_level_3.png',
    4: 'Building_HV_Town_Hall_level_4.png',
    5: 'Building_HV_Town_Hall_level_5.png',
    6: 'Building_HV_Town_Hall_level_6.png',
    7: 'Building_HV_Town_Hall_level_7.png',
    8: 'Building_HV_Town_Hall_level_8.png',
    9: 'Building_HV_Town_Hall_level_9.png',
    10: 'Building_HV_Town_Hall_level_10.png',
    11: 'Building_HV_Town_Hall_level_11.png',
    12: 'Building_HV_Town_Hall_level_12_1.png',
    13: 'Building_HV_Town_Hall_level_13_1.png',
    14: 'Building_HV_Town_Hall_level_14_1.png',
    15: 'Building_HV_Town_Hall_level_15_2.png',
    16: 'Building_HV_Town_Hall_level_16_1.png',
    17: 'Building_HV_Town_Hall_level_17_1.png',
};

export function getHallImagePath(base: 'home' | 'builder', level: number): string {
    if (base === 'home') {
        const imageName = townHallImageMap[level] || 'default.png';
        return `/_halls/town_hall/${imageName}`;
    }
    // Assuming builder hall names are simple, adjust if needed
    return `/_halls/builder_hall/Building_BH_Builder_Hall${level}.png`;
};

export function getBuildingImagePath(name: string, level: number): string {
    // Handle special cases first
    if (name === 'X Bow') {
      return `/_buildings/x-bow/Building_HV_X-Bow_level_${level}.png`;
    }
    if (name === 'Wall') {
        return `/_buildings/wall/Wall_level_${level}.png`
    }

    const folderName = name.replace(/\s+/g, '-').toLowerCase();
    const formattedName = name.replace(/\s+/g, '_');
    
    return `/_buildings/${folderName}/Building_HV_${formattedName}_level_${level}.png`;
};

const troopImageMap: Record<string, string> = {
    'Super Barbarian': 'Icon_HV_Super_Barbarian.png',
    'Super Archer': 'Icon_HV_Super_Archer.png',
    'Super Wall Breaker': 'Icon_HV_Super_Wall_Breaker.png',
    'Super Giant': 'Icon_HV_Super_Giant.png',
    'Sneaky Goblin': 'Icon_HV_Sneaky_Goblin.png',
    'Super Miner': 'Icon_HV_Super_Miner.png',
    'Rocket Balloon': 'Icon_HV_Rocket_Balloon.png',
    'Inferno Dragon': 'Icon_HV_Inferno_Dragon.png',
    'Super Valkyrie': 'Icon_HV_Super_Valkyrie.png',
    'Super Witch': 'Icon_HV_Super_Witch.png',
    'Ice Hound': 'Icon_HV_Ice_Hound.png',
    'Super Bowler': 'Icon_HV_Super_Bowler.png',
    'Super Dragon': 'Icon_HV_Super_Dragon.png',
    'Super Minion': 'Icon_HV_Super_Minion.png',
    'Super Wizard': 'Icon_HV_Super_Wizard.png',
    'Super Hog Rider': 'Icon_HV_Super_Hog_Rider.png',
};

export function getTroopImagePath(name: string): string {
    if (troopImageMap[name]) {
        return `/_troops/super/${troopImageMap[name]}`;
    }
    const formattedName = name.replace(/\s+/g, '_').replace(/\./g, '');
    return `/_troops/${formattedName}.png`;
};
