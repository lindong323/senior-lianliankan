import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import {
  createBoard,
  findAvailableMatch,
  findPath,
  getRemainingTiles,
  getTile,
  isBoardCleared,
  isSamePoint,
  removePair,
  shuffleRemainingTiles
} from "./gameLogic";
import type { BoardData, Difficulty, MatchPath, Point, TileData } from "./types";
import { DIFFICULTIES } from "./types";

const LINE_VISIBLE_MS = 520;
const HINT_VISIBLE_MS = 2200;

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<BoardData>(() =>
    createBoard(DIFFICULTIES.easy)
  );
  const [selected, setSelected] = useState<Point | null>(null);
  const [hintPair, setHintPair] = useState<[Point, Point] | null>(null);
  const [visiblePath, setVisiblePath] = useState<MatchPath | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [message, setMessage] = useState("选择两个相同图案，就可以消除。");
  const [noMoves, setNoMoves] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const lineTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  const remainingTiles = useMemo(() => getRemainingTiles(board).length, [board]);

  const clearLineSoon = useCallback(() => {
    if (lineTimerRef.current !== null) {
      window.clearTimeout(lineTimerRef.current);
    }

    lineTimerRef.current = window.setTimeout(() => {
      setVisiblePath(null);
      lineTimerRef.current = null;
    }, LINE_VISIBLE_MS);
  }, []);

  const clearHintSoon = useCallback(() => {
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
    }

    hintTimerRef.current = window.setTimeout(() => {
      setHintPair(null);
      setVisiblePath(null);
      hintTimerRef.current = null;
    }, HINT_VISIBLE_MS);
  }, []);

  const startGame = useCallback((nextDifficulty: Difficulty) => {
    const nextBoard = createBoard(DIFFICULTIES[nextDifficulty]);
    setDifficulty(nextDifficulty);
    setBoard(nextBoard);
    setSelected(null);
    setHintPair(null);
    setVisiblePath(null);
    setElapsedSeconds(0);
    setNoMoves(false);
    setIsComplete(false);
    setMessage("选择两个相同图案，就可以消除。");
  }, []);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isComplete]);

  useEffect(() => {
    return () => {
      if (lineTimerRef.current !== null) {
        window.clearTimeout(lineTimerRef.current);
      }

      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current);
      }
    };
  }, []);

  const finishMove = useCallback(
    (nextBoard: BoardData) => {
      setBoard(nextBoard);

      if (isBoardCleared(nextBoard)) {
        setIsComplete(true);
        setNoMoves(false);
        setMessage("全部消除了，完成得很好。");
        return;
      }

      const nextMatch = findAvailableMatch(nextBoard);
      if (!nextMatch) {
        setNoMoves(true);
        setMessage("现在没有能消除的一对了，请点“洗一洗”。");
        return;
      }

      setNoMoves(false);
      setMessage("配对成功，继续找下一对。");
    },
    []
  );

  const handleTileClick = useCallback(
    (tile: TileData) => {
      if (tile.removed || isComplete) {
        return;
      }

      const clicked = { row: tile.row, col: tile.col };
      setHintPair(null);

      if (!selected) {
        setSelected(clicked);
        setMessage("已经选中一个图案，再选一个相同的。");
        return;
      }

      if (isSamePoint(selected, clicked)) {
        setSelected(null);
        setMessage("已取消选择。");
        return;
      }

      const selectedTile = getTile(board, selected);

      if (!selectedTile || selectedTile.removed) {
        setSelected(clicked);
        setMessage("已经选中新的图案。");
        return;
      }

      const path = findPath(board, selected, clicked);

      if (path) {
        const nextBoard = removePair(board, selected, clicked);
        setSelected(null);
        setVisiblePath(path);
        clearLineSoon();
        finishMove(nextBoard);
        return;
      }

      setSelected(clicked);
      setMessage(
        selectedTile.iconId === tile.iconId
          ? "这两个图案暂时连不上，已帮您选中新的图案。"
          : "图案不同，已帮您选中新的图案。"
      );
    },
    [board, clearLineSoon, finishMove, isComplete, selected]
  );

  const handleHint = useCallback(() => {
    const match = findAvailableMatch(board);

    if (!match) {
      setNoMoves(true);
      setMessage("现在没有能消除的一对了，请点“洗一洗”。");
      return;
    }

    setSelected(match.first);
    setHintPair([match.first, match.second]);
    setVisiblePath(match.path);
    setMessage("亮起来的两个图案可以消除。");
    clearHintSoon();
  }, [board, clearHintSoon]);

  const handleShuffle = useCallback(() => {
    const result = shuffleRemainingTiles(board);
    setBoard(result.board);
    setSelected(null);
    setHintPair(null);
    setVisiblePath(null);

    if (result.match) {
      setNoMoves(false);
      setMessage("已经洗好了，棋盘上至少有一对可以消除。");
      return;
    }

    setNoMoves(true);
    setMessage("还没有找到可消除的一对，请再洗一次。");
  }, [board]);

  return (
    <main className="app-shell">
      <section className="game-shell" aria-label="老人连连看游戏">
        <Toolbar
          difficulty={difficulty}
          elapsedSeconds={elapsedSeconds}
          remainingTiles={remainingTiles}
          noMoves={noMoves}
          isComplete={isComplete}
          onDifficultyChange={startGame}
          onHint={handleHint}
          onRestart={() => startGame(difficulty)}
          onShuffle={handleShuffle}
        />

        <div
          className={`message-bar ${noMoves ? "message-bar--attention" : ""}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>

        <Board
          board={board}
          selected={selected}
          hintPair={hintPair}
          path={visiblePath}
          onTileClick={handleTileClick}
        />
      </section>
    </main>
  );
}

export default App;
