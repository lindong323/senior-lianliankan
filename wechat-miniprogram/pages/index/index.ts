import {
  createBoard,
  findHint,
  findPath,
  getRemainingTileCount,
  getTile,
  isBoardCleared,
  isSamePoint,
  pointKey,
  removePair,
  shuffleBoard
} from "../../utils/gameLogic";
import {
  DIFFICULTIES,
  DIFFICULTY_OPTIONS,
  type AvailableMatch,
  type BoardData,
  type Difficulty,
  type Point,
  type TileData
} from "../../utils/types";

const TILE_SIZE = 72;
const TILE_GAP = 8;
const TILE_STEP = TILE_SIZE + TILE_GAP;
const LINE_SIZE = 8;
const AUTO_SHUFFLE_MESSAGE = "没有可以消除的了，已帮你重新排列";

type ScreenName = "home" | "difficulty" | "rules" | "game" | "win";
type TimeoutId = ReturnType<typeof setTimeout>;
type IntervalId = ReturnType<typeof setInterval>;

interface DifficultyView {
  key: Difficulty;
  label: string;
  sizeText: string;
  selected: boolean;
}

interface TileView extends TileData {
  style: string;
  isSelected: boolean;
  isHint: boolean;
}

interface PathSegmentView {
  id: string;
  style: string;
}

interface PageData {
  screen: ScreenName;
  difficulty: Difficulty;
  difficultyLabel: string;
  difficultyOptions: DifficultyView[];
  boardWidth: number;
  boardHeight: number;
  tiles: TileView[];
  pathSegments: PathSegmentView[];
  hintKeys: string[];
  elapsedText: string;
  remainingText: string;
  message: string;
  winTimeText: string;
}

interface TileTapEvent {
  currentTarget: {
    dataset: {
      row?: number | string;
      col?: number | string;
    };
  };
}

interface DifficultyTapEvent {
  currentTarget: {
    dataset: {
      difficulty?: string;
    };
  };
}

interface GamePageInstance {
  data: PageData;
  board: BoardData;
  selectedPoint: Point | null;
  gameStartedAt: number;
  timerId: IntervalId | null;
  hintTimerId: TimeoutId | null;
  matchTimerId: TimeoutId | null;
  processing: boolean;
  setData(data: Partial<PageData>, callback?: () => void): void;
  startGame(): void;
  showDifficulty(): void;
  showRules(): void;
  goHome(): void;
  chooseDifficulty(event: DifficultyTapEvent): void;
  onTileTap(event: TileTapEvent): void;
  onHintTap(): void;
  onRestartTap(): void;
  onPlayAgainTap(): void;
  beginGame(difficulty: Difficulty): void;
  startTimer(): void;
  stopTimer(): void;
  updateElapsed(): void;
  clearHintTimer(): void;
  clearMatchTimer(): void;
  clearTransientTimers(): void;
  refreshBoardView(
    message?: string,
    hintKeys?: string[],
    pathSegments?: PathSegmentView[]
  ): void;
  ensurePlayableBoard(): string | null;
  showHint(hint: AvailableMatch, message?: string): void;
  finishGame(): void;
}

function createInitialData(): PageData {
  return {
    screen: "home",
    difficulty: "easy",
    difficultyLabel: DIFFICULTIES.easy.label,
    difficultyOptions: buildDifficultyViews("easy"),
    boardWidth: 0,
    boardHeight: 0,
    tiles: [],
    pathSegments: [],
    hintKeys: [],
    elapsedText: "00:00",
    remainingText: "0 对",
    message: "",
    winTimeText: ""
  };
}

