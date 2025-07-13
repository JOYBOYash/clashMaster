
// This file is the single source of truth for all image assets in the application.
// It statically imports every image to ensure they are correctly processed by the Next.js build system.
// Components should import the lookup functions from this file rather than constructing paths themselves.

import type { StaticImageData } from 'next/image';

// Default/Placeholder Image
import defaultImage from '../../public/_misc/default.png';

// UI Assets
import bkAvatar1 from '../../public/_avatars/bk_avatar.png';
import bkAvatar2 from '../../public/_avatars/bk_avatar2.png';
import mpAvatar1 from '../../public/_avatars/mp_avatar.png';
import mpAvatar2 from '../../public/_avatars/mp_avatar2.png';

import carouselBarb from '../../public/_login_carousel/barbarianKing-side-profile-login-carousel.png';
import carouselWarden from '../../public/_login_carousel/warden-side-profile-login-carousel.png';
import carouselPrince from '../../public/_login_carousel/prince-side-profile-login-carousel.png';

import skinChampionKing from '../../public/_skins/champion_king.png';
import skinPekkaKing from '../../public/_skins/pekka_king.png';
import skinIceQueen from '../../public/_skins/ice_queen.png';
import skinValkyrieQueen from '../../public/_skins/valkyrie_queen.png';
import skinPartyWarden from '../../public/_skins/party_warden.png';
import skinPrimalWarden from '../../public/_skins/primal_warden.png';
import skinGladiatorChampion from '../../public/_skins/gladiator_champion.png';
import skinShadowChampion from '../../public/_skins/shadow_champion.png';
import sceneryMagic from '../../public/_scenery/magic_theater.png';
import sceneryShadow from '../../public/_scenery/shadow_scenery.png';


// --- LOOKUP MAPS & FUNCTIONS ---
// The functions below are placeholders. Direct static imports in components are preferred.

export function getBuildingImagePath(name: string, level: number): StaticImageData {
    // This is a placeholder. In a real app with hundreds of images,
    // this would need a more sophisticated, but still static, mapping.
    return defaultImage;
}

export function getTroopImagePath(name: string): StaticImageData {
    // This is a placeholder.
    return defaultImage;
}


// --- STATIC ASSETS ---

export const heroAvatarAssets = [bkAvatar1, bkAvatar2, mpAvatar1, mpAvatar2];

export const carouselImageAssets = [
    { src: carouselBarb, alt: 'Barbarian King' },
    { src: carouselWarden, alt: 'Grand Warden' },
    { src: carouselPrince, alt: 'Minion Prince' },
];

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
