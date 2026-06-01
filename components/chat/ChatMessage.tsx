import type { Message } from "@/lib/types";

export function ChatMessage({ message }: { message: Message }) {
  const isHuman = message.sender === "human";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <p className="py-2 text-center text-[12px] text-[#636366]">
        {message.content}
      </p>
    );
  }

  return (
    <div className={`flex flex-col ${isHuman ? "items-end" : "items-start"}`}>
      {!isHuman && message.senderRole && (
        <span className="mb-1 px-1 text-[11px] text-[#636366]">
          {message.senderRole}
        </span>
      )}
      <div
        className={`max-w-[90%] rounded-[18px] px-3.5 py-2 text-[15px] leading-snug ${
          isHuman
            ? "bg-[#0a84ff] text-white"
            : "bg-[#2c2c2e] text-[#f5f5f7]"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