Page({
  data: createInitialData(),
  board: [] as BoardData,
  selectedPoint: null as Point | null,
  gameStartedAt: 0,
  timerId: null as IntervalId | null,
  hintTimerId: null as TimeoutId | null,
  matchTimerId: null as TimeoutId | null,
  processing: false,

  onUnload(this: GamePageInstance): void {
    this.stopTimer();
    this.clearTransientTimers();
  },

  startGame(this: GamePageInstance): void {
    this.beginGame(this.data.difficulty);
  },

  showDifficulty(this: GamePageInstance): void {
    this.setData({
      screen: "difficulty",
      difficultyOptions: buildDifficultyViews(this.data.difficulty),
      message: ""
    });
  },

  showRules(this: GamePageInstance): void {
    this.setData({
      screen: "rules",
      message: ""
    });
  },

  goHome(this: GamePageInstance): void {
    this.stopTimer();
    this.clearTransientTimers();
    this.processing = false;
    this.selectedPoint = null;
    this.setData({
      screen: "home",
      pathSegments: [],
      hintKeys: [],
      message: ""
    });
  },

  chooseDifficulty(this: GamePageInstance, event: DifficultyTapEvent): void {
    const difficulty = event.currentTarget.dataset.difficulty;

    if (!isDifficulty(difficulty)) {
      return;
    }

    this.beginGame(difficulty);
  },

  onTileTap(this: GamePageInstance, event: TileTapEvent): void {
    if (this.data.screen !== "game" || this.processing) {
      return;
    }

    const row = Number(event.currentTarget.dataset.row);
    const col = Number(event.currentTarget.dataset.col);
    const point = { row, col };
    const tile = getTile(this.board, point);

    if (!tile || tile.removed) {
      return;
    }

    this.clearHintTimer();

    if (!this.selectedPoint) {
      this.selectedPoint = point;
      this.refreshBoardView("再点一个相同图案。", [], []);
      return;
    }

    const first = this.selectedPoint;
    const firstTile = getTile(this.board, first);

    if (isSamePoint(first, point)) {
      this.selectedPoint = null;
      this.refreshBoardView("已取消选择。", [], []);
      return;
    }

    if (!firstTile || firstTile.iconId !== tile.iconId) {
      this.selectedPoint = point;
      this.refreshBoardView("两个图案不一样，请再选一个。", [], []);
      return;
    }

    const path = findPath(this.board, first, point);

    if (!path) {
      this.selectedPoint = point;
      this.refreshBoardView("这两个暂时连不上，换一对试试。", [], []);
      return;
    }

    this.processing = true;
    this.selectedPoint = null;

    const nextBoard = removePair(this.board, first, point);
    const matchKeys = [pointKey(first), pointKey(point)];

    this.setData({
      tiles: buildTileViews(this.board, null, matchKeys),
      hintKeys: matchKeys,
      pathSegments: buildPathSegments(path.points),
      message: "配对成功。"
    });

    this.matchTimerId = setTimeout(() => {
      this.matchTimerId = null;
      this.board = nextBoard;

      if (isBoardCleared(this.board)) {
        this.finishGame();
        return;
      }

      const shuffleMessage = this.ensurePlayableBoard();
      this.processing = false;
      this.refreshBoardView(shuffleMessage || "配对成功，继续找下一对。", [], []);
    }, 480);
  },

  onHintTap(this: GamePageInstance): void {
    if (this.data.screen !== "game" || this.processing) {
      return;
    }

    this.clearHintTimer();
    this.selectedPoint = null;

    const hint = findHint(this.board);

    if (hint) {
      this.showHint(hint);
      return;
    }

    const shuffled = shuffleBoard(this.board);
    this.board = shuffled.board;

    if (shuffled.hint) {
      this.showHint(shuffled.hint, AUTO_SHUFFLE_MESSAGE);
      return;
    }

    this.refreshBoardView(AUTO_SHUFFLE_MESSAGE, [], []);
  },

  onRestartTap(this: GamePageInstance): void {
    this.beginGame(this.data.difficulty);
  },

  onPlayAgainTap(this: GamePageInstance): void {
    this.beginGame(this.data.difficulty);
  },

  beginGame(this: GamePageInstance, difficulty: Difficulty): void {
    const setting = DIFFICULTIES[difficulty];

    this.stopTimer();
    this.clearTransientTimers();
    this.board = createBoard(setting);
    this.selectedPoint = null;
    this.processing = false;
    this.gameStartedAt = Date.now();

    this.setData({
      screen: "game",
      difficulty,
      difficultyLabel: setting.label,
      difficultyOptions: buildDifficultyViews(difficulty),
      boardWidth: getBoardWidth(setting.cols),
      boardHeight: getBoardHeight(setting.rows),
      tiles: buildTileViews(this.board, null, []),
      pathSegments: [],
      hintKeys: [],
      elapsedText: "00:00",
      remainingText: formatRemaining(this.board),
      message: "慢慢来，点两个一样的图案。",
      winTimeText: ""
    });

    this.startTimer();
  },

  startTimer(this: GamePageInstance): void {
    this.stopTimer();
    this.updateElapsed();
    this.timerId = setInterval(() => {
      this.updateElapsed();
    }, 1000);
  },

  stopTimer(this: GamePageInstance): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  },

  updateElapsed(this: GamePageInstance): void {
    if (!this.gameStartedAt) {
      return;
    }

    this.setData({
      elapsedText: formatElapsed(Date.now() - this.gameStartedAt)
    });
  },

  clearHintTimer(this: GamePageInstance): void {
    if (this.hintTimerId) {
      clearTimeout(this.hintTimerId);
      this.hintTimerId = null;
    }
  },

  clearMatchTimer(this: GamePageInstance): void {
    if (this.matchTimerId) {
      clearTimeout(this.matchTimerId);
      this.matchTimerId = null;
    }
  },

  clearTransientTimers(this: GamePageInstance): void {
    this.clearHintTimer();
    this.clearMatchTimer();
  },

  refreshBoardView(
    this: GamePageInstance,
    message = this.data.message,
    hintKeys = this.data.hintKeys,
    pathSegments = this.data.pathSegments
  ): void {
    this.setData({
      tiles: buildTileViews(this.board, this.selectedPoint, hintKeys),
      hintKeys,
      pathSegments,
      remainingText: formatRemaining(this.board),
      message
    });
  },

  ensurePlayableBoard(this: GamePageInstance): string | null {
    if (getRemainingTileCount(this.board) === 0 || findHint(this.board)) {
      return null;
    }

    const shuffled = shuffleBoard(this.board);
    this.board = shuffled.board;
    return AUTO_SHUFFLE_MESSAGE;
  },

  showHint(
    this: GamePageInstance,
    hint: AvailableMatch,
    message = "这两个可以连起来。"
  ): void {
    const hintKeys = [pointKey(hint.first), pointKey(hint.second)];

    this.setData({
      tiles: buildTileViews(this.board, null, hintKeys),
      hintKeys,
      pathSegments: buildPathSegments(hint.path.points),
      remainingText: formatRemaining(this.board),
      message
    });

    this.hintTimerId = setTimeout(() => {
      this.hintTimerId = null;
      this.refreshBoardView("慢慢来，继续找下一对。", [], []);
    }, 1800);
  },

  finishGame(this: GamePageInstance): void {
    const finalTime = formatElapsed(Date.now() - this.gameStartedAt);

    this.stopTimer();
    this.clearTransientTimers();
    this.processing = false;
    this.selectedPoint = null;
    this.setData({
      screen: "win",
      tiles: buildTileViews(this.board, null, []),
      pathSegments: [],
      hintKeys: [],
      elapsedText: finalTime,
      remainingText: "0 对",
      message: "",
      winTimeText: finalTime
    });
  }
});

