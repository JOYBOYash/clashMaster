
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
  'Royal Champion': '/assets/_hero/minion-prince.png',
  'Minion Prince': '/assets/_hero/minion-prince.png',
  'Battle Machine': '/assets/_hero/battle-machine.png',
  'Battle Copter': '/assets/_hero/battle-copter.png',

  // Hero _hero_equipment
  'Barbarian Puppet': '/assets/_hero_equipment/bk/barbarian-puppet.png',
  'Rage Vial': '/assets/_hero_equipment/bk/rage-vial.png',
  'Earthquake Boots': '/assets/_hero_equipment/bk/earthquake-boots.png',
  'Vampstache': '/assets/_hero_equipment/bk/vampstache.png',
  'Archer Puppet': '/assets/_hero_equipment/aq/archer-puppet.png',
  'Action Figure': '/assets/_hero_equipment/aq/action-figure.png',
  'Magic Mirror': '/assets/_hero_equipment/aq/magic-mirror.png',
  'Invisibility Vial': '/assets/_hero_equipment/aq/invisibility-vial.png',
  'Giant Arrow': '/assets/_hero_equipment/aq/giant-arrow.png',
  'Healer Puppet': '/assets/_hero_equipment/aq/healer-puppet.png',
  'Eternal Tome': '/assets/_hero_equipment/gw/eternal-tome.png',
  'Life Gem': '/assets/_hero_equipment/gw/life-gem.png',
  'Rage Gem': '/assets/_hero_equipment/gw/rage-gem.png',
  'Healing Tome': '/assets/_hero_equipment/gw/healing-tome.png',
  'Seeking Shield': '/assets/_hero_equipment/rc/seeking-shield.png',
  'Royal Gem': '/assets/_hero_equipment/rc/royal-gem.png',
  'Hog Rider Puppet': '/assets/_hero_equipment/rc/hog-rider-puppet.png',
  'Haste Vial': '/assets/_hero_equipment/rc/haste-vial.png',
  'Henchmen': '/assets/_hero_equipment/mp/heenchman.png',
  'Iron Pants': '/assets/_hero_equipment/mp/iron-pants.png',

  // _troops
  'Barbarian': '/assets/_troops/elixer/barbarian.png',
  'Archer': '/assets/_troops/elixer/archer.png',
  'Goblin': '/assets/_troops/elixer/goblin.png',
  'Giant': '/assets/_troops/elixer/giant.png',
  'Wall Breaker': '/assets/_troops/elixer/wall_breaker.png',
  'Balloon': '/assets/_troops/elixer/balloon.png',
  'Wizard': '/assets/_troops/elixer/wizard.png',
  'Healer': '/assets/_troops/elixer/healer.png',
  'Dragon': '/assets/_troops/elixer/dragon.png',
  'P.E.K.K.A': '/assets/_troops/elixer/pekka.png',
  'Minion': '/assets/_troops/dark-elixer/minion.png',
  'Hog Rider': '/assets/_troops/dark-elixer/hog_rider.png',
  'Valkyrie': '/assets/_troops/dark-elixer/valkyrie.png',
  'Golem': '/assets/_troops/dark-elixer/golem.png',
  'Witch': '/assets/_troops/dark-elixer/witch.png',
  'Lava Hound': '/assets/_troops/dark-elixer/lava_hound.png',
  'Baby Dragon': '/assets/_troops/elixer/baby_dragon.png',
  'Miner': '/assets/_troops/elixer/miner.png',
  'Electro Dragon': '/assets/_troops/elixer/electro_dragon.png',
  'Yeti': '/assets/_troops/elixer/yeti.png',
  'Dragon Rider': '/assets/_troops/elixer/dragon_rider.png',
  'Electro Titan': '/assets/_troops/elixer/electro_titan.png',
  'Root Rider': '/assets/_troops/elixer/root_rider.png',
  'Ice Golem': '/assets/_troops/dark-elixer/ice_golem.png',
  'Headhunter': '/assets/_troops/dark-elixer/head-hunter.png',
  'Bowler': '/assets/_troops/dark-elixer/bowler.png',
  'Apprentice Warden': '/assets/_troops/dark-elixer/apprentice_warden.png',
  // Builder Base _troops
  'Raged Barbarian': '/assets/_bbtroops/rage-barbarian.png',
  'Sneaky Archer': '/assets/_bbtroops/sneaky-archer.png',
  'Boxer Giant': '/assets/_bbtroops/boxer-giant.png',
  'Beta Minion': '/assets/_bbtroops/beta-minion.png',
  'Bomber': '/assets/_bbtroops/bomber.png', // Using wall breaker as proxy
  'Baby Dragon': '/assets/_bbtroops/baby-dragon.png',
  'Cannon Cart': '/assets/_bbtroops/cannon-cart.png',
  'Night Witch': '/assets/_bbtroops/night-witch.png',
  'Drop Ship': '/assets/_bbtroops/drop-ship.png',
  'Power P.E.K.K.A': '/assets/_bbtroops/power-PEKKA.png',
  'Hog Glider': '/assets/_bbtroops/hog-glider.png',
  'Electrofire Wizard': '/assets/_bbtroops/electrofire-wizard.png',


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
