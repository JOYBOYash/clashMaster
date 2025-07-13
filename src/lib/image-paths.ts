// This file is the single source of truth for all image assets in the application.
// It statically imports every image to ensure they are correctly processed by the Next.js build system.
// Components should import the lookup functions from this file rather than constructing paths themselves.

import { StaticImageData } from 'next/image';

// Default/Placeholder Image
import defaultImage from '@/assets/_misc/default.png';

// Town Hall Images
import th1 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_1.png';
import th2 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_2.png';
import th3 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_3.png';
import th4 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_4.png';
import th5 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_5.png';
import th6 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_6.png';
import th7 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_7.png';
import th8 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_8.png';
import th9 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_9.png';
import th10 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_10.png';
import th11 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_11.png';
import th12 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_12_1.png';
import th13 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_13_1.png';
import th14 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_14_1.png';
import th15 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_15_2.png';
import th16 from '@/assets/_halls/town_hall/Building_HV_Town_Hall_level_16_1.png';

const townHallImageMap: Record<number, StaticImageData> = {
    1: th1, 2: th2, 3: th3, 4: th4, 5: th5, 6: th6, 7: th7, 8: th8, 9: th9, 10: th10, 11: th11, 12: th12, 13: th13, 14: th14, 15: th15, 16: th16
};

// Builder Hall Images (using placeholders for now)
const builderHallImageMap: Record<number, StaticImageData> = {
    1: defaultImage, 2: defaultImage, 3: defaultImage, 4: defaultImage, 5: defaultImage,
    6: defaultImage, 7: defaultImage, 8: defaultImage, 9: defaultImage, 10: defaultImage
};

export function getHallImagePath(base: 'home' | 'builder', level: number): StaticImageData {
    if (base === 'home') {
        return townHallImageMap[level] || defaultImage;
    }
    return builderHallImageMap[level] || defaultImage;
}

// Building Images
// This is a large map and would be expanded to include all buildings and levels.
// For now, we'll create a small example and a robust lookup function.
const buildingImageMap: Record<string, Record<number, StaticImageData>> = {
    'Army Camp': {
        13: require('@/assets/_buildings/army-camp/Building_HV_Army_Camp_level_13.png').default,
        // ... other levels would be imported here
    },
    'Wall': {
        1: require('@/assets/_buildings/wall/Wall_level_1.png').default,
        2: require('@/assets/_buildings/wall/Wall_level_2.png').default,
        // ... and so on
    },
    // ... other buildings
};

// This function dynamically requires the image at call time. It's a compromise
// between full static imports and dynamic strings. This should be supported.
export function getBuildingImagePath(name: string, level: number): StaticImageData {
    const formattedName = name.replace(/\s+/g, '-').toLowerCase();
    const imageName = name.replace(/\s/g, '_');
    try {
        if (name === 'Wall') {
             return require(`@/assets/_buildings/wall/Wall_level_${level}.png`).default;
        }
        if (name === 'X-Bow') {
            return require(`@/assets/_buildings/x-bow/Building_HV_X-Bow_level_${level}.png`).default;
        }
        return require(`@/assets/_buildings/${formattedName}/Building_HV_${imageName}_level_${level}.png`).default;
    } catch (e) {
        return defaultImage;
    }
}


// Troop & Spell Icons
const troopImageMap: Record<string, StaticImageData> = {
    'Barbarian': require('@/assets/_troops/Barbarian.png').default,
    'Archer': require('@/assets/_troops/Archer.png').default,
    // Super troops
    'Super Barbarian': require('@/assets/_troops/super/Icon_HV_Super_Barbarian.png').default,
    'Super Archer': require('@/assets/_troops/super/Icon_HV_Super_Archer.png').default,
    'Super Wall Breaker': require('@/assets/_troops/super/Icon_HV_Super_Wall_Breaker.png').default,
    //... add all other troops
};

