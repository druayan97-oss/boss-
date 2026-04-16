# Boss直评 (Boss Direct Review)

> **职场透明化社区，让招聘方行为更透明。**

**Boss直评** 是一个专注于提升招聘市场信息对称性的职场社区项目。通过用户真实的提名与评价，我们旨在为求职者提供关于招聘方（HR/猎头）行为的透明参考，帮助求职者识别“已读不回”的沟通黑洞，同时表彰那些反馈及时、态度专业的“Nice HR”。

---

## 核心功能

项目目前处于前端原型阶段（v1），已实现以下核心业务模块：

| 模块 | 功能描述 | 状态 |
| :--- | :--- | :--- |
| **职聘榜单** | 提供“已读不回 HR 榜”、“简历黑洞公司榜”及“Nice HR 榜”，基于用户提名数据实时排序。 | ✅ 已实现 |
| **HR 详情** | 展示特定招聘方的标签统计、提名记录、岗位 JD 及社区评分。 | ✅ 已实现 |
| **匿名提名** | 支持用户对招聘方进行行为打标（如：秒回、沉默、专业等），支持覆盖更新。 | ✅ 已实现 |
| **猜 Boss 练习** | 模拟真实 IM 聊天场景的互动游戏，帮助求职者通过历史数据预判招聘方的回复概率。 | ✅ 已实现 |
| **个人档案** | 用户可配置自己的招呼语、院校层级与专业门类，用于模拟练习与数据匹配。 | ✅ 已实现 |
| **每周简报** | 社区维度的周度数据汇总与趋势分析入口。 | 🚧 迭代中 |

---

## 技术栈

本项目前端部分采用现代 Web 开发技术栈，注重性能与开发体验：

- **框架**: [React 19](https://react.dev/) (最新稳定版)
- **构建工具**: [Vite 6](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [TailwindCSS 4](https://tailwindcss.com/) (高性能原子化 CSS)
- **路由**: [React Router 7](https://reactrouter.com/)
- **图标**: [Lucide React](https://lucide.dev/)
- **动画**: [Motion](https://motion.dev/) (原 Framer Motion)
- **测试**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 项目结构

```text
boss/
├── boss-zhipin-chat-ui/    # 前端 React 应用程序源代码
│   ├── src/
│   │   ├── app/            # 全局状态、路由与 Shell 布局
│   │   ├── components/     # 通用 UI 组件与业务逻辑组件
│   │   ├── data/           # 种子数据与初始状态
│   │   ├── pages/          # 页面级组件
│   │   └── types/          # TypeScript 类型定义
│   └── vite.config.ts      # Vite 配置文件
├── docs/                   # 产品需求文档 (PRD) 与设计规范
│   ├── 2026-04-05-boss-direct-review-design.md        # 主 PRD
│   ├── 2026-04-09-boss-direct-review-frontend-prd.md  # 前端设计规范
│   └── 2026-04-09-boss-direct-review-cold-start-prd.md # 冷启动策略
└── README.md               # 项目主说明文档
```

---

## 快速开始

### 环境要求

- Node.js 18.x 或更高版本
- pnpm / npm / yarn

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/druayan97-oss/boss-.git
   cd boss-
   ```

2. **安装依赖**
   ```bash
   cd boss-zhipin-chat-ui
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 [http://localhost:3000](http://localhost:3000) 查看应用。

4. **运行测试**
   ```bash
   npm run test
   ```

---

## 开发者指南

### 原型阶段说明
当前版本为 **前端交互原型**，具有以下特性：
- **本地存储**: 所有用户操作（提名、档案修改、游戏进度）均持久化在浏览器的 `localStorage` 中。
- **模拟数据**: 初始数据由 `src/data/seed.ts` 提供，包含演示用的 HR 档案与提名记录。
- **无后端依赖**: 暂不需要配置 API 密钥或数据库，可直接运行。

### 文档规范
所有新增的功能或技术方案应先在 `docs/` 目录下创建对应的 Markdown 文档，并遵循 `YYYY-MM-DD-<主题>.md` 的命名约定。

---

## 免责声明

1. **数据来源**: 本项目展示的所有数据均来自用户自发提名或系统模拟，不代表任何官方平台的立场。
2. **非官方关联**: 本项目与“Boss直聘”或其他招聘平台无任何官方关联，仅作为职场社区交流与模拟练习工具。
3. **隐私保护**: 提名记录经过脱敏处理，请勿在评价中泄露个人隐私或进行人身攻击。



---

## 参与贡献

我们欢迎任何形式的贡献，包括但不限于：
- 提交 Issue 报告 Bug 或提出新功能建议。
- 提交 Pull Request 改进代码或文档。
- 参与讨论，分享你对职场透明化的见解。

在提交 PR 之前，请确保已通过本地测试：
```bash
npm run test
```
