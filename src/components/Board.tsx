import type { CSSProperties } from "react";
import Tile from "./Tile";
import type { BoardData, MatchPath, Point, TileData } from "../types";
import { isSamePoint } from "../gameLogic";

const TILE_SIZE = 72;

interface BoardProps {
  board: BoardData;
  selected: Point | null;
  hintPair: [Point, Point] | null;
  path: MatchPath | null;
  onTileClick: (tile: TileData) => void;
}

function Board({ board, selected, hintPair, path, onTileClick }: BoardProps) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const linePoints =
    path?.points.map((point) => `${point.col * TILE_SIZE},${point.row * TILE_SIZE}`).join(" ") ??
    "";

  return (
    <div className="board-scroll" aria-label="连连看棋盘">
      <div
        className="board-frame"
        style={{
          "--rows": rows,
          "--cols": cols,
          "--tile-size": `${TILE_SIZE}px`
        } as CSSProperties}
      >
        <svg
          className="path-layer"
          viewBox={`0 0 ${(cols + 1) * TILE_SIZE} ${(rows + 1) * TILE_SIZE}`}
          aria-hidden="true"
          focusable="false"
        >
          {linePoints ? (
            <>
              <polyline className="path-layer__halo" points={linePoints} />
              <polyline className="path-layer__line" points={linePoints} />
            </>
          ) : null}
        </svg>

        <div className="board-grid">
          {board.flat().map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              isSelected={selected ? isSamePoint(tile, selected) : false}
              isHinted={isHinted(tile, hintPair)}
              onClick={onTileClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function isHinted(tile: TileData, hintPair: [Point, Point] | null): boolean {
  if (!hintPair || tile.removed) {
    return false;
  }

  return hintPair.some((point) => isSamePoint(tile, point));
}

export default Board;
