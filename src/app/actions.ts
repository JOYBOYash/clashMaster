
'use server';

import { getPlayerInfo, type PlayerApiResponse } from '@/services/coc-api';
import { VillageStateSchema, type VillageState, ALL_BUILDINGS_CONFIG, type Building, ALL_TROOPS_CONFIG, type Troop } from '@/lib/constants';
import { z } from 'zod';

const PlayerTagSchema = z.string().startsWith('#').min(4);

type FetchResult = {
    success: boolean;
    data?: VillageState;
    error?: string;
    errorCode?: 'API_FORBIDDEN' | 'NOT_FOUND' | 'GENERIC_ERROR';
};

export async function fetchAndProcessVillageData(playerTag: string): Promise<FetchResult> {
    const parsedTag = PlayerTagSchema.safeParse(playerTag);
    if (!parsedTag.success) {
        return { success: false, error: 'Invalid Player Tag. It must start with a #.', errorCode: 'GENERIC_ERROR' };
    }

    try {
        const player: PlayerApiResponse = await getPlayerInfo(parsedTag.data);

        const buildings: Building[] = (player.buildings || [])
            .map((apiBuilding, index) => {
                if (apiBuilding.village !== 'home' && apiBuilding.village !== 'builderBase') {
                    return null;
                }
                
                const config = ALL_BUILDINGS_CONFIG.find(b => b.name === apiBuilding.name);
                if (!config) return null;

                const base = apiBuilding.village === 'home' ? 'home' : 'builder';
                
                return {
                    id: `${apiBuilding.name.replace(/\s/g, '')}-${index}`,
                    name: apiBuilding.name,
                    level: apiBuilding.level,
                    maxLevel: apiBuilding.maxLevel,
                    type: config.type,
                    base: base,
                    isUpgrading: false,
                };
            })
            .filter((b): b is Building => b !== null);
            
        const troops: Troop[] = (player.troops || [])
            .map((apiTroop, index) => {
                 if (apiTroop.village !== 'home' && apiTroop.village !== 'builderBase') {
                    return null;
                }
                const config = ALL_TROOPS_CONFIG.find(t => t.name === apiTroop.name);
                if (!config) return null;

                const village = apiTroop.village === 'home' ? 'home' : 'builder';

                return {
                    id: `${apiTroop.name.replace(/\s/g, '')}-${index}`,
                    name: apiTroop.name,
                    level: apiTroop.level,
                    maxLevel: apiTroop.maxLevel,
                    village: village,
                    elixirType: config.elixirType,
                }
            })
            .filter((t): t is Troop => t !== null);

        const villageState: VillageState = {
            townHallLevel: player.townHallLevel,
            builderHallLevel: player.builderHallLevel ?? 0,
            buildings: buildings,
            troops: troops,
        };

        const validation = VillageStateSchema.safeParse(villageState);
        if (!validation.success) {
            console.error("Data validation failed:", validation.error.flatten());
            return { success: false, error: 'Failed to process village data from API.', errorCode: 'GENERIC_ERROR' };
        }

        return { success: true, data: validation.data };

    } catch (error: any) {
        if (error.message && error.message.includes('403')) {
            return { success: false, error: error.message, errorCode: 'API_FORBIDDEN' };
        }
         if (error.message && error.message.includes('404')) {
            return { success: false, error: error.message, errorCode: 'NOT_FOUND' };
        }
        return { success: false, error: error.message || 'An unknown error occurred.', errorCode: 'GENERIC_ERROR' };
    }
}
