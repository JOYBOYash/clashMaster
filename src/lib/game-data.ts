
import rawTroopData from './troopUpgradeStats-formatted.json';
import equipmentData from './equipment.json';
import superTroopData from './super-troops.json';

// Type definitions for our structured data
export interface UnlockInfo {
  hall: number;
  building: string;
  buildingLevel: number;
}

export interface GameItem {
  name: string;
  type: 'building' | 'troop' | 'spell' | 'hero' | 'pet' | 'equipment' | 'siege';
  unlock: UnlockInfo;
  maxLevelByTownHall: number[];
  upgrade?: {
    cost: number[];
    time: number[];
    resource: string;
  };
}

export interface TownHallData {
  buildings: Record<string, { count: number; max_level: number; }>;
  troops: Record<string, { max_level: number; }>;
  spells: Record<string, { max_level: number; }>;
  heroes: Record<string, { max_level: number; }>;
  pets: Record<string, { max_level: number; }>;
  walls: { count: number, max_level: number };
}

const snakeToTitleCase = (str: string) => {
    if (!str) return '';
    return str.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const tidToName = (tid: string): string => {
    return tid.replace('TID_', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


const processedGameData = new Map<string, GameItem>();

// Process raw data into a structured map
rawTroopData.forEach((item: any) => {
  let name = item.name;
  if (item.tid) {
    name = tidToName(item.tid);
  }
  
  const category = item.category as string;
  let type: GameItem['type'] = 'troop';
  if (category === 'troop' && item.subCategory === 'pet') type = 'pet';
  else if (category === 'troop' && item.subCategory === 'siege') type = 'siege';
  else if (category === 'spell') type = 'spell';
  else if (category === 'hero') type = 'hero';
  else if (category === 'equipment') type = 'equipment';

  // Fix for items that are buildings but are in this list
  if(['Wall Wrecker', 'Battle Blimp', 'Stone Slammer', 'Siege Barracks', 'Log Launcher', 'Flame Flinger', 'Battle Drill', 'Troop Launcher'].includes(name)){
    type = 'siege';
  }

  const gameItem: GameItem = {
    name: name,
    type: type,
    unlock: {
      hall: item.unlock?.hall || 0,
      building: item.unlock?.building || '',
      buildingLevel: item.unlock?.buildingLevel || 0,
    },
    maxLevelByTownHall: item.levels,
    upgrade: item.upgrade,
  };
  processedGameData.set(name, gameItem);
});

// Helper function to get an item's data
export const getItemData = (name: string): GameItem | undefined => {
  return processedGameData.get(name);
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

// Function to get available items for a given Town Hall level
export const getItemsForTownHall = (
    thLevel: number, 
    types: GameItem['type'][]
): GameItem[] => {
    const items: GameItem[] = [];
    processedGameData.forEach(item => {
        if (types.includes(item.type) && item.unlock.hall <= thLevel && item.unlock.hall > 0) {
            items.push(item);
        }
    });
    return items.sort((a,b) => a.name.localeCompare(b.name));
};

export const getMaxLevelForItem = (itemName: string, thLevel: number): number => {
    const item = getItemData(itemName);
    if (!item || !item.maxLevelByTownHall || thLevel < 1) {
        return 1;
    }
    return item.maxLevelByTownHall[thLevel -1] || 1;
};

// A simplified structure for the survey based on the new data.
// We'll generate this dynamically in the survey component itself.
// This file now acts as the data access layer.

export const buildingUnlockLevels: Record<string, number> = {
    'Laboratory': 4,
    'Barracks': 1, 
    'Dark Barracks': 7,
    'Spell Factory': 4,
    'Dark Spell Factory': 9,
    'Clan Castle': 3,
    'Workshop': 12,
    'Pet House': 14,
    'Blacksmith': 8,
    'Army Camp': 1,
    'Gold Storage': 1,
    'Elixir Storage': 1,
    'Dark Elixir Storage': 7,
    'Gold Mine': 1,
    'Elixir Collector': 1,
    'Dark Elixir Drill': 7,
    'Cannon': 1,
    'Archer Tower': 2,
    'Mortar': 4,
    'Air Defense': 5,
    'Wizard Tower': 7,
    'Air Sweeper': 9,
    'Hidden Tesla': 9,
    'Bomb Tower': 10,
    'X Bow': 9,
    'Inferno Tower': 10,
    'Eagle Artillery': 11,
    'Scattershot': 13,
    'Spell Tower': 9,
    'Monolith': 9,
    'Wall': 2,
};

export const getBuildingCountsForTownHall = (thLevel: number): Record<string, number> => {
    const counts: Record<string, {th: number, count: number}[]> = {
        'Cannon': [{th:1, count:1}, {th:3, count:2}, {th:7, count:4}, {th:8, count:5}, {th:12, count:6}, {th:10, count:7}],
        'Archer Tower': [{th:2, count:1}, {th:4, count:2}, {th:6, count:3}, {th:7, count:4}, {th:9, count:5}, {th:12, count:6}, {th:10, count:8}, {th:15, count:7}],
        'Mortar': [{th:4, count:1}, {th:6, count:2}, {th:8, count:3}, {th:9, count:4}],
        'Air Defense': [{th:5, count:1}, {th:6, count:2}, {th:8, count:3}, {th:9, count:4}],
        'Wizard Tower': [{th:7, count:2}, {th:8, count:3}, {th:9, count:4}, {th:10, count:5}],
        'Air Sweeper': [{th:9, count:2}],
        'Hidden Tesla': [{th:9, count:4}, {th:12, count:5}, {th:15, count:6}],
        'Bomb Tower': [{th:10, count:2}],
        'X Bow': [{th:9, count:4}],
        'Inferno Tower': [{th:10, count:2}, {th:14, count:3}],
        'Eagle Artillery': [{th:11, count:1}],
        'Scattershot': [{th:13, count:2}],
        'Spell Tower': [{th:9, count:2}],
        'Monolith': [{th:9, count:3},{th:14, count:4}],
        'Army Camp': [{th:1, count:1}, {th:3, count:2}, {th:4, count:3}, {th:5, count:4}],
        'Gold Storage': [{th:1, count:1}, {th:4, count:2}, {th:7, count:3}, {th:9, count:4}],
        'Elixir Storage': [{th:1, count:1}, {th:4, count:2}, {th:7, count:3}, {th:9, count:4}],
        'Dark Elixir Drill': [{th:7, count:1}, {th:8, count:2}, {th:9, count:3}, {th:13, count:4}],
        'Wall': [{th:2, count:25}, {th:3, count:50}, {th:4, count:75}, {th:5, count:100}, {th:6, count:125}, {th:7, count:150}, {th:8, count:175}, {th:9, count:250}, {th:10, count:275}, {th:12, count:300}, {th:13, count:325}, {th:14, count:350}, {th:15, count:400}, {th:16, count:450}, {th:17, count:500}],
    };

    const finalCounts: Record<string, number> = {};
    for (const building in counts) {
        let currentCount = 0;
        for (const tier of counts[building]) {
            if (thLevel >= tier.th) {
                currentCount = tier.count;
            } else {
                break;
            }
        }
        if (currentCount > 0) {
            finalCounts[building] = currentCount;
        }
    }
    return finalCounts;
};

// Single instance buildings don't change count
export const singleInstanceBuildings = [
    'Laboratory', 'Spell Factory', 'Dark Spell Factory', 'Clan Castle', 
    'Workshop', 'Pet House', 'Blacksmith', 'Barracks', 'Dark Barracks', 'Dark Elixir Storage'
];
