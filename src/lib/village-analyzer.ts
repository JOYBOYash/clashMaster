
import staticData from './static_data.json';

// Create lookup maps for efficient data retrieval
const buildingIdMap = new Map<number, any>(staticData.buildings.map(b => [b._id, b]));
const unitIdMap = new Map<number, any>(staticData.troops.map(t => [t._id, t]));
const spellIdMap = new Map<number, any>(staticData.troops.filter(t => t.production_building?.includes("Spell")).map(s => [s._id, s]));
const heroIdMap = new Map<number, any>(staticData.heroes.map(h => [h._id, h]));
const equipmentIdMap = new Map<number, any>(staticData.equipment.map(e => [e._id, e]));
const trapIdMap = new Map<number, any>(staticData.traps.map(t => [t._id, t]));

function getStaticDataById(id: number) {
    return buildingIdMap.get(id) || unitIdMap.get(id) || spellIdMap.get(id) || heroIdMap.get(id) || equipmentIdMap.get(id) || trapIdMap.get(id);
}

function getUpgradeTime(staticItem: any, targetLevel: number): number {
    if (!staticItem || !staticItem.levels || targetLevel > staticItem.levels.length) {
        return 0;
    }
    const levelData = staticItem.levels.find((l: any) => l.level === targetLevel);
    // The upgrade time for buildings is in a nested 'upgrade' object
    if (levelData?.upgrade?.time) {
        return levelData.upgrade.time;
    }
    // For other items like troops/spells, it might be at the top level of the level object
    return levelData?.upgrade_time || 0;
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

    const processItems = (items: any[], village: 'home' | 'builderBase') => {
        if (!items) return;
        items.forEach((item: any) => {
            if (item.timer) {
                 const secondsRemaining = Math.max(0, item.timer - timeDifference);
                 if (secondsRemaining > 0) {
                     const staticItem = getStaticDataById(item.data);
                     if (staticItem) {
                        const targetLevel = item.lvl + 1;
                        const totalDuration = getUpgradeTime(staticItem, targetLevel);
                        analysis.ongoingUpgrades.push({
                            name: staticItem.name,
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

    // Process Home Village buildings, heroes, spells, and traps with timers
    processItems(villageExport.buildings, 'home');
    processItems(villageExport.heroes, 'home');
    processItems(villageExport.spells, 'home');
    processItems(villageExport.traps, 'home');

    // Process Builder Base buildings, heroes, and traps with timers
    processItems(villageExport.buildings2, 'builderBase');
    processItems(villageExport.heroes2, 'builderBase');
    processItems(villageExport.traps2, 'builderBase');


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
        if (staticSpell) analysis.spells[staticSpell.name] = s.lvl;
    });

    analysis.ongoingUpgrades.sort((a, b) => a.secondsRemaining - b.secondsRemaining);

    return analysis;
}
