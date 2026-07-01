# 老人连连看

一个适合 78 岁老人使用的离线连连看小游戏。界面大、按钮大、没有失败倒计时，点错不扣分。默认进入简单模式，支持鼠标和触摸屏点击。

本目录根项目是 Windows 桌面/Web 版，使用 Vite + React + TypeScript，并预留 Tauri 打包配置。

## 功能

- 简单：6 x 4
- 普通：8 x 6
- 挑战：10 x 8
- 两个相同图案可通过不超过 2 个转角连接时消除
- 棋盘逻辑自带一圈空白边界，支持从外侧绕行
- 没有可消除组合时会提示“洗一洗”
- 洗牌后会尽量保证至少有一组可以消除
- 内置 SVG 图案，不依赖网络图片
- 可作为普通网页运行，也可用 Tauri 打包成 Windows 桌面应用

## 项目隔离

微信小程序版本已经隔离到：

```text
wechat-miniprogram
```

以后打开微信开发者工具时，请导入 `wechat-miniprogram` 目录，不要导入本目录根路径。这样小程序的 `app.json`、`pages/`、`utils/` 和 README 不会再覆盖桌面/Web 版文件。

## 开发运行

先安装依赖：

```bash
npm install
```

启动 Web 开发版：

```bash
npm run dev
```

浏览器打开终端里显示的地址，通常是：

```text
http://127.0.0.1:5173
```

## 构建 Web 版

```bash
npm run build
```

构建成功后，网页文件会生成在：

```text
dist
```

可以用下面的命令预览：

```bash
npm run preview
```

## 构建 Windows 桌面版

本项目优先使用 Tauri。打包 Windows 版建议在 Windows 10/11 电脑上执行。

Windows 电脑需要先安装：

- Node.js LTS
- Rust
- Microsoft Visual Studio Build Tools
- Microsoft Edge WebView2 Runtime

安装依赖后运行：

```bash
npm run tauri:build
```

当前配置只生成 NSIS `.exe` 安装包，并使用当前用户安装模式，通常不需要管理员权限。安装包会内置 WebView2 离线安装器；文件会变大，但家人不需要再单独下载 WebView2。

打包完成后，安装包通常在：

```text
src-tauri\target\release\bundle\nsis
```

## 在 macOS 上给 Windows 打包

macOS 本机不适合直接生成 Windows Tauri 安装包，因为 Tauri/Rust/Windows 安装器链路需要 Windows 环境。推荐做法是把代码推到 GitHub，然后用项目里的 GitHub Actions 工作流在 Windows 云端机器上打包：

1. 把项目提交并推送到 GitHub。
2. 打开 GitHub 仓库页面。
3. 进入 `Actions`。
4. 选择 `Build Windows App`。
5. 点击 `Run workflow`。
6. 等构建完成后，在页面底部下载 `senior-lianliankan-windows` artifact。
7. 解压后，把里面的 `.exe` 安装包发给家人。

这一步需要你会使用 GitHub；你妈妈不需要安装 Node.js、Rust、Tauri 或任何开发工具。

## 最终发给家人的文件

发送 NSIS 安装包，也就是类似下面名字的文件：

```text
老人连连看_1.0.0_x64-setup.exe
```

家人双击安装包安装，之后从桌面或开始菜单打开即可。游戏本身离线运行，不需要网络、账号或后端。

## Electron 备选方案

当前项目已经集成 Tauri。如果目标电脑上的 Tauri 或 Rust 环境不好配置，可以把 `dist` 目录交给 Electron Builder 做包装。推荐优先保留现有 Web 版逻辑，另建 Electron 壳，只负责打开本地 `dist/index.html`。
