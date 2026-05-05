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
import type { AiGenerateResponse, AiMessage } from "@/types/ai";
import type { ChatMessage, ChatRole } from "@/types/chat";

type ChatApiResponse = AiGenerateResponse & {
  error?: string;
};

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
  const [providerMode, setProviderMode] = useState("mock");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  function toAiMessages(chatMessages: ChatMessage[]): AiMessage[] {
    return chatMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  async function requestAssistantResponse(
    chatMessages: ChatMessage[],
  ): Promise<AiGenerateResponse> {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: toAiMessages(chatMessages),
      }),
    });
    const payload = (await response.json()) as ChatApiResponse;

    if (!response.ok) {
      throw new Error(payload.error ?? "Unable to generate a response.");
    }

    return payload;
  }

  function handleSend(content: string) {
    const userMessage = createMessage("user", content);
    const conversationMessages = [...messages, userMessage];

    setMessages(conversationMessages);
    setIsResponding(true);
    setErrorMessage(null);

    window.setTimeout(() => {
      void requestAssistantResponse(conversationMessages)
        .then((response) => {
          const assistantMessage = createMessage("assistant", response.content);
          const fallbackReason = response.metadata?.fallbackReason;
          const selectionNote = response.metadata?.selectionNote;

          setProviderMode(response.provider);
          setErrorMessage(
            typeof fallbackReason === "string"
              ? fallbackReason
              : typeof selectionNote === "string"
                ? selectionNote
                : null,
          );
          setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
          ]);
        })
        .catch(() => {
          const assistantMessage = createMessage(
            "assistant",
            createMockAssistantResponse(content),
          );

          setProviderMode("mock");
          setErrorMessage("AI route failed; local mock fallback used.");
          setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
          ]);
        })
        .finally(() => {
          setIsResponding(false);
        });
    }, 250);
  }

  function handleClearChat() {
    setMessages([]);
    setErrorMessage(null);
    clearLocalChatMessages();
  }

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
        Chat
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
        Chat com IA
      </h2>
      <p className="mt-4 max-w-2xl text-zinc-700 dark:text-zinc-300">
        O SENSEI roteia o chat pela API interna de providers de IA. Gemini só
        é usado quando configurado explicitamente; caso contrário, o provider
        mock local mantém o chat disponível. Não há persistência Supabase,
        streaming ou RAG. As mensagens ficam salvas apenas neste navegador.
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        Modo do provider: {providerMode}
      </p>

      {errorMessage ? (
        <p className="mt-4 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
          {errorMessage}
        </p>
      ) : null}

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
