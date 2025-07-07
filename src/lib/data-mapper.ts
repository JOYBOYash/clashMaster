
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
    [4000003, { name: 'Giant', village: 'home', elixirType: 'regular' }],
    [4000004, { name: 'Wall Breaker', village: 'home', elixirType: 'regular' }],
    [4000005, { name: 'Balloon', village: 'home', elixirType: 'regular' }],
    [4000006, { name: 'Wizard', village: 'home', elixirType: 'regular' }],
    [4000007, { name: 'Healer', village: 'home', elixirType: 'regular' }],
    [4000008, { name: 'Dragon', village: 'home', elixirType: 'regular' }],
    [4000009, { name: 'P.E.K.K.A', village: 'home', elixirType: 'regular' }],
    [4000010, { name: 'Minion', village: 'home', elixirType: 'dark' }],
    [4000011, { name: 'Hog Rider', village: 'home', elixirType: 'dark' }],
    [4000012, { name: 'Valkyrie', village: 'home', elixirType: 'dark' }],
    [4000013, { name: 'Golem', village: 'home', elixirType: 'dark' }],
    [4000015, { name: 'Witch', village: 'home', elixirType: 'dark' }],
    [4000017, { name: 'Lava Hound', village: 'home', elixirType: 'dark' }],
    [4000023, { name: 'Bowler', village: 'home', elixirType: 'dark' }],
    [4000024, { name: 'Baby Dragon', village: 'home', elixirType: 'regular' }],
    [4000025, { name: 'Miner', village: 'home', elixirType: 'regular' }],
    [4000059, { name: 'Ice Golem', village: 'home', elixirType: 'dark' }],
    [26000000, { name: 'Lightning Spell', village: 'home', elixirType: 'regular' }],
    [26000001, { name: 'Healing Spell', village: 'home', elixirType: 'regular' }],
    [26000002, { name: 'Rage Spell', village: 'home', elixirType: 'regular' }],
    [26000003, { name: 'Jump Spell', village: 'home', elixirType: 'regular' }],
    [26000005, { name: 'Freeze Spell', village: 'home', elixirType: 'regular' }],
    [26000009, { name: 'Poison Spell', village: 'home', elixirType: 'dark' }],
    [26000010, { name: 'Earthquake Spell', village: 'home', elixirType: 'dark' }],
    [26000011, { name: 'Haste Spell', village: 'home', elixirType: 'dark' }],
    [26000016, { name: 'Clone Spell', village: 'home', elixirType: 'regular' }],
    [26000017, { name: 'Skeleton Spell', village: 'home', elixirType: 'dark' }],
    [26000028, { name: 'Bat Spell', village: 'home', elixirType: 'dark' }],
    [26000035, { name: 'Invisibility Spell', village: 'home', elixirType: 'regular' }],
    [4000051, { name: 'Wall Wrecker', village: 'home', elixirType: 'none' }],
    [4000052, { name: 'Battle Blimp', village: 'home', elixirType: 'none' }],
    [4000031, { name: 'Raged Barbarian', village: 'builder', elixirType: 'none' }],
    [4000032, { name: 'Sneaky Archer', village: 'builder', elixirType: 'none' }],
    [4000033, { name: 'Boxer Giant', village: 'builder', elixirType: 'none' }],
    [4000034, { name: 'Beta Minion', village: 'builder', elixirType: 'none' }],
    [4000035, { name: 'Bomber', village: 'builder', elixirType: 'none' }],
    [4000036, { name: 'Baby Dragon', village: 'builder', elixirType: 'none' }],
    [4000037, { name: 'Cannon Cart', village: 'builder', elixirType: 'none' }],
    [4000038, { name: 'Night Witch', village: 'builder', elixirType: 'none' }],
    [4000041, { name: 'Drop Ship', village: 'builder', elixirType: 'none' }],
    [4000042, { name: 'Power P.E.K.K.A', village: 'builder', elixirType: 'none' }],
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
    [90000001, { name: 'Rage Vial' }],
    [90000002, { name: 'Archer Puppet' }],
    [90000003, { name: 'Invisibility Vial' }],
    [90000004, { name: 'Eternal Tome' }],
    [90000005, { name: 'Life Gem' }],
    [90000006, { name: 'Seeking Shield' }],
    [90000007, { name: 'Royal Gem' }],
    [90000008, { name: 'Vampstache' }],
    [90000010, { name: 'Giant Arrow' }],
    [90000011, { name: 'Healer Puppet' }],
    [90000013, { name: 'Hog Rider Puppet' }],
    [90000014, { name: 'Healing Tome' }],
    [90000015, { name: 'Rage Gem' }],
    [90000017, { name: 'Haste Vial' }],
    [90000019, { name: 'Giant Gauntlet' }],
    [90000022, { name: 'Frozen Arrow' }],
    [90000024, { name: 'Fireball' }],
    [90000032, { name: 'Rocket Spear' }],
    [90000035, { name: 'Hog Rider Puppet' }], // Note: Duplicate name, may need unique IDs
    [90000039, { name: 'Spiky Ball' }],
    [90000040, { name: 'Exploding Dagger' }],
    [90000041, { name: 'Giant Cookie' }],
    [90000042, { name: 'Haste Vial' }], // Note: Duplicate name
    [90000043, { name: 'Earthquake Boots' }],
    [90000044, { name: 'Rage Vial' }], // Note: Duplicate name
    [90000048, { name: 'Vampstache' }], // Note: Duplicate name
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
    
    // 1. Get Town Hall Level first. This is the source of truth.
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

        const itemsByDataId = new Map<number, JsonItem[]>();
        items.forEach(item => {
            if (!itemsByDataId.has(item.data)) {
                itemsByDataId.set(item.data, []);
            }
            itemsByDataId.get(item.data)!.push(item);
        });

        for (const [dataId, itemList] of itemsByDataId.entries()) {
            const config = BUILDING_ID_MAP.get(dataId);
            if (!config || config.base !== base) continue;
            
            const buildingInstances: {level: number, isUpgrading: boolean, upgradeEndTime?: string, upgradeTime?: number}[] = [];
            
            // Collect all instances from the JSON data, expanding the `cnt` field
            itemList.forEach(item => {
                const count = item.cnt || 1;
                for (let i = 0; i < count; i++) {
                     buildingInstances.push({
                        level: item.lvl,
                        isUpgrading: item.hasOwnProperty('timer'),
                        upgradeTime: item.timer,
                        upgradeEndTime: item.timer ? new Date(Date.now() + item.timer * 1000).toISOString() : undefined,
                     });
                }
            });

            // Use the game data config to get the true max count for this TH level
            let maxCount = buildingInstances.length; // Default to what's in JSON
            if (thData) {
                const buildingDataKey = config.name.replace(/ /g, '_').replace(/'/g, '').toLowerCase() as keyof typeof thData.buildings;
                const buildingInfo = thData.buildings[buildingDataKey] as { count: number; max_level: number };
                if (buildingInfo) {
                    maxCount = buildingInfo.count;
                }
            }
             // For single-instance buildings that have merged (like Barracks), force the count to 1
             if (['Barracks', 'Dark Barracks', 'Workshop', 'Pet House', 'Blacksmith', 'Laboratory', 'Spell Factory', 'Dark Spell Factory'].includes(config.name)) {
                maxCount = 1;
            }

            // Take the highest level instances up to the max count allowed by game rules
            const finalInstances = buildingInstances
                .sort((a, b) => b.level - a.level)
                .slice(0, maxCount);
            
            // Get max level from the new game data based on TH level
            let maxLevel = 1; 
            if (thData) {
                const buildingDataKey = config.name.replace(/ /g, '_').replace(/'/g, '').toLowerCase() as keyof typeof thData.buildings;
                const buildingInfo = thData.buildings[buildingDataKey] as { count: number; max_level: number };
                if (buildingInfo) {
                    maxLevel = buildingInfo.max_level;
                }
            }


            // Assign unique IDs and push the final, validated list of buildings
            finalInstances.forEach((instance, index) => {
                buildings.push({
                    id: `${config.name}-${config.base}-${index}`,
                    name: config.name,
                    level: instance.level,
                    maxLevel: maxLevel,
                    type: config.type,
                    base: config.base,
                    isUpgrading: instance.isUpgrading,
                    upgradeTime: instance.upgradeTime,
                    upgradeEndTime: instance.upgradeEndTime,
                });
            });
        }
    };
    
    processItems([...(jsonData.buildings || []), ...(jsonData.traps || [])], 'home');
    processItems([...(jsonData.buildings2 || []), ...(jsonData.traps2 || [])], 'builder');

    const processSimpleList = (jsonList: JsonItem[], configMap: Map<number, any>, targetArray: any[], type: string) => {
        if (!Array.isArray(jsonList)) return;
        jsonList.forEach(item => {
            const config = configMap.get(item.data);
            if (config) {
                 let maxLevel = 10; // Placeholder default
                if (thData) {
                     if (type === 'hero' && thData.heroes) {
                        const heroKey = Object.keys(thData.heroes).find(k => k.replace(/_/g, ' ').toLowerCase() === config.name.toLowerCase());
                        if (heroKey) maxLevel = (thData.heroes as any)[heroKey].max_level;
                    } else if ((type === 'troop' || type === 'spell') && thData.army?.troops) {
                         const troopKey = Object.keys(thData.army.troops).find(k => k.replace(/_/g, ' ').toLowerCase() === config.name.toLowerCase());
                         if(troopKey) maxLevel = (thData.army.troops as any)[troopKey].max_level;
                    }
                }

                targetArray.push({
                    id: `${config.name.replace(/\s/g, '')}-${item.data}`,
                    name: config.name,
                    level: item.lvl,
                    maxLevel: maxLevel,
                    ...(config.village && { village: config.village }),
                    ...(config.elixirType && { elixirType: config.elixirType }),
                });
            }
        });
    };

    processSimpleList(jsonData.units, TROOP_ID_MAP, troops, 'troop');
    processSimpleList(jsonData.spells, TROOP_ID_MAP, troops, 'spell'); 
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
