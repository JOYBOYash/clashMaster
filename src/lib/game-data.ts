
import troopData from './raw.json';
import equipmentData from './equipment.json';
import superTroopData from './super-troops.json';

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
const createGameItem = (item: any, type: GameItem['type'], category: string = ''): GameItem | null => {
  if (!item.name) return null;

  let unlockHall = item.unlock?.requiredTownHall || item.unlockTownHall || 1;
  if(type === 'hero' && item.name === 'Barbarian King') unlockHall = 7;
  if(type === 'hero' && item.name === 'Archer Queen') unlockHall = 8;
  if(type === 'hero' && item.name === 'Grand Warden') unlockHall = 11;
  if(type === 'hero' && item.name === 'Royal Champion') unlockHall = 13;


  const maxLevelByTownHall = Array(17).fill(0);
  (item.levels || []).forEach((levelInfo: any) => {
    const th = levelInfo.requiredTownHall || levelInfo.requiredBuilderHall;
    if (th) {
      for (let i = th - 1; i < 17; i++) {
        maxLevelByTownHall[i] = Math.max(maxLevelByTownHall[i], levelInfo.level);
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
    name: item.name,
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

// Process all data sources
Object.values(troopData.homeVillage.troops).forEach(item => {
    const gameItem = createGameItem(item, 'troop');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.spells.elixir).forEach(item => {
    const gameItem = createGameItem(item, 'spell');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.spells.darkElixir).forEach(item => {
    const gameItem = createGameItem(item, 'spell');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.heroes).forEach(item => {
    const gameItem = createGameItem(item, 'hero');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.heroPets).forEach(item => {
    const gameItem = createGameItem(item, 'pet');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.heroEquipment).forEach(item => {
    const gameItem = createGameItem(item, 'equipment');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
});
Object.values(troopData.homeVillage.siegeMachines).forEach(item => {
    const gameItem = createGameItem(item, 'siege');
    if(gameItem) processedGameData.set(gameItem.name, gameItem);
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
    'Workshop', 'Pet House', 'Blacksmith', 'Barracks', 'Dark Barracks', 'Dark Elixir Storage'
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
    if (item && item.maxLevelByTownHall && thLevel > 0 && thLevel <= item.maxLevelByTownHall.length) {
        return item.maxLevelByTownHall[thLevel - 1] || 1;
    }

    // Fallback for buildings not in the main data file
    const buildingData = (troopData.homeVillage.defenses as any)[itemName] || (troopData.homeVillage.traps as any)[itemName];
    if (buildingData) {
        let maxLevel = 0;
        for (const levelInfo of buildingData.levels) {
            if (levelInfo.requiredTownHall <= thLevel) {
                maxLevel = levelInfo.level;
            } else {
                break;
            }
        }
        return maxLevel || 1;
    }
    
    return 1;
};

export const getBuildingCountsForTownHall = (thLevel: number): Record<string, number> => {
    const defenseData = troopData.homeVillage.defenses as any;
    const finalCounts: Record<string, number> = {};

    for (const buildingName in defenseData) {
        const buildingInfo = defenseData[buildingName];
        if (buildingInfo.maxPerTownHall) {
            const count = buildingInfo.maxPerTownHall[String(thLevel)];
            if(count) {
              finalCounts[buildingName] = count;
            }
        }
    }

    const wallData = (troopData.homeVillage as any).walls;
    if (wallData && wallData.maxPerTownHall) {
        const wallCount = wallData.maxPerTownHall[String(thLevel)];
        if (wallCount) {
          finalCounts['Wall'] = wallCount;
        }
    }

    // Add other buildings from hardcoded data if necessary
    if(thLevel >= 1) finalCounts['Army Camp'] = 4;
    if(thLevel >= 1) finalCounts['Gold Storage'] = thLevel >= 9 ? 4 : (thLevel >= 7 ? 3 : 2);
    if(thLevel >= 1) finalCounts['Elixir Storage'] = thLevel >= 9 ? 4 : (thLevel >= 7 ? 3 : 2);
    if(thLevel >= 8) finalCounts['Dark Elixir Drill'] = thLevel >= 13 ? 4 : (thLevel >= 10 ? 3 : (thLevel >= 9 ? 2 : 1));

    return finalCounts;
};

export const getElixirTypeForItem = (itemName: string): 'regular' | 'dark' | 'none' => {
  const item = getItemData(itemName);
  if (!item || !item.upgrade) return 'none';

  if (item.upgrade.resource === 'Dark Elixir') {
    return 'dark';
  }
  if (item.upgrade.resource === 'Elixir') {
    return 'regular';
  }
  return 'none';
};

    