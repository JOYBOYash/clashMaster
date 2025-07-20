
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
  'Barbarian King': '/assets/_hero/barbarian-king.png',
  'Archer Queen': '/assets/_hero/archer-queen.png',
  'Grand Warden': '/assets/_hero/grand-warden.png',
  'Royal Champion': '/assets/_hero/royal-champion.png',
  'Battle Machine': '/assets/_hero/battle-machine.png',
  'Battle Copter': '/assets/_hero/battle-copter.png',

  // Hero Equipment
  'Barbarian Puppet': '/assets/equipment/barbarian-puppet.png',
  'Rage Vial': '/assets/equipment/rage-vial.png',
  'Earthquake Boots': '/assets/equipment/earthquake-boots.png',
  'Vampstache': '/assets/equipment/vampstache.png',
  'Archer Puppet': '/assets/equipment/archer-puppet.png',
  'Invisibility Vial': '/assets/equipment/invisibility-vial.png',
  'Giant Arrow': '/assets/equipment/giant-arrow.png',
  'Healer Puppet': '/assets/equipment/healer-puppet.png',
  'Eternal Tome': '/assets/equipment/eternal-tome.png',
  'Life Gem': '/assets/equipment/life-gem.png',
  'Rage Gem': '/assets/equipment/rage-gem.png',
  'Healing Tome': '/assets/equipment/healing-tome.png',
  'Seeking Shield': '/assets/equipment/seeking-shield.png',
  'Royal Gem': '/assets/equipment/royal-gem.png',
  'Hog Rider Puppet': '/assets/equipment/hog-rider-puppet.png',
  'Haste Vial': '/assets/equipment/haste-vial.png',

  // Troops
  'Barbarian': '/assets/troops/barbarian.png',
  'Archer': '/assets/troops/archer.png',
  'Goblin': '/assets/troops/goblin.png',
  'Giant': '/assets/troops/giant.png',
  'Wall Breaker': '/assets/troops/wall_breaker.png',
  'Balloon': '/assets/troops/balloon.png',
  'Wizard': '/assets/troops/wizard.png',
  'Healer': '/assets/troops/healer.png',
  'Dragon': '/assets/troops/dragon.png',
  'P.E.K.K.A': '/assets/troops/pekka.png',
  'Minion': '/assets/troops/minion.png',
  'Hog Rider': '/assets/troops/hog_rider.png',
  'Valkyrie': '/assets/troops/valkyrie.png',
  'Golem': '/assets/troops/golem.png',
  'Witch': '/assets/troops/witch.png',
  'Lava Hound': '/assets/troops/lava_hound.png',
  'Baby Dragon': '/assets/troops/baby_dragon.png',
  'Miner': '/assets/troops/miner.png',
  'Electro Dragon': '/assets/troops/electro_dragon.png',
  'Yeti': '/assets/troops/yeti.png',
  'Dragon Rider': '/assets/troops/dragon_rider.png',
  'Electro Titan': '/assets/troops/electro_titan.png',
  'Root Rider': '/assets/troops/root_rider.png',
  'Ice Golem': '/assets/troops/ice_golem.png',
  'Headhunter': '/assets/troops/headhunter.png',
  'Bowler': '/assets/troops/bowler.png',
  'Apprentice Warden': '/assets/troops/apprentice_warden.png',
  // Builder Base Troops
  'Raged Barbarian': '/assets/troops/barbarian.png',
  'Sneaky Archer': '/assets/troops/archer.png',
  'Boxer Giant': '/assets/troops/giant.png',
  'Beta Minion': '/assets/troops/minion.png',
  'Bomber': '/assets/troops/wall_breaker.png', // Using wall breaker as proxy
  'Baby Dragon': '/assets/troops/baby_dragon.png',
  'Cannon Cart': '/assets/troops/cannon-cart.png',
  'Night Witch': '/assets/troops/witch.png',
  'Drop Ship': '/assets/troops/drop-ship.png',
  'Power P.E.K.K.A': '/assets/troops/pekka.png',
  'Hog Glider': '/assets/troops/hog-glider.png',
  'Electrofire Wizard': '/assets/troops/electro-wizard.png',


  // Spells
  'Lightning Spell': '/assets/spells/lightning_spell.png',
  'Healing Spell': '/assets/spells/healing_spell.png',
  'Rage Spell': '/assets/spells/rage_spell.png',
  'Jump Spell': '/assets/spells/jump_spell.png',
  'Freeze Spell': '/assets/spells/freeze_spell.png',
  'Poison Spell': '/assets/spells/poison_spell.png',
  'Earthquake Spell': '/assets/spells/earthquake_spell.png',
  'Haste Spell': '/assets/spells/haste_spell.png',
  'Clone Spell': '/assets/spells/clone_spell.png',
  'Skeleton Spell': '/assets/spells/skeleton_spell.png',
  'Bat Spell': '/assets/spells/bat_spell.png',
  'Invisibility Spell': '/assets/spells/invisibility_spell.png',
  'Recall Spell': '/assets/spells/recall_spell.png',
  'Default': '/assets/buildings/default.png',
};

export const getImagePath = (itemName: string): string => {
  return itemImageMap[itemName] || itemImageMap['Default'];
};
