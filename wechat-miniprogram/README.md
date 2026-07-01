# 妈妈连连看微信小程序版

这是隔离出来的原生微信小程序版连连看，面向老人使用。它不依赖根目录的 React/Vite 入口，也不会参与桌面/Web 版构建。

## 主要文件

```text
app.json
app.wxss
app.ts
pages/index/index.wxml
pages/index/index.wxss
pages/index/index.ts
utils/gameLogic.ts
utils/types.ts
utils/icons.ts
```

## 用微信开发者工具运行

1. 打开微信开发者工具。
2. 选择“导入项目”。
3. 项目目录选择这个文件夹：

```text
/Users/lindongzhang/Documents/连连看小游戏/wechat-miniprogram
```

4. AppID 可以选择测试号，或使用项目里的 `touristappid` 体验。
5. 导入后点击“编译”，首页会显示“妈妈连连看”。
6. 点击“预览”即可用手机扫码体验。

## 本地 TypeScript 检查

从根目录运行：

```bash
npm exec tsc -p wechat-miniprogram/tsconfig.miniprogram.json --noEmit
```
