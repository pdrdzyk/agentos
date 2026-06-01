import type { SplitProposal } from "./types";

export function mockSplitFromGoal(goal: string): SplitProposal {
  const name =
    goal.length > 32 ? `${goal.slice(0, 32).trim()}…` : goal.trim() || "新项目";

  return {
    projectName: name,
    groups: [
      {
        name: "UI 层",
        leadAgentRole: "产品设计组长 · 负责界面与交互方案",
        definitionOfDone: "主要页面线框与视觉方向已确认，可进入前端实现",
        tasks: [
          {
            name: "信息架构与导航结构",
            assignee: "agent",
            agentRole: "UX 设计师 Agent",
            completionCriteria: "站点地图与关键用户路径文档",
          },
          {
            name: "核心页面高保真方案",
            assignee: "agent",
            agentRole: "UI 设计师 Agent",
            completionCriteria: "首页与主流程页面两套可选方案",
          },
          {
            name: "确认视觉风格",
            assignee: "human",
            completionCriteria: "在 A/B 方案中选定一个方向",
          },
        ],
      },
      {
        name: "逻辑层",
        leadAgentRole: "全栈组长 · 负责数据模型与 API",
        definitionOfDone: "核心 API 与状态管理可用，前后端契约明确",
        tasks: [
          {
            name: "数据模型与 Supabase 表结构",
            assignee: "agent",
            agentRole: "后端工程师 Agent",
            completionCriteria: "表结构与 RLS 草案通过评审",
          },
          {
            name: "总管 AI 拆分接口",
            assignee: "agent",
            agentRole: "AI 集成 Agent",
            completionCriteria: "输入目标可返回任务组 JSON",
          },
        ],
      },
      {
        name: "集成层",
        leadAgentRole: "交付组长 · 负责联调与验收",
        definitionOfDone: "端到端流程可演示，部署到 Vercel",
        tasks: [
          {
            name: "三焦距界面联调",
            assignee: "agent",
            agentRole: "前端工程师 Agent",
            completionCriteria: "焦距 1/2/3 切换与看板数据一致",
          },
          {
            name: "里程碑验收",
            assignee: "human",
            completionCriteria: "你确认 MVP 可对外演示",
          },
        ],
      },
    ],
  };
}
