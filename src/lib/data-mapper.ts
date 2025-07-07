
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

    // Helper to process building/trap arrays
    const processBuildingArray = (items: JsonItem[], base: 'home' | 'builder') => {
        if (!Array.isArray(items)) return;

        items.forEach(item => {
            const config = BUILDING_ID_MAP.get(item.data);
            if (!config || config.base !== base) return;

            if (config.name === 'Town Hall') townHallLevel = item.lvl;
            if (config.name === 'Builder Hall') builderHallLevel = item.lvl;

            const count = item.cnt || 1;
            for (let i = 0; i < count; i++) {
                buildings.push({
                    id: `${config.name.replace(/\s/g, '')}-${config.base}-${i}`,
                    name: config.name,
                    level: item.lvl,
                    maxLevel: config.maxLevel,
                    type: config.type,
                    base: config.base,
                    isUpgrading: false, // JSON export doesn't clearly provide this per-item
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
