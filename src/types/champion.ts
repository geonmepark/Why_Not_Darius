export interface DDragonChampionImage {
  full: string;
}

export interface DDragonChampionData {
  id: string;
  key: string;
  name: string;
  tags: string[];
  image: DDragonChampionImage;
}

export interface DDragonChampionResponse {
  data: Record<string, DDragonChampionData>;
}

export type Position = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';

export const POSITION_LABEL: Record<Position | 'ALL', string> = {
  ALL: '전체',
  TOP: '탑',
  JUNGLE: '정글',
  MIDDLE: '미드',
  BOTTOM: '원딜',
  UTILITY: '서폿',
};

export const POSITIONS: Position[] = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

export interface Champion {
  id: string;
  key: string;
  name: string;
  tags: string[];
  imageUrl: string;
  positions: Position[];
}

// opponentChampionId → counterChampionIds (최대 3개)
export type CounterMap = Record<string, string[]>;
