
// This file centralizes the logic for generating image paths.
// By convention, all image paths returned by these functions are root-relative
// strings that point to assets in the `public` folder.

// Town Halls
export function getHallImagePath(base: 'home' | 'builder', level: number): string {
    if (base === 'home') {
        const imageName = `Building_HV_Town_Hall_level_${level}.png`;
        // Handle special cases for levels 12-16 from the file names provided.
        switch (level) {
            case 12: return `/_town-halls/Building_HV_Town_Hall_level_12_1.png`;
            case 13: return `/_town-halls/Building_HV_Town_Hall_level_13_1.png`;
            case 14: return `/_town-halls/Building_HV_Town_Hall_level_14_1.png`;
            case 15: return `/_town-halls/Building_HV_Town_Hall_level_15_2.png`;
            case 16: return `/_town-halls/Building_HV_Town_Hall_level_16_1.png`;
            default: return `/_town-halls/${imageName}`;
        }
    }
    // TODO: Add builder hall images when available
    return '/_misc/default.png';
};

// Buildings
export function getBuildingImagePath(name: string, level: number): string {
    const formattedName = name.replace(/\s+/g, '-').toLowerCase();
    let imageName = name.replace(/\s/g, '_');

    if (name === 'X-Bow') imageName = 'X-Bow';
    if (name === 'Wall') {
        return `/_buildings/wall/Wall_level_${level}.png`;
    }
    
    // Default path structure
    return `/_buildings/${formattedName}/Building_HV_${imageName}_level_${level}.png`;
}

// Troops & Spells
export function getTroopImagePath(name: string): string {
    const isSuperTroop = name.startsWith('Super');
    if (isSuperTroop) {
        const imageName = name === "Super Wall Breaker" ? "Icon_HV_Super_Wall_Breaker" : `Icon_HV_Super_${name.replace('Super ', '')}`;
        return `/_troops/super/${imageName}.png`;
    }
    const imageName = name.replace(/\s/g, '_');
    return `/_troops/${imageName}.png`;
}

// UI Assets (Carousel, Avatars, Skins, Scenery)
export const carouselImageAssets = [
    { src: '/_login_carousel/barbarianKing-side-profile-login-carousel.png', alt: 'Barbarian King' },
    { src: '/_login_carousel/warden-side-profile-login-carousel.png', alt: 'Grand Warden' },
    { src: '/_login_carousel/prince-side-profile-login-carousel.png', alt: 'Minion Prince' },
];

export const heroAvatarAssets = [
    '/_avatars/bk_avatar.png',
    '/_avatars/bk_avatar2.png',
    '/_avatars/mp_avatar.png',
    '/_avatars/mp_avatar2.png',
];

export const skinAssets = {
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

export const otherFeaturedItemAssets = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/magic_theater.png", hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: "/_scenery/shadow_scenery.png", hint: "dark castle night" },
];
