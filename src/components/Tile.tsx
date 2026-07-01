import { memo } from "react";
import { ICON_BY_ID, type IconShape } from "../assets/icons";
import type { TileData } from "../types";

interface TileProps {
  tile: TileData;
  isSelected: boolean;
  isHinted: boolean;
  onClick: (tile: TileData) => void;
}

function renderShape(shape: IconShape, index: number) {
  switch (shape.kind) {
    case "circle":
      return <circle key={index} {...shape} />;
    case "rect":
      return <rect key={index} {...shape} />;
    case "polygon":
      return <polygon key={index} {...shape} />;
    case "path":
      return <path key={index} {...shape} />;
    default:
      return null;
  }
}

function Tile({ tile, isSelected, isHinted, onClick }: TileProps) {
  const icon = ICON_BY_ID.get(tile.iconId);
  const className = [
    "tile",
    tile.removed ? "tile--removed" : "",
    isSelected ? "tile--selected" : "",
    isHinted ? "tile--hinted" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      disabled={tile.removed}
      onClick={() => onClick(tile)}
      aria-label={
        tile.removed
          ? "空白"
          : `${icon?.label ?? "图案"}，第 ${tile.row + 1} 行，第 ${tile.col + 1} 列`
      }
    >
      {!tile.removed && icon ? (
        <svg
          className="tile__icon"
          viewBox="0 0 64 64"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          {icon.shapes.map(renderShape)}
        </svg>
      ) : null}
    </button>
  );
}

export default memo(Tile);