function buildDifficultyViews(current: Difficulty): DifficultyView[] {
  return DIFFICULTY_OPTIONS.map((option) => ({
    key: option.key,
    label: option.label,
    sizeText: `${option.cols} x ${option.rows}`,
    selected: option.key === current
  }));
}

function buildTileViews(
  board: BoardData,
  selectedPoint: Point | null,
  hintKeys: string[]
): TileView[] {
  const tiles: TileView[] = [];

  for (const row of board) {
    for (const tile of row) {
      const key = pointKey(tile);
      const left = (tile.col + 1) * TILE_STEP;
      const top = (tile.row + 1) * TILE_STEP;

      tiles.push({
        ...tile,
        style: `left:${left}px;top:${top}px;width:${TILE_SIZE}px;height:${TILE_SIZE}px;`,
        isSelected: Boolean(selectedPoint && isSamePoint(tile, selectedPoint)),
        isHint: hintKeys.indexOf(key) >= 0
      });
    }
  }

  return tiles;
}

function buildPathSegments(points: Point[]): PathSegmentView[] {
  const segments: PathSegmentView[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const start = pointToCenter(points[index]);
    const end = pointToCenter(points[index + 1]);

    if (start.x === end.x) {
      const top = Math.min(start.y, end.y);
      const height = Math.abs(start.y - end.y);
      segments.push({
        id: `v-${index}-${points[index].row}-${points[index].col}`,
        style: `left:${start.x - LINE_SIZE / 2}px;top:${top}px;width:${LINE_SIZE}px;height:${height}px;`
      });
      continue;
    }

    if (start.y === end.y) {
      const left = Math.min(start.x, end.x);
      const width = Math.abs(start.x - end.x);
      segments.push({
        id: `h-${index}-${points[index].row}-${points[index].col}`,
        style: `left:${left}px;top:${start.y - LINE_SIZE / 2}px;width:${width}px;height:${LINE_SIZE}px;`
      });
    }
  }

  return segments;
}

function pointToCenter(point: Point): { x: number; y: number } {
  return {
    x: point.col * TILE_STEP + TILE_SIZE / 2,
    y: point.row * TILE_STEP + TILE_SIZE / 2
  };
}

function getBoardWidth(cols: number): number {
  return (cols + 2) * TILE_SIZE + (cols + 1) * TILE_GAP;
}

function getBoardHeight(rows: number): number {
  return (rows + 2) * TILE_SIZE + (rows + 1) * TILE_GAP;
}

function formatRemaining(board: BoardData): string {
  return `${getRemainingTileCount(board) / 2} 对`;
}

function formatElapsed(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  }

  return `${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

function isDifficulty(value: string | undefined): value is Difficulty {
  return value === "easy" || value === "normal" || value === "challenge";
}
