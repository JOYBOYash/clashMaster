
/**
 * @fileOverview Centralized manifest for all static image assets.
 */

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
  { src: '/assets/_login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
  { src: '/assets/_login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
  { src: '/assets/_login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
  { src: '/assets/_login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
  { src: '/assets/_login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
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
