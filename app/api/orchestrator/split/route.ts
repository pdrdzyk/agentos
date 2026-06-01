import { NextResponse } from "next/server";
import { mockSplitFromGoal } from "@/lib/mock-split";
import type { SplitProposal } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { goal?: string };
  const goal = body.goal?.trim() ?? "";

  if (!goal) {
    return NextResponse.json({ error: "goal is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(mockSplitFromGoal(goal));
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `你是 AgentOS 总管 AI。根据用户的项目目标，拆分为 3-4 个任务组，每组 2-4 个任务。
只返回 JSON，格式如下：
{
  "projectName": "简短项目名",
  "groups": [{
    "name": "任务组名",
    "leadAgentRole": "组长角色描述",
    "definitionOfDone": "完成标准",
    "tasks": [{
      "name": "任务名",
      "assignee": "agent" | "human",
      "agentRole": "可选",
      "completionCriteria": "完成条件"
    }]
  }]
}

用户目标：${goal}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json(mockSplitFromGoal(goal));
    }

    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
    };
    const text = data.content?.find((c) => c.type === "text")?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(mockSplitFromGoal(goal));
    }

    const proposal = JSON.parse(jsonMatch[0]) as SplitProposal;
    if (!proposal.groups?.length) {
      return NextResponse.json(mockSplitFromGoal(goal));
    }

    return NextResponse.json(proposal);
  } catch {
    return NextResponse.json(mockSplitFromGoal(goal));
  }
}
