
import villageDataJson from './village-data.json';
import armyDataJson from './army-data.json';
import { titleCase } from './utils';

// ===== TYPE DEFINITIONS =====

export interface PlayerState {
  [key: string]: number;
}

export interface EntityLevel {
  level: number;
  townHall: number;
}

export interface Entity {
  name: string;
  category: string;
  unlockBuilding: string;
  unlockBuildingLevel: number;
  unlockHallLevel: number;
  levels: EntityLevel[];
  maxLevel: number;
}

// ===== DATA NORMALIZATION =====

const normalizeVillageData = (data: any): Entity[] => {
  return data.buildings.map((item: any) => ({
    name: item.name,
    category: item.category,
    unlockBuilding: item.build.townHall > 1 ? 'Town Hall' : 'Start',
    unlockBuildingLevel: item.build.townHall,
    unlockHallLevel: item.build.townHall,
    levels: item.levels.map((l: any) => ({ level: l.level, townHall: l.townHall })),
    maxLevel: item.levels.length,
  }));
};

const normalizeArmyData = (data: any): Entity[] => {
  return data
    .filter((item: any) => item.village === 'home' && !item.name.startsWith('Super'))
    .map((item: any) => {
      let category = titleCase(item.category);
      if (item.category === 'troop') {
        category = item.unlock.resource === 'Dark Elixir' ? 'Dark Elixir Troops' : 'Elixir Troops';
      } else if (item.category === 'spell') {
        category = item.unlock.resource === 'Dark Elixir' ? 'Dark Spells' : 'Elixir Spells';
      } else if (item.category === 'hero') {
        category = "Heroes";
      }

      let levels;
      if (typeof item.levels[0] === 'number') {
        levels = item.levels.map((th: number, index: number) => ({ level: index + 1, townHall: th }));
      } else {
        levels = item.levels.map((l: any) => ({ level: l.level, townHall: l.townHall }));
      }
      
      return {
        name: item.name,
        category: category,
        unlockBuilding: item.unlock.building || 'Town Hall',
        unlockBuildingLevel: item.unlock.buildingLevel || 1,
        unlockHallLevel: item.unlock.hall || 1,
        levels: levels,
        maxLevel: levels.length,
      };
    });
};

const allVillageEntities = normalizeVillageData(villageDataJson);
const allArmyEntities = normalizeArmyData(armyDataJson);

export const allEntities = [...allVillageEntities, ...allArmyEntities];

// ===== LOGIC FUNCTIONS =====

export const isUnlocked = (
  entity: Entity,
  playerState: PlayerState
): boolean => {
  if (entity.name === "Town Hall") return true;
  
  const requiredTh = entity.unlockHallLevel;
  if (playerState.town_hall < requiredTh) {
    return false;
  }

  const unlockBuildingKey = entity.unlockBuilding.toLowerCase().replace(/ /g, '_');
  const playerBuildingLevel = playerState[unlockBuildingKey] || 0;
  
  return playerBuildingLevel >= entity.unlockBuildingLevel;
};


export const getMaxLevelForTownHall = (
  entity: Entity,
  townHallLevel: number
): number => {
    if (!entity || !entity.levels) return 0;
    const availableLevels = entity.levels.filter(l => l.townHall <= townHallLevel);
    return availableLevels.length > 0 ? Math.max(...availableLevels.map(l => l.level)) : 0;
};

    