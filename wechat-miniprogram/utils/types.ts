export type Difficulty = "easy" | "normal" | "challenge";

export interface DifficultySetting {
  label: string;
  rows: number;
  cols: number;
}

export interface DifficultyOption {
  key: Difficulty;
  label: string;
  rows: number;
  cols: number;
}

export type IconId = string;

export interface IconDefinition {
  id: IconId;
  text: string;
  label: string;
  tone: number;
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
  iconText: string;
  iconLabel: string;
  iconTone: number;
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

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    key: "easy",
    label: DIFFICULTIES.easy.label,
    rows: DIFFICULTIES.easy.rows,
    cols: DIFFICULTIES.easy.cols
  },
  {
    key: "normal",
    label: DIFFICULTIES.normal.label,
    rows: DIFFICULTIES.normal.rows,
    cols: DIFFICULTIES.normal.cols
  },
  {
    key: "challenge",
    label: DIFFICULTIES.challenge.label,
    rows: DIFFICULTIES.challenge.rows,
    cols: DIFFICULTIES.challenge.cols
  }
];
