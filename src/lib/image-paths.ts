
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

export const appLogoPath = '/assets/pb2.png';
export const separator = '/assets/separator.png';
export const probuilderAvatar = '/assets/pb.png';


export const carouselImageAssets = [
  { src: '/assets/_login_carousel/BK_SideProfile.png', alt: 'Barbarian King' },
  { src: '/assets/_login_carousel/AQ_SideProfile.png', alt: 'Archer Queen' },
  { src: '/assets/_login_carousel/GW_SideProfile.png', alt: 'Grand Warden' },
  { src: '/assets/_login_carousel/MP_SideProfile.png', alt: 'Minion Prince' },
  { src: '/assets/_login_carousel/RC_SideProfile.png', alt: 'Royal Champion' },
];

const itemImageMap: Record<string, string> = {
  // Heroes
  'Barbarian King': '/images/heroes/barbarian_king_altar.png',
  'Archer Queen': '/images/heroes/archer_queen_altar.png',
  'Grand Warden': '/images/heroes/grand_warden_altar.png',
  'Royal Champion': '/images/heroes/royal_champion_altar.png',
  'Battle Machine': '/images/heroes/battle_machine.png',
  'Battle Copter': '/images/heroes/battle_copter.png',

  // Troops
  'Barbarian': '/images/troops/barbarian.png',
  'Archer': '/images/troops/archer.png',
  'Goblin': '/images/troops/goblin.png',
  'Giant': '/images/troops/giant.png',
  'Wall Breaker': '/images/troops/wall_breaker.png',
  'Balloon': '/images/troops/balloon.png',
  'Wizard': '/images/troops/wizard.png',
  'Healer': '/images/troops/healer.png',
  'Dragon': '/images/troops/dragon.png',
  'P.E.K.K.A': '/images/troops/pekka.png',
  'Minion': '/images/troops/minion.png',
  'Hog Rider': '/images/troops/hog_rider.png',
  'Valkyrie': '/images/troops/valkyrie.png',
  'Golem': '/images/troops/golem.png',
  'Witch': '/images/troops/witch.png',
  'Lava Hound': '/images/troops/lava_hound.png',
  'Baby Dragon': '/images/troops/baby_dragon.png',
  'Miner': '/images/troops/miner.png',
  'Electro Dragon': '/images/troops/electro_dragon.png',
  'Yeti': '/images/troops/yeti.png',
  'Dragon Rider': '/images/troops/dragon_rider.png',
  'Electro Titan': '/images/troops/electro_titan.png',
  'Root Rider': '/images/troops/root_rider.png',
  'Ice Golem': '/images/troops/ice_golem.png',
  'Headhunter': '/images/troops/headhunter.png',
  'Bowler': '/images/troops/bowler.png',
  'Apprentice Warden': '/images/troops/apprentice_warden.png',

  // Spells
  'Lightning Spell': '/images/spells/lightning_spell.png',
  'Healing Spell': '/images/spells/healing_spell.png',
  'Rage Spell': '/images/spells/rage_spell.png',
  'Jump Spell': '/images/spells/jump_spell.png',
  'Freeze Spell': '/images/spells/freeze_spell.png',
  'Poison Spell': '/images/spells/poison_spell.png',
  'Earthquake Spell': '/images/spells/earthquake_spell.png',
  'Haste Spell': '/images/spells/haste_spell.png',
  'Clone Spell': '/images/spells/clone_spell.png',
  'Skeleton Spell': '/images/spells/skeleton_spell.png',
  'Bat Spell': '/images/spells/bat_spell.png',
  'Invisibility Spell': '/images/spells/invisibility_spell.png',
  'Recall Spell': '/images/spells/recall_spell.png',
  'Default': '/images/buildings/default.png',
};

export const getImagePath = (itemName: string): string => {
  return itemImageMap[itemName] || itemImageMap['Default'];
};
