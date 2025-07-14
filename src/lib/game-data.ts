
import buildingData from './raw-defenses-buildings-resources-others.json';
import troopData from './raw-troops-heroes-equipment-spells.json';

// Type definitions for our structured data
export interface GameItem {
  name: string;
  type: 'building' | 'troop' | 'spell' | 'hero' | 'pet' | 'equipment' | 'siege';
  unlock: {
    hall: number;
    building?: string;
    buildingLevel?: number;
  };
  maxLevelByTownHall: number[];
  upgrade?: {
    cost: number[];
    time: number[];
    resource: string;
  };
}

const processedGameData = new Map<string, GameItem>();

// Helper to create a unified GameItem
const createGameItem = (name: string, item: any, type: GameItem['type']): GameItem | null => {
  if (!name || !item) return null;

  let unlockHall = item.unlockTownHall || 1;
  if(item.unlock?.requiredTownHall) unlockHall = item.unlock.requiredTownHall;

  // Manual overrides for heroes that don't have a TH level in the data
  if(type === 'hero' && name === 'Barbarian King') unlockHall = 7;
  if(type === 'hero' && name === 'Archer Queen') unlockHall = 9;
  if(type === 'hero' && name === 'Grand Warden') unlockHall = 11;
  if(type === 'hero' && name === 'Royal Champion') unlockHall = 13;
  if(type === 'pet') unlockHall = 14;


  const maxLevelByTownHall = Array(17).fill(0);
  (item.levels || []).forEach((levelInfo: any, index: number) => {
    const requiredTH = levelInfo.requiredTownHall || levelInfo.requiredBuilderHall || unlockHall;
    const level = levelInfo.level || (index + 1);
    
    if (requiredTH) {
      for (let i = requiredTH - 1; i < 17; i++) {
        maxLevelByTownHall[i] = Math.max(maxLevelByTownHall[i], level);
      }
    }
  });

  // For items without per-level TH requirement, assume max level is available once unlocked.
   if ((item.levels || []).length > 0 && !(item.levels[0].requiredTownHall || item.levels[0].requiredBuilderHall)) {
      const maxLevel = item.levels.length;
      for (let i = unlockHall - 1; i < 17; i++) {
        maxLevelByTownHall[i] = maxLevel;
      }
   }

  return {
    name: name,
    type,
    unlock: {
      hall: unlockHall,
      building: item.unlock?.requiredBuilding,
      buildingLevel: item.unlock?.requiredBuildingLevel,
    },
    maxLevelByTownHall,
    upgrade: item.upgrade ? {
      cost: item.upgrade.cost,
      time: item.upgrade.time,
      resource: item.upgrade.resource
    } : undefined
  };
};

// Process all data from raw-troops-heroes-equipment-spells.json
Object.entries(troopData.homeVillage.troops).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'troop');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.entries(troopData.homeVillage.spells.elixir).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'spell');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.entries(troopData.homeVillage.spells.darkElixir).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'spell');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.entries(troopData.homeVillage.heroes).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'hero');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.entries(troopData.homeVillage.heroPets).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'pet');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.entries(troopData.homeVillage.heroEquipment).forEach(([name, item]) => {
    const gameItem = createGameItem(name, item, 'equipment');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});

// Process all data from raw-defenses-buildings-resources-others.json
const buildingCategories = ['resources', 'army', 'other', 'defenses', 'traps'];
buildingCategories.forEach(category => {
  const catKey = category as keyof typeof buildingData.homeVillage;
  Object.entries((buildingData.homeVillage as any)[catKey]).forEach(([name, item]) => {
      const gameItem = createGameItem(name, item, 'building');
      if(gameItem) processedGameData.set(gameItem.name, gameItem);
  });
});


