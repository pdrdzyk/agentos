export type ProjectStatus = "planning" | "active" | "completed";
export type TaskGroupStatus = "pending" | "active" | "reviewing" | "completed";
export type TaskStatus =
  | "todo"
  | "in_progress"
  | "pending_decision"
  | "pending_approval"
  | "completed"
  | "blocked";
export type FocusLevel = 1 | 2 | 3;
export type MessageSender = "orchestrator" | "lead_agent" | "agent" | "human";
export type MessageType =
  | "progress"
  | "decision_request"
  | "approval_request"
  | "system";

export interface Project {
  id: string;
  name: string;
  goal: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface TaskGroup {
  id: string;
  projectId: string;
  name: string;
  leadAgentRole: string;
  definitionOfDone: string;
  status: TaskGroupStatus;
}

export interface Task {
  id: string;
  groupId: string;
  name: string;
  assignee: "agent" | "human";
  agentRole?: string;
  status: TaskStatus;
  output?: string;
  completionCriteria: string;
  previewVariant?: "A" | "B";
}

export interface DecisionOption {
  label: string;
  description: string;
  previewKey?: "A" | "B";
}

export interface Decision {
  id: string;
  taskId: string;
  question: string;
  options: DecisionOption[];
  chosenOption?: string;
  needsIntervention?: boolean;
  interventionReason?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  groupId: string;
  taskId?: string;
  sender: MessageSender;
  senderRole?: string;
  content: string;
  type: MessageType;
  decisionId?: string;
  createdAt: string;
}

export interface ProposedGroup {
  name: string;
  leadAgentRole: string;
  definitionOfDone: string;
  tasks: {
    name: string;
    assignee: "agent" | "human";
    agentRole?: string;
    completionCriteria: string;
  }[];
}

export interface SplitProposal {
  projectName: string;
  groups: ProposedGroup[];
}
