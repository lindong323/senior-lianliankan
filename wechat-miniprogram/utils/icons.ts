import type { IconDefinition, IconId } from "./types";

export const GAME_ICONS: IconDefinition[] = [
  { id: "sun", text: "☀️", label: "太阳", tone: 0 },
  { id: "heart", text: "❤️", label: "爱心", tone: 1 },
  { id: "star", text: "⭐", label: "星星", tone: 2 },
  { id: "moon", text: "🌙", label: "月亮", tone: 3 },
  { id: "flower", text: "🌸", label: "花朵", tone: 4 },
  { id: "apple", text: "🍎", label: "苹果", tone: 5 },
  { id: "orange", text: "🍊", label: "橘子", tone: 6 },
  { id: "grape", text: "🍇", label: "葡萄", tone: 7 },
  { id: "berry", text: "🍓", label: "草莓", tone: 8 },
  { id: "melon", text: "🍉", label: "西瓜", tone: 9 },
  { id: "bread", text: "🍞", label: "面包", tone: 0 },
  { id: "tea", text: "🍵", label: "茶杯", tone: 1 },
  { id: "house", text: "🏠", label: "房子", tone: 2 },
  { id: "car", text: "🚗", label: "小车", tone: 3 },
  { id: "bus", text: "🚌", label: "公交", tone: 4 },
  { id: "plane", text: "✈️", label: "飞机", tone: 5 },
  { id: "bike", text: "🚲", label: "自行车", tone: 6 },
  { id: "rainbow", text: "🌈", label: "彩虹", tone: 7 },
  { id: "cloud", text: "☁️", label: "云朵", tone: 8 },
  { id: "snow", text: "❄️", label: "雪花", tone: 9 },
  { id: "bell", text: "🔔", label: "铃铛", tone: 0 },
  { id: "gift", text: "🎁", label: "礼物", tone: 1 },
  { id: "balloon", text: "🎈", label: "气球", tone: 2 },
  { id: "soccer", text: "⚽", label: "足球", tone: 3 },
  { id: "basketball", text: "🏀", label: "篮球", tone: 4 },
  { id: "music", text: "🎵", label: "音乐", tone: 5 },
  { id: "book", text: "📚", label: "书本", tone: 6 },
  { id: "pencil", text: "✏️", label: "铅笔", tone: 7 },
  { id: "glasses", text: "👓", label: "眼镜", tone: 8 },
  { id: "sock", text: "🧦", label: "袜子", tone: 9 },
  { id: "cap", text: "🧢", label: "帽子", tone: 0 },
  { id: "bag", text: "👜", label: "手袋", tone: 1 },
  { id: "diamond", text: "💎", label: "钻石", tone: 2 },
  { id: "key", text: "🔑", label: "钥匙", tone: 3 },
  { id: "candle", text: "🕯️", label: "蜡烛", tone: 4 },
  { id: "puzzle", text: "🧩", label: "拼图", tone: 5 },
  { id: "kite", text: "🪁", label: "风筝", tone: 6 },
  { id: "cake", text: "🍰", label: "蛋糕", tone: 7 },
  { id: "candy", text: "🍬", label: "糖果", tone: 8 },
  { id: "plant", text: "🪴", label: "绿植", tone: 9 }
];

export const ICON_IDS: IconId[] = GAME_ICONS.map((icon) => icon.id);

const ICON_BY_ID = new Map<IconId, IconDefinition>(
  GAME_ICONS.map((icon) => [icon.id, icon])
);

export function getIconById(iconId: IconId): IconDefinition {
  const icon = ICON_BY_ID.get(iconId);

  if (!icon) {
    return GAME_ICONS[0];
  }

  return icon;
}
