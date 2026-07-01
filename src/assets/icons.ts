import type { IconId } from "../types";

export type IconShape =
  | {
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
    }
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx?: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
    }
  | {
      kind: "path";
      d: string;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      strokeLinecap?: "round";
      strokeLinejoin?: "round";
    }
  | {
      kind: "polygon";
      points: string;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      strokeLinejoin?: "round";
    };

export interface GameIcon {
  id: IconId;
  label: string;
  shapes: IconShape[];
}

export const GAME_ICONS: GameIcon[] = [
  {
    id: "sun",
    label: "太阳",
    shapes: [
      {
        kind: "path",
        d: "M32 7v8M32 49v8M7 32h8M49 32h8M14.5 14.5l5.7 5.7M43.8 43.8l5.7 5.7M49.5 14.5l-5.7 5.7M20.2 43.8l-5.7 5.7",
        fill: "none",
        stroke: "#b45309",
        strokeWidth: 5,
        strokeLinecap: "round"
      },
      {
        kind: "circle",
        cx: 32,
        cy: 32,
        r: 14,
        fill: "#fbbf24",
        stroke: "#92400e",
        strokeWidth: 4
      }
    ]
  },
  {
    id: "heart",
    label: "爱心",
    shapes: [
      {
        kind: "path",
        d: "M32 53C20 43 12 35 12 25c0-7 5-12 12-12 4 0 7 2 8 5 2-3 5-5 9-5 7 0 12 5 12 12 0 10-8 18-21 28Z",
        fill: "#ef4444",
        stroke: "#991b1b",
        strokeWidth: 4,
        strokeLinejoin: "round"
      }
    ]
  },
  {
    id: "star",
    label: "星星",
    shapes: [
      {
        kind: "polygon",
        points:
          "32 8 38.8 23.4 55.5 25.2 43 36.4 46.5 52.8 32 44.4 17.5 52.8 21 36.4 8.5 25.2 25.2 23.4",
        fill: "#facc15",
        stroke: "#854d0e",
        strokeWidth: 4,
        strokeLinejoin: "round"
      }
    ]
  },
  {
    id: "leaf",
    label: "叶子",
    shapes: [
      {
        kind: "path",
        d: "M50 12C31 12 15 22 14 40c0 8 6 13 14 13 17 0 23-20 22-41Z",
        fill: "#22c55e",
        stroke: "#166534",
        strokeWidth: 4,
        strokeLinejoin: "round"
      },
      {
        kind: "path",
        d: "M20 48c8-14 18-22 30-32",
        fill: "none",
        stroke: "#14532d",
        strokeWidth: 4,
        strokeLinecap: "round"
      }
    ]
  },
  {
    id: "moon",
    label: "月亮",
    shapes: [
      {
        kind: "path",
        d: "M45 48c-4 3-9 5-15 5-12 0-22-10-22-22 0-11 8-20 18-22-4 5-6 11-6 18 0 14 11 24 25 21Z",
        fill: "#60a5fa",
        stroke: "#1d4ed8",
        strokeWidth: 4,
        strokeLinejoin: "round"
      }
    ]
  },
  {
    id: "house",
    label: "房子",
    shapes: [
      {
        kind: "path",
        d: "M10 30 32 12l22 18",
        fill: "none",
        stroke: "#7c2d12",
        strokeWidth: 5,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      },
      {
        kind: "rect",
        x: 17,
        y: 29,
        width: 30,
        height: 23,
        rx: 3,
        fill: "#fb923c",
        stroke: "#7c2d12",
        strokeWidth: 4
      },
      {
        kind: "rect",
        x: 28,
        y: 38,
        width: 8,
        height: 14,
        rx: 2,
        fill: "#fff7ed",
        stroke: "#7c2d12",
        strokeWidth: 3
      }
    ]
  },
  {
    id: "bell",
    label: "铃铛",
    shapes: [
      {
        kind: "path",
        d: "M18 45h28c-4-5-5-10-5-18 0-7-4-13-9-13s-9 6-9 13c0 8-1 13-5 18Z",
        fill: "#f59e0b",
        stroke: "#92400e",
        strokeWidth: 4,
        strokeLinejoin: "round"
      },
      {
        kind: "circle",
        cx: 32,
        cy: 49,
        r: 5,
        fill: "#92400e"
      }
    ]
  },
  {
    id: "flower",
    label: "花朵",
    shapes: [
      {
        kind: "circle",
        cx: 32,
        cy: 17,
        r: 9,
        fill: "#f472b6",
        stroke: "#9d174d",
        strokeWidth: 3
      },
      {
        kind: "circle",
        cx: 47,
        cy: 32,
        r: 9,
        fill: "#f472b6",
        stroke: "#9d174d",
        strokeWidth: 3
      },
      {
        kind: "circle",
        cx: 32,
        cy: 47,
        r: 9,
        fill: "#f472b6",
        stroke: "#9d174d",
        strokeWidth: 3
      },
      {
        kind: "circle",
        cx: 17,
        cy: 32,
        r: 9,
        fill: "#f472b6",
        stroke: "#9d174d",
        strokeWidth: 3
      },
      {
        kind: "circle",
        cx: 32,
        cy: 32,
        r: 8,
        fill: "#fde047",
        stroke: "#854d0e",
        strokeWidth: 3
      }
    ]
  },
  {
    id: "diamond",
    label: "钻石",
    shapes: [
      {
        kind: "polygon",
        points: "32 8 54 28 32 56 10 28",
        fill: "#38bdf8",
        stroke: "#075985",
        strokeWidth: 4,
        strokeLinejoin: "round"
      },
      {
        kind: "path",
        d: "M10 28h44M23 10l-5 18 14 28 14-28-5-18",
        fill: "none",
        stroke: "#075985",
        strokeWidth: 3,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }
    ]
  },
  {
    id: "cup",
    label: "茶杯",
    shapes: [
      {
        kind: "path",
        d: "M18 22h29v13c0 9-6 15-15 15s-14-6-14-15V22Z",
        fill: "#a78bfa",
        stroke: "#5b21b6",
        strokeWidth: 4,
        strokeLinejoin: "round"
      },
      {
        kind: "path",
        d: "M47 27h5c4 0 7 3 7 7s-3 7-7 7h-5",
        fill: "none",
        stroke: "#5b21b6",
        strokeWidth: 4,
        strokeLinecap: "round"
      },
      {
        kind: "path",
        d: "M18 54h28",
        fill: "none",
        stroke: "#5b21b6",
        strokeWidth: 4,
        strokeLinecap: "round"
      }
    ]
  },
  {
    id: "fish",
    label: "小鱼",
    shapes: [
      {
        kind: "path",
        d: "M12 32c7-10 18-14 30-8l10-8v32l-10-8c-12 6-23 2-30-8Z",
        fill: "#34d399",
        stroke: "#065f46",
        strokeWidth: 4,
        strokeLinejoin: "round"
      },
      {
        kind: "circle",
        cx: 27,
        cy: 29,
        r: 3,
        fill: "#064e3b"
      }
    ]
  },
  {
    id: "cloud",
    label: "云朵",
    shapes: [
      {
        kind: "path",
        d: "M18 45h30c6 0 10-4 10-10s-4-10-10-10h-1c-2-8-8-13-16-13-9 0-16 7-17 16-5 1-8 5-8 9 0 5 5 8 12 8Z",
        fill: "#e0f2fe",
        stroke: "#0369a1",
        strokeWidth: 4,
        strokeLinejoin: "round"
      }
    ]
  }
];

export const ICON_IDS = GAME_ICONS.map((icon) => icon.id);

export const ICON_BY_ID = new Map(GAME_ICONS.map((icon) => [icon.id, icon]));
