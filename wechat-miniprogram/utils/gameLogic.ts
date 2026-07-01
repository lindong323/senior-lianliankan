import { getIconById, ICON_IDS } from "./icons";
import type {
  AvailableMatch,
  BoardData,
  DifficultySetting,
  IconId,
  MatchPath,
  Point,
  TileData
} from "./types";

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 }
] as const;

interface SearchState {
  point: Point;
  direction: number;
  turns: number;
  route: Point[];
}

export function createBoard(setting: DifficultySetting): BoardData {
  const totalCells = setting.rows * setting.cols;
  const iconIds: IconId[] = [];

  for (let pairIndex = 0; pairIndex < totalCells / 2; pairIndex += 1) {
    const iconId = ICON_IDS[pairIndex % ICON_IDS.length];
    iconIds.push(iconId, iconId);
  }

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const board = buildBoardFromIcons(shuffle(iconIds), setting.rows, setting.cols);

    if (findHint(board)) {
      return board;
    }
  }

  return buildBoardFromIcons(iconIds, setting.rows, setting.cols);
}

export function findPath(
  board: BoardData,
  first: Point,
  second: Point
): MatchPath | null {
  return findPathInternal(board, first, second, true);
}

export function findHint(board: BoardData): AvailableMatch | null {
  const tiles = getRemainingTiles(board);

  for (let index = 0; index < tiles.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < tiles.length; otherIndex += 1) {
      if (tiles[index].iconId !== tiles[otherIndex].iconId) {
        continue;
      }

      const first = toPoint(tiles[index]);
      const second = toPoint(tiles[otherIndex]);
      const path = findPath(board, first, second);

      if (path) {
        return { first, second, path };
      }
    }
  }

  return null;
}

export function hasAvailableMatch(board: BoardData): boolean {
  return findHint(board) !== null;
}

export function removePair(
  board: BoardData,
  first: Point,
  second: Point
): BoardData {
  return board.map((row) =>
    row.map((tile) => {
      if (isSamePoint(tile, first) || isSamePoint(tile, second)) {
        return { ...tile, removed: true };
      }

      return { ...tile };
    })
  );
}

export function shuffleBoard(board: BoardData): {
  board: BoardData;
  hint: AvailableMatch | null;
} {
  const positions = getRemainingTiles(board).map(toPoint);
  const icons = positions.map((point) => board[point.row][point.col].iconId);

  if (positions.length <= 2) {
    const unchanged = cloneBoard(board);
    return { board: unchanged, hint: findHint(unchanged) };
  }

  for (let attempt = 0; attempt < 500; attempt += 1) {
    const next = replaceIcons(board, positions, shuffle(icons));
    const hint = findHint(next);

    if (hint) {
      return { board: next, hint };
    }
  }

  const forced = forceAtLeastOneMatch(board, positions, icons);
  return { board: forced, hint: findHint(forced) };
}

export function isBoardCleared(board: BoardData): boolean {
  return getRemainingTileCount(board) === 0;
}

export function getRemainingTileCount(board: BoardData): number {
  let count = 0;

  for (const row of board) {
    for (const tile of row) {
      if (!tile.removed) {
        count += 1;
      }
    }
  }

  return count;
}

export function getRemainingTiles(board: BoardData): TileData[] {
  const tiles: TileData[] = [];

  for (const row of board) {
    for (const tile of row) {
      if (!tile.removed) {
        tiles.push(tile);
      }
    }
  }

  return tiles;
}

export function getTile(board: BoardData, point: Point): TileData | null {
  const row = board[point.row];

  if (!row) {
    return null;
  }

  return row[point.col] || null;
}

export function isSamePoint(first: Point, second: Point): boolean {
  return first.row === second.row && first.col === second.col;
}

export function pointKey(point: Point): string {
  return `${point.row}:${point.col}`;
}

function findPathInternal(
  board: BoardData,
  first: Point,
  second: Point,
  requireSameIcon: boolean
): MatchPath | null {
  if (isSamePoint(first, second)) {
    return null;
  }

  const firstTile = getTile(board, first);
  const secondTile = getTile(board, second);

  if (!firstTile || !secondTile || firstTile.removed || secondTile.removed) {
    return null;
  }

  if (requireSameIcon && firstTile.iconId !== secondTile.iconId) {
    return null;
  }

  const start = toExpandedPoint(first);
  const target = toExpandedPoint(second);
  const maxRow = board.length + 1;
  const maxCol = board[0].length + 1;
  const queue: SearchState[] = [];
  const visited = new Map<string, number>();

  DIRECTIONS.forEach((direction, directionIndex) => {
    const next = {
      row: start.row + direction.row,
      col: start.col + direction.col
    };

    if (canVisit(board, next, start, target, maxRow, maxCol)) {
      queue.push({
        point: next,
        direction: directionIndex,
        turns: 0,
        route: [start, next]
      });
      visited.set(visitKey(next, directionIndex), 0);
    }
  });

  while (queue.length > 0) {
    const current = queue.shift() as SearchState;

    if (isSamePoint(current.point, target)) {
      const points = compressRoute(current.route);
      return {
        points,
        turns: countTurns(points)
      };
    }

    DIRECTIONS.forEach((direction, directionIndex) => {
      const turns =
        directionIndex === current.direction
          ? current.turns
          : current.turns + 1;

      if (turns > 2) {
        return;
      }

      const next = {
        row: current.point.row + direction.row,
        col: current.point.col + direction.col
      };

      if (!canVisit(board, next, start, target, maxRow, maxCol)) {
        return;
      }

      const key = visitKey(next, directionIndex);
      const previousTurns = visited.get(key);

      if (previousTurns !== undefined && previousTurns <= turns) {
        return;
      }

      visited.set(key, turns);
      queue.push({
        point: next,
        direction: directionIndex,
        turns,
        route: current.route.concat(next)
      });
    });
  }

  return null;
}

