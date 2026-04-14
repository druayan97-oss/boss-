# Boss直评 P1 Frontend Prototype

`boss-zhipin-chat-ui/` 是当前的 `Boss直评` 前端原型工程，基于 `Vite + React + TypeScript + Tailwind`。

## 当前范围

- 榜单页
- HR 详情页
- 提名页
- 猜 Boss 落地页
- 猜 Boss 会话页
- 结果页
- 我的档案 / 设置页
- 登录门禁、Toast、空态、低样本态、离局确认

## 本地运行

前提：本机已安装 Node.js

1. 安装依赖

```bash
npm install
```

2. 启动开发预览

```bash
npm run dev
```

默认地址：`http://localhost:3000`

## 常用命令

```bash
npm run dev
npm run test
npm run lint
npm run build
```

## 说明

- 当前原型使用本地假数据和 `localStorage`
- 不依赖 Gemini / AI Studio 运行时
- `README`、入口页标题、路由和页面结构已经对齐当前原型实现
