
import {
    type VillageState,
    type Building,
    type Troop,
    type Hero,
    type Pet,
    type Equipment,
    BUILDING_ID_MAP
} from './constants';
import { gameData } from './game-data';

type JsonItem = {
    data: number;
    lvl: number;
    cnt?: number;
    timer?: number;
};

// Simplified mapping of some troops/heroes/etc for demonstration
// A complete implementation would map all game IDs similar to buildings.
const TROOP_ID_MAP = new Map([
    [4000000, { name: 'Barbarian', village: 'home', elixirType: 'regular' }],
    [4000001, { name: 'Archer', village: 'home', elixirType: 'regular' }],
    [4000002, { name: 'Goblin', village: 'home', elixirType: 'regular' }],
    // ... add all troops, spells, siege machines
]);

const HERO_ID_MAP = new Map([
    [28000000, { name: 'Barbarian King', village: 'home' }],
    [28000001, { name: 'Archer Queen', village: 'home' }],
    [28000002, { name: 'Grand Warden', village: 'home' }],
    [28000006, { name: 'Royal Champion', village: 'home' }],
    [28000003, { name: 'Battle Machine', village: 'builder' }],
    [28000005, { name: 'Battle Copter', village: 'builder' }],
]);

const PET_ID_MAP = new Map([
    [28000007, { name: 'L.A.S.S.I' }],
    // ... add all pets
]);

const EQUIPMENT_ID_MAP = new Map([
    [90000000, { name: 'Barbarian Puppet' }],
    // ... add all equipment
]);


export function mapJsonToVillageState(jsonData: any): VillageState {
    if (!jsonData || !jsonData.tag) {
        throw new Error("Invalid or empty JSON data provided.");
    }

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: Hero[] = [];
    const pets: Pet[] = [];
    const equipment: Equipment[] = [];
    
    const buildingInstanceCounter: Record<string, number> = {};

    const townHallEntry = jsonData.buildings.find((b: JsonItem) => b.data === 1000001);
    if (!townHallEntry) {
        throw new Error("Could not determine Town Hall level from JSON data.");
    }
    const townHallLevel = townHallEntry.lvl;
    const thKey = `TH${townHallLevel}` as keyof typeof gameData.clash_of_clans_data.town_halls;
    const thData = gameData.clash_of_clans_data.town_halls[thKey];

    const builderHallEntry = jsonData.buildings2?.find((b: JsonItem) => b.data === 1000034);
    const builderHallLevel = builderHallEntry?.lvl || 1;


    const processItems = (items: JsonItem[], base: 'home' | 'builder') => {
        if (!Array.isArray(items)) return;

        items.forEach(item => {
            const config = BUILDING_ID_MAP.get(item.data);
            if (!config || config.base !== base) return;

            const count = item.cnt || 1;
            
            for (let i = 0; i < count; i++) {
                const buildingKey = `${config.name}-${config.base}`;
                if (buildingInstanceCounter[buildingKey] === undefined) {
                    buildingInstanceCounter[buildingKey] = 0;
                }
                const instanceIndex = buildingInstanceCounter[buildingKey]++;
                
                // Get max level from the new game data based on TH level
                let maxLevel = 1;
                if (thData) {
                    const buildingDataKey = config.name.replace(/ /g, '_').toLowerCase() as keyof typeof thData.buildings;
                    const buildingInfo = thData.buildings[buildingDataKey] as { count: number; max_level: number };
                    if (buildingInfo) {
                        maxLevel = buildingInfo.max_level;
                    }
                }

                buildings.push({
                    id: `${buildingKey}-${instanceIndex}`,
                    name: config.name,
                    level: item.lvl,
                    maxLevel: maxLevel || 1, // Default to 1 if not found
                    type: config.type,
                    base: config.base,
                    isUpgrading: item.hasOwnProperty('timer'),
                    upgradeEndTime: item.timer ? new Date(Date.now() + item.timer * 1000).toISOString() : undefined,
                });
            }
        });
    };

    // Process all buildings and traps
    processItems(jsonData.buildings, 'home');
    processItems(jsonData.traps, 'home');
    processItems(jsonData.buildings2, 'builder');
    processItems(jsonData.traps2, 'builder');

    // This is a simplified version for troops/heroes. A full implementation would be similar to buildings.
    const processSimpleList = (jsonList: JsonItem[], configMap: Map<number, any>, targetArray: any[], type: string) => {
        if (!Array.isArray(jsonList)) return;
        jsonList.forEach(item => {
            const config = configMap.get(item.data);
            if (config) {
                targetArray.push({
                    id: `${config.name.replace(/\s/g, '')}`,
                    name: config.name,
                    level: item.lvl,
                    maxLevel: 10, // Placeholder
                    ...(config.village && { village: config.village }),
                    ...(config.elixirType && { elixirType: config.elixirType }),
                });
            }
        });
    };

    processSimpleList(jsonData.units, TROOP_ID_MAP, troops, 'troop');
    processSimpleList(jsonData.spells, TROOP_ID_MAP, troops, 'spell'); // Simplified
    processSimpleList(jsonData.heroes, HERO_ID_MAP, heroes, 'hero');
    processSimpleList(jsonData.pets, PET_ID_MAP, pets, 'pet');
    processSimpleList(jsonData.equipment, EQUIPMENT_ID_MAP, equipment, 'equipment');
    processSimpleList(jsonData.units2, TROOP_ID_MAP, troops, 'troop');
    processSimpleList(jsonData.heroes2, HERO_ID_MAP, heroes, 'hero');


    const villageState: VillageState = {
        townHallLevel,
        builderHallLevel,
        buildings,
        troops,
        heroes,
        pets,
        equipment,
    };

    return villageState;
}
