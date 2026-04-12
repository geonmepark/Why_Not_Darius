import type { Champion, DDragonChampionResponse, Position } from '@/types/champion';

const DDRAGON_BASE = 'https://ddragon.leagueoflegends.com';
const CDRAGON_POSITIONS_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-rune-recommendations.json';

interface RuneRecommendationEntry {
  championId: number;
  runeRecommendations: Array<{ position: string; mapId: number }>;
}

// key(숫자 문자열) → Position[]
export async function fetchChampionPositions(): Promise<Record<string, Position[]>> {
  const res = await fetch(CDRAGON_POSITIONS_URL);
  if (!res.ok) throw new Error('Champion positions fetch failed');
  const data: RuneRecommendationEntry[] = await res.json();

  const result: Record<string, Position[]> = {};
  for (const entry of data) {
    const positions = [
      ...new Set(
        entry.runeRecommendations
          .filter((r) => r.mapId === 11 && r.position !== 'NONE')
          .map((r) => r.position as Position),
      ),
    ];
    if (positions.length > 0) {
      result[String(entry.championId)] = positions;
    }
  }
  return result;
}

export async function fetchLatestVersion(): Promise<string> {
  const res = await fetch(`${DDRAGON_BASE}/api/versions.json`);
  if (!res.ok) throw new Error('DDragon versions fetch failed');
  const versions: string[] = await res.json();
  return versions[0];
}

export async function fetchChampions(version: string): Promise<Omit<Champion, 'positions'>[]> {
  const res = await fetch(`${DDRAGON_BASE}/cdn/${version}/data/ko_KR/champion.json`);
  if (!res.ok) throw new Error('DDragon champions fetch failed');
  const json: DDragonChampionResponse = await res.json();

  return Object.values(json.data).map((c) => ({
    id: c.id,
    key: c.key,
    name: c.name,
    tags: c.tags,
    imageUrl: `${DDRAGON_BASE}/cdn/${version}/img/champion/${c.id}.png`,
  }));
}
