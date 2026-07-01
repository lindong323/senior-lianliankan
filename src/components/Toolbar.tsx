import type { Difficulty } from "../types";
import { DIFFICULTIES } from "../types";

interface ToolbarProps {
  difficulty: Difficulty;
  elapsedSeconds: number;
  remainingTiles: number;
  noMoves: boolean;
  isComplete: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onHint: () => void;
  onRestart: () => void;
  onShuffle: () => void;
}

function Toolbar({
  difficulty,
  elapsedSeconds,
  remainingTiles,
  noMoves,
  isComplete,
  onDifficultyChange,
  onHint,
  onRestart,
  onShuffle
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <span className="toolbar__title">老人连连看</span>
      </div>

      <div className="difficulty-tabs" aria-label="选择难度">
        {(Object.keys(DIFFICULTIES) as Difficulty[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`difficulty-tab ${
              difficulty === key ? "difficulty-tab--active" : ""
            }`}
            onClick={() => onDifficultyChange(key)}
            aria-pressed={difficulty === key}
          >
            {DIFFICULTIES[key].label}
          </button>
        ))}
      </div>

      <div className="toolbar__stats" aria-live="polite">
        <span>用时 {formatTime(elapsedSeconds)}</span>
        <span>剩余 {remainingTiles}</span>
      </div>

      <div className="toolbar__actions">
        <button
          type="button"
          className="action-button"
          onClick={toggleFullscreen}
        >
          全屏
        </button>
        <button
          type="button"
          className="action-button action-button--primary"
          onClick={onHint}
          disabled={isComplete || remainingTiles === 0}
        >
          提示一下
        </button>
        <button type="button" className="action-button" onClick={onRestart}>
          重新开始
        </button>
        <button
          type="button"
          className={`action-button ${noMoves ? "action-button--warning" : ""}`}
          onClick={onShuffle}
          disabled={isComplete || remainingTiles < 2}
        >
          洗一洗
        </button>
      </div>
    </header>
  );
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  await document.documentElement.requestFullscreen();
}

export default Toolbar;
