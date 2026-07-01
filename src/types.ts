export type Difficulty = "easy" | "normal" | "challenge";

export type IconId = string;

export interface DifficultySetting {
  label: string;
  rows: number;
  cols: number;
}

export interface Point {
  row: number;
  col: number;
}

export interface TileData {
  id: string;
  row: number;
  col: number;
  iconId: IconId;
  removed: boolean;
}

export type BoardData = TileData[][];

export interface MatchPath {
  points: Point[];
  turns: number;
}

export interface AvailableMatch {
  first: Point;
  second: Point;
  path: MatchPath;
}

export const DIFFICULTIES: Record<Difficulty, DifficultySetting> = {
  easy: {
    label: "简单",
    cols: 6,
    rows: 4
  },
  normal: {
    label: "普通",
    cols: 8,
    rows: 6
  },
  challenge: {
    label: "挑战",
    cols: 10,
    rows: 8
  }
};
