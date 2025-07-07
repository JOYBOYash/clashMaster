
import {
    type VillageState,
    type Building,
    type Troop,
    type Hero,
    type Pet,
    type Equipment,
    ALL_BUILDINGS_CONFIG,
    ALL_TROOPS_CONFIG,
    ALL_HEROES_CONFIG,
    ALL_PETS_CONFIG,
    ALL_EQUIPMENT_CONFIG,
} from './constants';

type JsonItem = {
    data: number;
    lvl: number;
    cnt?: number;
    timer?: number;
};

// Create maps for faster lookups
const BUILDING_ID_MAP = new Map(ALL_BUILDINGS_CONFIG.map(c => [c.gameId, c]));
const TROOP_ID_MAP = new Map(ALL_TROOPS_CONFIG.map(c => [c.gameId, c]));
const HERO_ID_MAP = new Map(ALL_HEROES_CONFIG.map(c => [c.gameId, c]));
const PET_ID_MAP = new Map(ALL_PETS_CONFIG.map(c => [c.gameId, c]));
const EQUIPMENT_ID_MAP = new Map(ALL_EQUIPMENT_CONFIG.map(c => [c.gameId, c]));


export function mapJsonToVillageState(jsonData: any): VillageState {
    if (!jsonData || !jsonData.tag) {
        throw new Error("Invalid or empty JSON data provided.");
    }

    const buildings: Building[] = [];
    const troops: Troop[] = [];
    const heroes: Hero[] = [];
    const pets: Pet[] = [];
    const equipment: Equipment[] = [];
    let townHallLevel = 0;
    let builderHallLevel = 0;
    const buildingCounters: Record<string, number> = {};

    const specialOneOffBuildings = new Set(['Barracks', 'Dark Barracks', 'Laboratory', 'Spell Factory', 'Dark Spell Factory', 'Workshop', 'Blacksmith', 'Pet House']);

    // Find the highest level for one-off buildings as the JSON can contain multiple legacy entries.
    const oneOffBuildingLevels: Record<string, {level: number, timer?: number}> = {};
    const allBuildingData = [...(jsonData.buildings || []), ...(jsonData.buildings2 || [])];

    allBuildingData.forEach(item => {
        const config = BUILDING_ID_MAP.get(item.data);
        if (config && specialOneOffBuildings.has(config.name)) {
            if (!oneOffBuildingLevels[config.name] || item.lvl > oneOffBuildingLevels[config.name].level) {
                oneOffBuildingLevels[config.name] = { level: item.lvl, timer: item.timer };
            }
        }
    });

    const processBuildingArray = (items: JsonItem[], base: 'home' | 'builder') => {
        if (!Array.isArray(items)) return;
        
        const processedOneOffs = new Set<string>();

        items.forEach(item => {
            const config = BUILDING_ID_MAP.get(item.data);
            if (!config || config.base !== base) return;

            if (config.name === 'Town Hall') townHallLevel = item.lvl;
            if (config.name === 'Builder Hall') builderHallLevel = item.lvl;
            
            // Handle one-off buildings by taking the highest level found.
            if (specialOneOffBuildings.has(config.name)) {
                if(processedOneOffs.has(config.name)) return;

                const highestLevelData = oneOffBuildingLevels[config.name];
                if(highestLevelData) {
                    const buildingKey = config.name.replace(/\s/g, '') + '-' + config.base;
                    buildings.push({
                        id: `${buildingKey}-0`,
                        name: config.name,
                        level: highestLevelData.level,
                        maxLevel: config.maxLevel,
                        type: config.type,
                        base: config.base,
                        isUpgrading: highestLevelData.hasOwnProperty('timer'),
                    });
                    processedOneOffs.add(config.name);
                }
                return;
            }

            // Explicitly ignore Army Camp entries with invalid levels.
            if (config.name === 'Army Camp' && item.lvl > config.maxLevel) {
                return;
            }
            
            const count = item.cnt || 1;
            const buildingKey = config.name.replace(/\s/g, '') + '-' + config.base;
            
            if (buildingCounters[buildingKey] === undefined) {
                buildingCounters[buildingKey] = 0;
            }

            for (let i = 0; i < count; i++) {
                const instanceIndex = buildingCounters[buildingKey]++;
                buildings.push({
                    id: `${buildingKey}-${instanceIndex}`,
                    name: config.name,
                    level: item.lvl,
                    maxLevel: config.maxLevel,
                    type: config.type,
                    base: config.base,
                    isUpgrading: item.hasOwnProperty('timer'),
                });
            }
        });
    };
    
    // Process Buildings and Traps
    processBuildingArray(jsonData.buildings, 'home');
    processBuildingArray(jsonData.traps, 'home');
    processBuildingArray(jsonData.buildings2, 'builder');
    processBuildingArray(jsonData.traps2, 'builder');


    // Helper to process troop/spell/siege arrays
    const processUnitArray = (items: JsonItem[], base: 'home' | 'builder') => {
         if (!Array.isArray(items)) return;
         items.forEach(item => {
             const config = TROOP_ID_MAP.get(item.data);
             if (!config || config.village !== base) return;
             troops.push({
                id: `${config.name.replace(/\s/g, '')}-${config.village}`,
                name: config.name,
                level: item.lvl,
                maxLevel: config.maxLevel,
                village: config.village,
                elixirType: config.elixirType,
             });
         });
    };
    
    // Process all troop-like units
    processUnitArray(jsonData.units, 'home');
    processUnitArray(jsonData.spells, 'home');
    processUnitArray(jsonData.siege_machines, 'home');
    processUnitArray(jsonData.units2, 'builder');


    // Process heroes and pets
    const processHeroArray = (items: JsonItem[], base: 'home' | 'builder') => {
        if (!Array.isArray(items)) return;
        items.forEach(item => {
            // Check if it's a pet
            const petConfig = PET_ID_MAP.get(item.data);
            if(petConfig) {
                 pets.push({
                    id: `${petConfig.name.replace(/\s/g, '')}`,
                    name: petConfig.name,
                    level: item.lvl,
                    maxLevel: petConfig.maxLevel,
                });
                return; // continue to next item
            }

            // Check if it's a hero
            const heroConfig = HERO_ID_MAP.get(item.data);
            if (heroConfig && heroConfig.village === base) {
                heroes.push({
                    id: `${heroConfig.name.replace(/\s/g, '')}-${heroConfig.village}`,
                    name: heroConfig.name,
                    level: item.lvl,
                    maxLevel: heroConfig.maxLevel,
                    village: heroConfig.village,
                });
            }
        });
    };

    processHeroArray(jsonData.heroes, 'home');
    processHeroArray(jsonData.heroes2, 'builder');
    // The `pets` array in JSON is for something else, pets are in the `heroes` array
    if(Array.isArray(jsonData.pets) && jsonData.pets.length > 0) {
        // This is where real pets would be if the game's JSON format changes
    }
    

    // Process equipment
    if (Array.isArray(jsonData.equipment)) {
        jsonData.equipment.forEach((item: JsonItem) => {
            const config = EQUIPMENT_ID_MAP.get(item.data);
            if (!config) return;
            equipment.push({
                id: `${config.name.replace(/\s/g, '')}`,
                name: config.name,
                level: item.lvl,
                maxLevel: config.maxLevel,
            });
        });
    }


    if (townHallLevel === 0) {
        throw new Error("Could not determine Town Hall level from JSON data. Is the data complete?");
    }

    const villageState: VillageState = {
        townHallLevel,
        builderHallLevel: builderHallLevel || 1,
        buildings,
        troops,
        heroes,
        pets,
        equipment,
    };

    return villageState;
}