export function getTroopImagePath(name: string): StaticImageData {
    // This is a simplified example. We'd flesh this out with all troop names.
    const troopKey = name.replace(/\s/g, '');
    const isSuper = name.startsWith('Super');
    const formattedName = isSuper ? name.replace(' ', '_') : name;
    
    try {
        if (isSuper) {
            const superName = name.replace('Super ', '');
            if (superName === 'Wall Breaker') {
                return require(`@/assets/_troops/super/Icon_HV_Super_Wall_Breaker.png`).default;
            }
            return require(`@/assets/_troops/super/Icon_HV_Super_${superName}.png`).default;
        }
        return require(`@/assets/_troops/${name.replace(/\s/g, '_')}.png`).default;
    } catch (e) {
        return defaultImage;
    }
}

// UI Assets
import bkAvatar1 from '@/assets/_avatars/bk_avatar.png';
import bkAvatar2 from '@/assets/_avatars/bk_avatar2.png';
import mpAvatar1 from '@/assets/_avatars/mp_avatar.png';
import mpAvatar2 from '@/assets/_avatars/mp_avatar2.png';
export const heroAvatarAssets = [bkAvatar1, bkAvatar2, mpAvatar1, mpAvatar2];


import carouselBarb from '@/assets/_login_carousel/barbarianKing-side-profile-login-carousel.png';
import carouselWarden from '@/assets/_login_carousel/warden-side-profile-login-carousel.png';
import carouselPrince from '@/assets/_login_carousel/prince-side-profile-login-carousel.png';
export const carouselImageAssets = [
    { src: carouselBarb, alt: 'Barbarian King' },
    { src: carouselWarden, alt: 'Grand Warden' },
    { src: carouselPrince, alt: 'Minion Prince' },
];

import skinChampionKing from '@/assets/_skins/champion_king.png';
import skinPekkaKing from '@/assets/_skins/pekka_king.png';
import skinIceQueen from '@/assets/_skins/ice_queen.png';
import skinValkyrieQueen from '@/assets/_skins/valkyrie_queen.png';
import skinPartyWarden from '@/assets/_skins/party_warden.png';
import skinPrimalWarden from '@/assets/_skins/primal_warden.png';
import skinGladiatorChampion from '@/assets/_skins/gladiator_champion.png';
import skinShadowChampion from '@/assets/_skins/shadow_champion.png';
import sceneryMagic from '@/assets/_scenery/magic_theater.png';
import sceneryShadow from '@/assets/_scenery/shadow_scenery.png';


export const skinAssets = {
  'Barbarian King': [
    { title: 'Champion King', category: 'Hero Skin', price: '1500 Gems', availability: 'Shop', imageUrl: skinChampionKing, hint: 'gold king armor' },
    { title: 'P.E.K.K.A King', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: skinPekkaKing, hint: 'robot king sword' },
  ],
  'Archer Queen': [
    { title: 'Ice Queen', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: skinIceQueen, hint: 'ice queen crown' },
    { title: 'Valkyrie Queen', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: skinValkyrieQueen, hint: 'warrior queen axe' },
  ],
  'Grand Warden': [
    { title: 'Party Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: skinPartyWarden, hint: 'dj wizard staff' },
    { title: 'Primal Warden', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: skinPrimalWarden, hint: 'shaman wizard staff' },
  ],
  'Royal Champion': [
    { title: 'Gladiator Champion', category: 'Hero Skin', price: '1500 Gems', availability: 'Limited', imageUrl: skinGladiatorChampion, hint: 'gladiator champion spear' },
    { title: 'Shadow Champion', category: 'Hero Skin', price: 'Gold Pass', availability: 'Past Season', imageUrl: skinShadowChampion, hint: 'ninja champion dark' },
  ],
};

export const otherFeaturedItemAssets = [
  { title: "Magic Theater", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: sceneryMagic, hint: "magic theater stage" },
  { title: "Shadow Scenery", category: "Scenery", price: '$6.99', availability: 'Shop', imageUrl: sceneryShadow, hint: "dark castle night" },
];
