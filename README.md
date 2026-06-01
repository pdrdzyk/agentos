# AgentOS

一个人 + 一支 AI 团队，推进软件项目的操作系统（MVP）。

## MVP 功能

- 输入项目目标 → 总管 AI 拆分任务组（Anthropic API 或内置 mock）
- 确认拆分方案 → 焦距 2 任务看板（可手动改状态）
- 焦距 3：任务预览、方案 A/B 对比、群聊与决策卡片

## 本地开发

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

可选：复制 `.env.example` 为 `.env.local`，填入 `ANTHROPIC_API_KEY` 启用真实拆分。

## 部署

见 [DEPLOY.md](./DEPLOY.md) — push 到 `main` 后由 Vercel 自动构建。

Repo: https://github.com/pdrdzyk/agentos
