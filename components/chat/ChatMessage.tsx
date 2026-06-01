import type { Message } from "@/lib/types";

const senderLabel: Record<Message["sender"], string> = {
  orchestrator: "总管 AI",
  lead_agent: "组长",
  agent: "Agent",
  human: "你",
};

export function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.sender === "human";
  const isSystem = message.type === "system";
  const isCard =
    message.type === "decision_request" || message.type === "approval_request";

  if (isSystem) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-600/80 bg-zinc-800/40 px-3 py-2 text-xs text-zinc-400">
        <span className="font-medium text-zinc-300">
          {message.senderRole ?? senderLabel[message.sender]}
        </span>
        <p className="mt-1">{message.content}</p>
      </div>
    );
  }

  if (isCard) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-sm">
        <p className="text-xs font-semibold text-amber-400">
          {message.senderRole ?? senderLabel[message.sender]}
        </p>
        <p className="mt-1 text-amber-100">{message.content}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isHuman ? "items-end" : "items-start"}`}>
      <span className="mb-0.5 text-[10px] text-zinc-500">
        {message.senderRole ?? senderLabel[message.sender]}
      </span>
      <div
        className={`max-w-[95%] rounded-2xl px-3 py-2 text-sm ${
          isHuman
            ? "bg-emerald-700/80 text-emerald-50"
            : "bg-zinc-800 text-zinc-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
