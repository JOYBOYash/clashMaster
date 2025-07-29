
import staticData from './static_data.json';

// Type definitions for clarity
interface ExportBuilding {
    data: number;
    lvl: number;
    timer?: number;
    cnt?: number;
}
interface ExportUnit {
    data: number;
    lvl: number;
}
interface ExportHero {
    data: number;
    lvl: number;
    timer?: number;
}
interface VillageExport {
    tag: string;
    timestamp: number;
    buildings: ExportBuilding[];
    heroes: ExportHero[];
    units: ExportUnit[];
    spells: ExportUnit[];
    // Add other fields as needed
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
    buildings: Record<string, number[]>; // Building name -> list of levels
    heroes: Record<string, number>; // Hero name -> level
    units: Record<string, number>;
    spells: Record<string, number>;
    ongoingUpgrades: OngoingUpgrade[];
}

const buildingIdMap = new Map<number, any>(staticData.buildings.map(b => [b._id, b]));
// Spells are troops with specific production buildings. Filter them out from the main troop list.
const troopIdMap = new Map<number, any>(staticData.troops.filter(t => t.production_building !== 'Spell Factory' && t.production_building !== 'Dark Spell Factory').map(t => [t._id, t]));
const spellIdMap = new Map<number, any>(staticData.troops.filter(t => t.production_building === 'Spell Factory' || t.production_building === 'Dark Spell Factory').map(s => [s._id, s]));
const heroIdMap = new Map<number, any>(staticData.heroes.map(h => [h._id, h]));

function getStaticDataById(id: number) {
    return buildingIdMap.get(id) 
        || troopIdMap.get(id) 
        || spellIdMap.get(id) 
        || heroIdMap.get(id);
}

function getUpgradeTime(entityData: any, level: number): number {
    if (!entityData || !entityData.levels) return 0;
    // The upgrade time for level N is stored in the data for level N-1.
    const levelData = entityData.levels.find((l: any) => l.level === level - 1);
    return levelData?.upgrade?.time || 0;
}

export function analyzeVillage(data: VillageExport): VillageAnalysis {
    const analysis: VillageAnalysis = {
        player: {
            name: 'Player', // Name is not in export, default it
            tag: data.tag,
            townHallLevel: 0
        },
        buildings: {},
        heroes: {},
        units: {},
        spells: {},
        ongoingUpgrades: []
    };

    // Process buildings and ongoing upgrades
    data.buildings.forEach(b => {
        const staticBuilding = getStaticDataById(b.data);
        if (!staticBuilding) return;

        const name = staticBuilding.name;
        if (!analysis.buildings[name]) {
            analysis.buildings[name] = [];
        }
        
        const count = b.cnt || 1;
        for (let i = 0; i < count; i++) {
            analysis.buildings[name].push(b.lvl);
        }

        if (name === 'Town Hall') {
            analysis.player.townHallLevel = b.lvl;
        }

        if (b.timer) {
            const totalDuration = getUpgradeTime(staticBuilding, b.lvl + 1);
            analysis.ongoingUpgrades.push({
                name: name,
                level: b.lvl + 1,
                secondsRemaining: b.timer,
                totalDurationInSeconds: totalDuration,
            });
        }
    });

    // Process heroes and ongoing upgrades
    data.heroes.forEach(h => {
        const staticHero = getStaticDataById(h.data);
        if (!staticHero) return;
        analysis.heroes[staticHero.name] = h.lvl;

        if (h.timer) {
            const totalDuration = getUpgradeTime(staticHero, h.lvl + 1);
            analysis.ongoingUpgrades.push({
                name: staticHero.name,
                level: h.lvl + 1,
                secondsRemaining: h.timer,
                totalDurationInSeconds: totalDuration,
            });
        }
    });

    // Process units (troops)
    data.units.forEach(u => {
        const staticUnit = troopIdMap.get(u.data); // Use troopIdMap specifically
        if (staticUnit) {
            analysis.units[staticUnit.name] = u.lvl;
        }
    });

    // Process spells
    data.spells.forEach(s => {
        const staticSpell = spellIdMap.get(s.data); // Use spellIdMap specifically
        if (staticSpell) {
            analysis.spells[staticSpell.name] = s.lvl;
        }
    });


    // Find research in progress (assumes only one research at a time)
    const lab = data.buildings.find(b => getStaticDataById(b.data)?.name === 'Laboratory');
    if (lab && lab.timer) {
        // This is tricky because the export doesn't say *what* is upgrading.
        // We'll have to make an educated guess or leave it generic.
        // For now, let's add a generic "Laboratory Research" placeholder.
         analysis.ongoingUpgrades.push({
            name: "Laboratory Research",
            level: 0, // We don't know the level
            secondsRemaining: lab.timer,
            totalDurationInSeconds: 0 // Cannot be known from export
         });
    }


    return analysis;
}
