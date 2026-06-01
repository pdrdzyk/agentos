"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { newId } from "./id";
import { mockSplitFromGoal } from "./mock-split";
import { seedGroupMessages } from "./simulation";
import type {
  Decision,
  FocusLevel,
  Message,
  Project,
  SplitProposal,
  Task,
  TaskGroup,
  TaskStatus,
} from "./types";

interface AgentOSState {
  focus: FocusLevel;
  projects: Project[];
  taskGroups: TaskGroup[];
  tasks: Task[];
  messages: Message[];
  decisions: Decision[];
  currentProjectId: string | null;
  currentGroupId: string | null;
  currentTaskId: string | null;
  pendingProposal: SplitProposal | null;
  pendingProjectGoal: string | null;
  previewOption: "A" | "B";
  isSplitting: boolean;

  setFocus: (focus: FocusLevel) => void;
  setPreviewOption: (option: "A" | "B") => void;
  selectProject: (projectId: string) => void;
  selectGroup: (groupId: string) => void;
  selectTask: (taskId: string) => void;
  startProject: (goal: string) => Promise<void>;
  confirmSplit: () => void;
  rejectSplit: () => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  resolveDecision: (decisionId: string, chosenLabel: string) => void;
  approveTask: (taskId: string) => void;
}

function buildEntitiesFromProposal(
  goal: string,
  proposal: SplitProposal,
): {
  project: Project;
  groups: TaskGroup[];
  tasks: Task[];
  messages: Message[];
  decisions: Decision[];
} {
  const projectId = newId();
  const project: Project = {
    id: projectId,
    name: proposal.projectName,
    goal,
    status: "planning",
    createdAt: new Date().toISOString(),
  };

  const groups: TaskGroup[] = [];
  const tasks: Task[] = [];
  const messages: Message[] = [];
  const decisions: Decision[] = [];

  proposal.groups.forEach((g, gi) => {
    const groupId = newId();
    const group: TaskGroup = {
      id: groupId,
      projectId,
      name: g.name,
      leadAgentRole: g.leadAgentRole,
      definitionOfDone: g.definitionOfDone,
      status: gi === 0 ? "active" : "pending",
    };
    groups.push(group);

    const groupTasks: Task[] = g.tasks.map((t, ti) => {
      const isDecisionTask =
        t.name.includes("风格") ||
        t.name.includes("方案") ||
        t.name.includes("A/B");

      return {
        id: newId(),
        groupId,
        name: t.name,
        assignee: t.assignee,
        agentRole: t.agentRole,
        status: isDecisionTask
          ? "pending_decision"
          : t.name.includes("验收")
            ? "pending_approval"
            : t.assignee === "human"
              ? "todo"
              : ti === 0
                ? "in_progress"
                : "todo",
        completionCriteria: t.completionCriteria,
        previewVariant: isDecisionTask ? "A" : undefined,
      };
    });
    tasks.push(...groupTasks);
    messages.push(...seedGroupMessages(group, groupTasks));

    const decisionTask = groupTasks.find(
      (t) => t.status === "pending_decision",
    );
    if (decisionTask) {
      const decisionId = newId();
      decisions.push({
        id: decisionId,
        taskId: decisionTask.id,
        question: "请选择主界面视觉方案",
        options: [
          {
            label: "方案 A",
            description: "深色控制台风格，强调信息密度与专业感",
            previewKey: "A",
          },
          {
            label: "方案 B",
            description: "浅色卡片风格，强调留白与可读性",
            previewKey: "B",
          },
        ],
        createdAt: new Date().toISOString(),
      });
      messages.push({
        id: newId(),
        groupId,
        taskId: decisionTask.id,
        sender: "lead_agent",
        senderRole: group.leadAgentRole,
        content: "需要你选择 UI 方向后才能继续下游任务。",
        type: "decision_request",
        decisionId,
        createdAt: new Date().toISOString(),
      });
    }
  });

  messages.unshift({
    id: newId(),
    groupId: groups[0]?.id ?? "global",
    sender: "orchestrator",
    senderRole: "总管 AI",
    content: `已为「${proposal.projectName}」生成 ${proposal.groups.length} 个任务组，请确认拆分方案。`,
    type: "system",
    createdAt: new Date().toISOString(),
  });

  return { project, groups, tasks, messages, decisions };
}