export const buildingUnlockLevels: Record<string, number> = {
    'Laboratory': 3, 'Barracks': 1, 'Dark Barracks': 7, 'Spell Factory': 5,
    'Dark Spell Factory': 8, 'Clan Castle': 3, 'Workshop': 12, 'Pet House': 14,
    'Blacksmith': 8, 'Army Camp': 1, 'Gold Storage': 1, 'Elixir Storage': 1,
    'Dark Elixir Storage': 7, 'Gold Mine': 1, 'Elixir Collector': 1, 'Dark Elixir Drill': 8,
    'Cannon': 1, 'Archer Tower': 2, 'Mortar': 3, 'Air Defense': 4, 'Wizard Tower': 5,
    'Air Sweeper': 6, 'Hidden Tesla': 7, 'Bomb Tower': 8, 'X-Bow': 9, 'Inferno Tower': 10,
    'Eagle Artillery': 11, 'Scattershot': 13, 'Spell Tower': 15, 'Monolith': 15, 'Wall': 2,
};

export const singleInstanceBuildings = [
    'Laboratory', 'Spell Factory', 'Dark Spell Factory', 'Clan Castle',
    'Workshop', 'Pet House', 'Blacksmith', 'Barracks', 'Dark Barracks', 'Dark Elixir Storage',
    'Eagle Artillery', 'Monolith'
];


// --- EXPORTED FUNCTIONS ---

export const getItemData = (name: string): GameItem | undefined => {
  return processedGameData.get(name);
};

export const getItemsForTownHall = (thLevel: number, types: GameItem['type'][]): GameItem[] => {
    const items: GameItem[] = [];
    processedGameData.forEach(item => {
        if (types.includes(item.type) && item.unlock.hall <= thLevel && item.unlock.hall > 0) {
            // Ensure equipment has blacksmith unlocked
            if (item.type === 'equipment' && thLevel < 8) return;
            items.push(item);
        }
    });
    return items.sort((a,b) => a.name.localeCompare(b.name));
};

export const getMaxLevelForItem = (itemName: string, thLevel: number): number => {
    const item = getItemData(itemName);
    if (!item || !item.maxLevelByTownHall) {
        // Fallback for Wall, which is not in processedGameData
        if (itemName === 'Wall') {
            const wallData = (buildingData.homeVillage as any).walls;
            if(wallData) return wallData.maxLevelByTownHall[thLevel - 1] || 1;
        }
        return 1;
    }
    if (thLevel > 0 && thLevel <= item.maxLevelByTownHall.length) {
        return item.maxLevelByTownHall[thLevel - 1] || 1;
    }
    return 1;
};

export const getBuildingCountsForTownHall = (thLevel: number): Record<string, number> => {
    const finalCounts: Record<string, number> = {};
    if (thLevel <= 0 || thLevel > 17) return finalCounts;

    const allBuildingData = [
        ...Object.values(buildingData.homeVillage.defenses),
        ...Object.values(buildingData.homeVillage.resources),
        ...Object.values(buildingData.homeVillage.army),
        ...Object.values(buildingData.homeVillage.other),
        ...Object.values(buildingData.homeVillage.traps),
        (buildingData.homeVillage as any).walls,
    ];

    for (const buildingInfo of allBuildingData) {
        if (buildingInfo && buildingInfo.name && buildingInfo.maxPerTownHall) {
            const count = buildingInfo.maxPerTownHall[String(thLevel)];
            if(count) {
              finalCounts[buildingInfo.name] = count;
            }
        }
    }
    return finalCounts;
};

export const getElixirTypeForItem = (itemName: string): 'regular' | 'dark' | 'none' => {
  const item = getItemData(itemName);
  if (!item || !item.upgrade) {
    const spellItem = (troopData.homeVillage.spells.elixir as any)[itemName] || (troopData.homeVillage.spells.darkElixir as any)[itemName];
    if(spellItem) return spellItem.upgradeResource === 'Elixir' ? 'regular' : 'dark';
    return 'none';
  }

  if (item.upgrade.resource === 'Dark Elixir') {
    return 'dark';
  }
  if (item.upgrade.resource === 'Elixir') {
    return 'regular';
  }
  return 'none';
};
