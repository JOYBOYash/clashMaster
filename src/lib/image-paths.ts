
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

// DEPRECATED - These maps are no longer the primary source for building/troop images
// The paths are now generated dynamically in the components themselves.
// Keeping them here temporarily to avoid breaking any other potential dependencies.
export const townHallImageMap: Record<number, string> = {};
export const builderHallImageMap: Record<number, string> = {};
export const buildingImageMap: Record<string, string> = {};
export const troopImageMap: Record<string, string> = {};