export const useAgentOS = create<AgentOSState>()(
  persist(
    (set, get) => ({
      focus: 1,
      projects: [],
      taskGroups: [],
      tasks: [],
      messages: [],
      decisions: [],
      currentProjectId: null,
      currentGroupId: null,
      currentTaskId: null,
      pendingProposal: null,
      pendingProjectGoal: null,
      previewOption: "A",
      isSplitting: false,

      setFocus: (focus) => set({ focus }),
      setPreviewOption: (previewOption) => set({ previewOption }),

      selectProject: (projectId) => {
        const groups = get().taskGroups.filter((g) => g.projectId === projectId);
        set({
          currentProjectId: projectId,
          currentGroupId: groups[0]?.id ?? null,
          currentTaskId: null,
          focus: 2,
        });
      },

      selectGroup: (groupId) => {
        const tasks = get().tasks.filter((t) => t.groupId === groupId);
        const decisionTask = tasks.find(
          (t) =>
            t.status === "pending_decision" ||
            t.status === "pending_approval",
        );
        set({
          currentGroupId: groupId,
          currentTaskId: decisionTask?.id ?? tasks[0]?.id ?? null,
          focus: 3,
        });
      },

      selectTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        set({
          currentTaskId: taskId,
          currentGroupId: task.groupId,
          focus: 3,
        });
      },

      startProject: async (goal) => {
        set({ isSplitting: true, pendingProjectGoal: goal });
        let proposal: SplitProposal;
        try {
          const res = await fetch("/api/orchestrator/split", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ goal }),
          });
          if (!res.ok) throw new Error("split failed");
          proposal = (await res.json()) as SplitProposal;
        } catch {
          proposal = mockSplitFromGoal(goal);
        }
        set({
          pendingProposal: proposal,
          isSplitting: false,
          focus: 1,
        });
      },

      confirmSplit: () => {
        const { pendingProposal, pendingProjectGoal } = get();
        if (!pendingProposal || !pendingProjectGoal) return;

        const built = buildEntitiesFromProposal(
          pendingProjectGoal,
          pendingProposal,
        );
        built.project.status = "active";

        set((s) => ({
          projects: [...s.projects, built.project],
          taskGroups: [...s.taskGroups, ...built.groups],
          tasks: [...s.tasks, ...built.tasks],
          messages: [...s.messages, ...built.messages],
          decisions: [...s.decisions, ...built.decisions],
          currentProjectId: built.project.id,
          currentGroupId: built.groups[0]?.id ?? null,
          currentTaskId: null,
          pendingProposal: null,
          pendingProjectGoal: null,
          focus: 2,
        }));
      },

      rejectSplit: () => {
        set({ pendingProposal: null, pendingProjectGoal: null });
      },

      updateTaskStatus: (taskId, status) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, status } : t,
          ),
        }));
      },

      resolveDecision: (decisionId, chosenLabel) => {
        const state = get();
        const decision = state.decisions.find((d) => d.id === decisionId);
        if (!decision) return;

        const task = state.tasks.find((t) => t.id === decision.taskId);
        if (!task) return;

        set((s) => ({
          decisions: s.decisions.map((d) =>
            d.id === decisionId ? { ...d, chosenOption: chosenLabel } : d,
          ),
          tasks: s.tasks.map((t) =>
            t.id === task.id
              ? {
                  ...t,
                  status: "completed",
                  previewVariant: chosenLabel.includes("B") ? "B" : "A",
                }
              : t,
          ),
          messages: [
            ...s.messages,
            {
              id: newId(),
              groupId: task.groupId,
              taskId: task.id,
              sender: "human",
              senderRole: "你",
              content: `已选择：${chosenLabel}。请继续执行后续任务。`,
              type: "progress",
              createdAt: new Date().toISOString(),
            },
            {
              id: newId(),
              groupId: task.groupId,
              taskId: task.id,
              sender: "lead_agent",
              senderRole:
                s.taskGroups.find((g) => g.id === task.groupId)?.leadAgentRole ??
                "组长 AI",
              content: "收到。执行 Agent 将根据你的选择更新界面实现。",
              type: "system",
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      approveTask: (taskId) => {
        get().updateTaskStatus(taskId, "completed");
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        set((s) => ({
          messages: [
            ...s.messages,
            {
              id: newId(),
              groupId: task.groupId,
              taskId: task.id,
              sender: "human",
              senderRole: "你",
              content: `已批准任务「${task.name}」。`,
              type: "progress",
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },
    }),
    {
      name: "agentos-mvp",
      partialize: (s) => ({
        focus: s.focus,
        projects: s.projects,
        taskGroups: s.taskGroups,
        tasks: s.tasks,
        messages: s.messages,
        decisions: s.decisions,
        currentProjectId: s.currentProjectId,
        currentGroupId: s.currentGroupId,
        currentTaskId: s.currentTaskId,
        previewOption: s.previewOption,
      }),
    },
  ),
);
