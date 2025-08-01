
import staticData from './static_data.json';

// Define the types based on the provided JSON structure
interface LevelData {
    level: number;
    upgrade_time?: number;
    upgrade?: { time?: number };
    [key: string]: any;
}

interface StaticItem {
    _id: number;
    name: string;
    levels: LevelData[];
    [key: string]: any;
}

// Create a lookup map for efficient data retrieval from static_data.json
const idToStaticDataMap = new Map<number, StaticItem>(
    [...staticData.buildings, ...staticData.troops, ...staticData.heroes, ...staticData.equipment, ...staticData.traps].map(item => [item._id, item])
);

function getStaticDataById(id: number): StaticItem | undefined {
    return idToStaticDataMap.get(id);
}

function getUpgradeTime(staticItem: StaticItem | undefined, targetLevel: number): number {
    if (!staticItem || !staticItem.levels || targetLevel > staticItem.levels.length) {
        return 0;
    }
    // Find the data for the level *being upgraded to*
    const levelData = staticItem.levels.find((l: any) => l.level === targetLevel);
    if (!levelData) return 0;

    // The upgrade time for buildings is in a nested 'upgrade' object
    if (levelData.upgrade && typeof levelData.upgrade.time === 'number') {
        return levelData.upgrade.time;
    }
    // For other items like troops/spells, it might be at the top level of the level object
    return levelData.upgrade_time || 0;
}


export interface OngoingUpgrade {
    name: string;
    level: number;
    secondsRemaining: number;
    totalDurationInSeconds: number;
    village: 'home' | 'builderBase';
}

export interface VillageAnalysis {
    player: {
        name: string;
        tag: string;
        townHallLevel: number;
    };
    buildings: Record<string, number[]>;
    heroes: Record<string, number>;
    units: Record<string, number>;
    spells: Record<string, number>;
    ongoingUpgrades: OngoingUpgrade[];
}

/**
 * Analyzes the player's village data from the game's JSON export.
 * @param villageExport - The parsed JSON object from the game export.
 * @returns A structured analysis of the village.
 */
export function analyzeVillage(villageExport: any): VillageAnalysis {
    if (!villageExport || !villageExport.tag) {
        throw new Error("Invalid or empty village export data provided.");
    }
    
    const townHallData = villageExport.buildings.find((b: any) => b.data === 1000001);
    if (!townHallData) {
        throw new Error("Town Hall data not found in export.");
    }
    const townHallLevel = townHallData.lvl;

    const analysis: VillageAnalysis = {
        player: {
            name: villageExport.name || "Player",
            tag: villageExport.tag,
            townHallLevel: townHallLevel
        },
        buildings: {},
        heroes: {},
        units: {},
        spells: {},
        ongoingUpgrades: []
    };

    const serverTimeAtExport = villageExport.timestamp;
    const clientTimeAtAnalysis = Math.floor(Date.now() / 1000);
    const timeDifference = clientTimeAtAnalysis - serverTimeAtExport;

    const processUpgradableItems = (items: any[], village: 'home' | 'builderBase') => {
        if (!items) return;
        items.forEach((item: any) => {
            if (item.timer && item.timer > 0) {
                 const secondsRemaining = Math.max(0, item.timer - timeDifference);
                 if (secondsRemaining > 0) {
                     const staticItem = getStaticDataById(item.data);
                     if (staticItem) {
                        const targetLevel = item.lvl + 1;
                        const totalDuration = getUpgradeTime(staticItem, targetLevel);
                         let name = staticItem.name;
                         if(item.data === 26000000) { // Lightning spell is an outlier
                             name += " Spell"
                         } else if (name.endsWith("Spell") && name !== "Spell Factory") {
                             // No change needed
                         } else if (staticItem.production_building?.includes("Spell")) {
                            name += " Spell"
                         }


                        analysis.ongoingUpgrades.push({
                            name,
                            level: targetLevel,
                            secondsRemaining,
                            totalDurationInSeconds: totalDuration,
                            village: village,
                        });
                     }
                 }
            }
        });
    };

    // Process Home Village items
    processUpgradableItems(villageExport.buildings, 'home');
    processUpgradableItems(villageExport.heroes, 'home');
    processUpgradableItems(villageExport.spells, 'home');

    // Process Builder Base items
    processUpgradableItems(villageExport.buildings2, 'builderBase');
    processUpgradableItems(villageExport.heroes2, 'builderBase');


    // Process all buildings for level mapping
    villageExport.buildings?.forEach((b: any) => {
        const staticBuilding = getStaticDataById(b.data);
        if (!staticBuilding) return;
        if (!analysis.buildings[staticBuilding.name]) {
            analysis.buildings[staticBuilding.name] = [];
        }
        analysis.buildings[staticBuilding.name].push(b.lvl);
    });

    // Process all heroes
    villageExport.heroes?.forEach((h: any) => {
        const staticHero = getStaticDataById(h.data);
        if (staticHero) analysis.heroes[staticHero.name] = h.lvl;
    });

    // Process all units
    villageExport.units?.forEach((u: any) => {
        const staticUnit = getStaticDataById(u.data);
        if (staticUnit) analysis.units[staticUnit.name] = u.lvl;
    });

    // Process all spells
    villageExport.spells?.forEach((s: any) => {
        const staticSpell = getStaticDataById(s.data);
        let name = staticSpell?.name;
        if (!name) return;
        
        if (s.data === 26000000) { // Lightning spell is an outlier
            name += " Spell"
        } else if (name.endsWith("Spell")) {
            // no change
        } else if (staticSpell.production_building?.includes("Spell")) {
            name += " Spell"
        }
        
        if (staticSpell) analysis.spells[name] = s.lvl;
    });

    analysis.ongoingUpgrades.sort((a, b) => a.secondsRemaining - b.secondsRemaining);

    return analysis;
}