function canVisit(
  board: BoardData,
  point: Point,
  start: Point,
  target: Point,
  maxRow: number,
  maxCol: number
): boolean {
  if (point.row < 0 || point.row > maxRow || point.col < 0 || point.col > maxCol) {
    return false;
  }

  if (isSamePoint(point, start) || isSamePoint(point, target)) {
    return true;
  }

  if (point.row === 0 || point.row === maxRow || point.col === 0 || point.col === maxCol) {
    return true;
  }

  const tile = board[point.row - 1][point.col - 1];
  return tile.removed;
}

function compressRoute(route: Point[]): Point[] {
  if (route.length <= 2) {
    return route;
  }

  const result: Point[] = [route[0]];

  for (let index = 1; index < route.length - 1; index += 1) {
    const previous = result[result.length - 1];
    const current = route[index];
    const next = route[index + 1];
    const sameRow = previous.row === current.row && current.row === next.row;
    const sameCol = previous.col === current.col && current.col === next.col;

    if (!sameRow && !sameCol) {
      result.push(current);
    }
  }

  result.push(route[route.length - 1]);
  return result;
}

function countTurns(points: Point[]): number {
  return Math.max(0, points.length - 2);
}

function forceAtLeastOneMatch(
  board: BoardData,
  positions: Point[],
  icons: IconId[]
): BoardData {
  const connectablePair = findConnectablePositionPair(board, positions);
  const iconForPair = findIconWithPair(icons);

  if (!connectablePair || !iconForPair) {
    return cloneBoard(board);
  }

  const nextIcons = icons.slice();
  const firstIndex = positions.findIndex((point) =>
    isSamePoint(point, connectablePair[0])
  );
  const secondIndex = positions.findIndex((point) =>
    isSamePoint(point, connectablePair[1])
  );

  moveIconToIndex(nextIcons, iconForPair, firstIndex, secondIndex);
  moveIconToIndex(nextIcons, iconForPair, secondIndex, firstIndex);

  return replaceIcons(board, positions, nextIcons);
}

function findConnectablePositionPair(
  board: BoardData,
  positions: Point[]
): [Point, Point] | null {
  for (let index = 0; index < positions.length; index += 1) {
    for (let otherIndex = index + 1; otherIndex < positions.length; otherIndex += 1) {
      if (findPathInternal(board, positions[index], positions[otherIndex], false)) {
        return [positions[index], positions[otherIndex]];
      }
    }
  }

  return null;
}

function findIconWithPair(icons: IconId[]): IconId | null {
  const counts = new Map<IconId, number>();

  for (const icon of icons) {
    counts.set(icon, (counts.get(icon) || 0) + 1);
  }

  for (const entry of counts) {
    if (entry[1] >= 2) {
      return entry[0];
    }
  }

  return null;
}

function moveIconToIndex(
  icons: IconId[],
  icon: IconId,
  targetIndex: number,
  reservedIndex: number
): void {
  if (icons[targetIndex] === icon) {
    return;
  }

  const sourceIndex = icons.findIndex(
    (candidate, index) => candidate === icon && index !== reservedIndex
  );

  if (sourceIndex >= 0) {
    const saved = icons[targetIndex];
    icons[targetIndex] = icons[sourceIndex];
    icons[sourceIndex] = saved;
  }
}

function replaceIcons(
  board: BoardData,
  positions: Point[],
  icons: IconId[]
): BoardData {
  const iconByPosition = new Map<string, IconId>();

  positions.forEach((point, index) => {
    iconByPosition.set(pointKey(point), icons[index]);
  });

  return board.map((row) =>
    row.map((tile) => {
      const iconId = iconByPosition.get(pointKey(tile));

      if (!iconId) {
        return { ...tile };
      }

      return createTile(tile.row, tile.col, iconId, tile.removed);
    })
  );
}

function buildBoardFromIcons(
  icons: IconId[],
  rows: number,
  cols: number
): BoardData {
  let iconIndex = 0;
  const board: BoardData = [];

  for (let row = 0; row < rows; row += 1) {
    const boardRow: TileData[] = [];

    for (let col = 0; col < cols; col += 1) {
      boardRow.push(createTile(row, col, icons[iconIndex], false));
      iconIndex += 1;
    }

    board.push(boardRow);
  }

  return board;
}

function createTile(row: number, col: number, iconId: IconId, removed: boolean): TileData {
  const icon = getIconById(iconId);

  return {
    id: `${row}-${col}`,
    row,
    col,
    iconId,
    iconText: icon.text,
    iconLabel: icon.label,
    iconTone: icon.tone,
    removed
  };
}

function cloneBoard(board: BoardData): BoardData {
  return board.map((row) => row.map((tile) => ({ ...tile })));
}

function shuffle<T>(items: T[]): T[] {
  const result = items.slice();

  for (let index = result.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    const saved = result[index];
    result[index] = result[otherIndex];
    result[otherIndex] = saved;
  }

  return result;
}

function toExpandedPoint(point: Point): Point {
  return {
    row: point.row + 1,
    col: point.col + 1
  };
}

function toPoint(tile: TileData): Point {
  return {
    row: tile.row,
    col: tile.col
  };
}

function visitKey(point: Point, direction: number): string {
  return `${pointKey(point)}:${direction}`;
}
