
import staticData from './static_data.json';

// Create lookup maps for efficient data retrieval
const buildingIdMap = new Map<number, any>(staticData.buildings.map(b => [b._id, b]));
const unitIdMap = new Map<number, any>(static_data.troops.map(t => [t._id, t]));
const spellIdMap = new Map<number, any>(static_data.troops.filter(t => t.production_building.includes("Spell")).map(s => [s._id, s]));
const heroIdMap = new Map<number, any>(staticData.heroes.map(h => [h._id, h]));
const equipmentIdMap = new Map<number, any>(staticData.equipment.map(e => [e._id, e]));

function getStaticDataById(id: number) {
    return buildingIdMap.get(id) || unitIdMap.get(id) || spellIdMap.get(id) || heroIdMap.get(id) || equipmentIdMap.get(id);
}

function getUpgradeTime(staticItem: any, targetLevel: number): number {
    if (!staticItem || !staticItem.levels || targetLevel > staticItem.levels.length) {
        return 0;
    }
    // Find the level data for the target upgrade level
    const levelData = staticItem.levels.find((l: any) => l.level === targetLevel);
    // The upgrade time is nested inside the 'upgrade' object
    return levelData?.upgrade?.time || 0;
}

export interface OngoingUpgrade {
    name: string;
    level: number;
    secondsRemaining: number;
    totalDurationInSeconds: number;
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
    
    // Find the Town Hall to determine the player's TH level
    const townHallData = villageExport.buildings.find((b: any) => b.data === 1000001);
    if (!townHallData) {
        throw new Error("Town Hall data not found in export.");
    }
    const townHallLevel = townHallData.lvl;

    const analysis: VillageAnalysis = {
        player: {
            name: "Player", // Name is not in this export, default it
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

    // Process buildings and ongoing upgrades
    villageExport.buildings.forEach((b: any) => {
        const staticBuilding = getStaticDataById(b.data);
        if (!staticBuilding) return;

        if (!analysis.buildings[staticBuilding.name]) {
            analysis.buildings[staticBuilding.name] = [];
        }
        analysis.buildings[staticBuilding.name].push(b.lvl);

        if (b.timer) {
            const secondsRemaining = Math.max(0, b.timer - timeDifference);
            if (secondsRemaining > 0) {
                const targetLevel = b.lvl + 1;
                const totalDuration = getUpgradeTime(staticBuilding, targetLevel);
                 analysis.ongoingUpgrades.push({
                    name: staticBuilding.name,
                    level: targetLevel,
                    secondsRemaining: secondsRemaining,
                    totalDurationInSeconds: totalDuration,
                });
            }
        }
    });

    // Process heroes and ongoing upgrades
    if (villageExport.heroes) {
        villageExport.heroes.forEach((h: any) => {
            const staticHero = getStaticDataById(h.data);
            if (!staticHero) return;

            analysis.heroes[staticHero.name] = h.lvl;

            if (h.timer) {
                 const secondsRemaining = Math.max(0, h.timer - timeDifference);
                 if (secondsRemaining > 0) {
                    const targetLevel = h.lvl + 1;
                    const totalDuration = getUpgradeTime(staticHero, targetLevel);
                    analysis.ongoingUpgrades.push({
                        name: staticHero.name,
                        level: targetLevel,
                        secondsRemaining: secondsRemaining,
                        totalDurationInSeconds: totalDuration, 
                    });
                 }
            }
        });
    }

    // Process units (troops)
    if (villageExport.units) {
        villageExport.units.forEach((u: any) => {
            const staticUnit = getStaticDataById(u.data);
            if (staticUnit) {
                 analysis.units[staticUnit.name] = u.lvl;
            }
        });
    }

    // Process spells and lab upgrades
    if (villageExport.spells) {
        villageExport.spells.forEach((s: any) => {
            const staticSpell = getStaticDataById(s.data);
            if (staticSpell) {
                analysis.spells[staticSpell.name] = s.lvl;

                if (s.timer) {
                    const secondsRemaining = Math.max(0, s.timer - timeDifference);
                    if (secondsRemaining > 0) {
                       const targetLevel = s.lvl + 1;
                       const totalDuration = getUpgradeTime(staticSpell, targetLevel);
                       analysis.ongoingUpgrades.push({
                           name: `${staticSpell.name} Research`,
                           level: targetLevel,
                           secondsRemaining: secondsRemaining,
                           totalDurationInSeconds: totalDuration
                       });
                    }
                }
            }
        });
    }
    
    // Sort upgrades by time remaining
    analysis.ongoingUpgrades.sort((a, b) => a.secondsRemaining - b.secondsRemaining);

    return analysis;
}
