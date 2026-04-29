"use client";

import { useEffect, useRef, useState } from "react";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatToolbar } from "@/components/chat/chat-toolbar";
import {
  clearLocalChatMessages,
  loadLocalChatMessages,
  saveLocalChatMessages,
} from "@/lib/chat/local-chat-storage";
import { createMockAssistantResponse } from "@/lib/chat/mock-chat";
import type { ChatMessage, ChatRole } from "@/types/chat";

function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export default function WorkspaceChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      hasHydrated.current = true;
      setMessages(loadLocalChatMessages());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveLocalChatMessages(messages);
  }, [messages]);

  function handleSend(content: string) {
    const userMessage = createMessage("user", content);

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsResponding(true);

    window.setTimeout(() => {
      const assistantMessage = createMessage(
        "assistant",
        createMockAssistantResponse(content),
      );

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setIsResponding(false);
    }, 250);
  }

  function handleClearChat() {
    setMessages([]);
    clearLocalChatMessages();
  }

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Chat
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Local chat mock
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
        This is the first local-only SENSEI interaction. Responses are
        deterministic mock mentor replies. There is no AI provider, API route,
        Supabase persistence, streaming, or RAG. Messages are saved locally in
        this browser only.
      </p>

      <ChatToolbar
        disabled={isResponding}
        hasMessages={messages.length > 0}
        onClear={handleClearChat}
      />

      <section className="mt-8">
        {messages.length > 0 ? (
          <ChatMessageList
            isResponding={isResponding}
            messages={messages}
          />
        ) : (
          <ChatEmptyState />
        )}
      </section>

      <ChatInput disabled={isResponding} onSend={handleSend} />
    </div>
  );
}
