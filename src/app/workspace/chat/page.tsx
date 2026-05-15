"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ChatEmptyState } from "@/components/chat/chat-empty-state";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessageList } from "@/components/chat/chat-message-list";
import { ChatToolbar } from "@/components/chat/chat-toolbar";
import {
  clearLocalChatMessages,
  clearLocalChatThreadId,
  loadLocalChatMessages,
  loadLocalChatThreadId,
  saveLocalChatMessages,
  saveLocalChatThreadId,
} from "@/lib/chat/local-chat-storage";
import { createMockAssistantResponse } from "@/lib/chat/mock-chat";
import type { AiGenerateResponse, AiMessage } from "@/types/ai";
import type { ChatMessage, ChatRole } from "@/types/chat";

type ChatApiResponse = AiGenerateResponse & {
  error?: string;
};

type ChatThread = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

type ChatThreadsApiResponse = {
  available?: boolean;
  error?: string;
  threads?: ChatThread[];
  thread?: ChatThread;
};

type ChatMessagesApiResponse = {
  available?: boolean;
  error?: string;
  threadId?: string;
  messages?: ChatMessage[];
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
  const [historyMode, setHistoryMode] = useState("local");
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasHydrated = useRef(false);

  function toAiMessages(chatMessages: ChatMessage[]): AiMessage[] {
    return chatMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
  }

  const refreshThreads = useCallback(async (): Promise<ChatThread[] | null> => {
    try {
      const response = await fetch("/api/chat/threads", {
        cache: "no-store",
      });
      const payload = (await response.json()) as ChatThreadsApiResponse;

      if (!response.ok || !payload.available || !payload.threads) {
        setThreads([]);
        setHistoryMode("local");
        return null;
      }

      setThreads(payload.threads);
      setHistoryMode(payload.threads.length > 0 ? "supabase" : "supabase-ready");

      return payload.threads;
    } catch {
      setThreads([]);
      setHistoryMode("local");
      return null;
    }
  }, []);

  const persistMessages = useCallback(async (
    threadId: string | null,
    messagesToPersist: ChatMessage[],
  ): Promise<string | null> => {
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId,
          title:
            messagesToPersist.find((message) => message.role === "user")
              ?.content ?? "Conversa principal",
          messages: messagesToPersist,
        }),
      });
      const payload = (await response.json()) as ChatMessagesApiResponse;

      if (!response.ok || !payload.available || !payload.threadId) {
        setHistoryMode("local");
        return threadId;
      }

      setActiveThreadId(payload.threadId);
      saveLocalChatThreadId(payload.threadId);
      setHistoryMode("supabase");
      void refreshThreads();

      return payload.threadId;
    } catch {
      setHistoryMode("local");
      return threadId;
    }
  }, [refreshThreads]);

  const loadRemoteHistory = useCallback(
    async (localThreadId: string | null, localMessages: ChatMessage[]) => {
      try {
        const remoteThreads = await refreshThreads();

        if (!remoteThreads) {
          setHistoryMode("local");
          return;
        }

        const remoteThread =
          remoteThreads.find(
            (thread) => thread.id === localThreadId,
          ) ?? remoteThreads[0];

        if (!remoteThread) {
          setHistoryMode("supabase-ready");
          return;
        }

        const messagesResponse = await fetch(
          `/api/chat/messages?threadId=${encodeURIComponent(remoteThread.id)}`,
          { cache: "no-store" },
        );
        const messagesPayload =
          (await messagesResponse.json()) as ChatMessagesApiResponse;

        if (!messagesResponse.ok || !messagesPayload.available) {
          setHistoryMode("local");
          return;
        }

        setActiveThreadId(remoteThread.id);
        saveLocalChatThreadId(remoteThread.id);
        setHistoryMode("supabase");

        if (messagesPayload.messages && messagesPayload.messages.length > 0) {
          setMessages(messagesPayload.messages);
          saveLocalChatMessages(messagesPayload.messages);
        } else if (localMessages.length > 0) {
          void persistMessages(remoteThread.id, localMessages);
        }
      } catch {
        setHistoryMode("local");
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [persistMessages, refreshThreads],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const localMessages = loadLocalChatMessages();
      const localThreadId = loadLocalChatThreadId();

      hasHydrated.current = true;
      setMessages(localMessages);
      setActiveThreadId(localThreadId);
      void loadRemoteHistory(localThreadId, localMessages);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRemoteHistory]);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveLocalChatMessages(messages);
  }, [messages]);

  async function archiveRemoteThread(threadId: string | null) {
    if (!threadId) {
      return;
    }

    try {
      await fetch(`/api/chat/threads?threadId=${encodeURIComponent(threadId)}`, {
        method: "DELETE",
      });
      void refreshThreads();
    } catch {
      // Local fallback already clears browser state.
    }
  }

  async function loadThreadMessages(threadId: string) {
    setIsLoadingHistory(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/chat/messages?threadId=${encodeURIComponent(threadId)}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as ChatMessagesApiResponse;

      if (!response.ok || !payload.available || !payload.messages) {
        setHistoryMode("local");
        setErrorMessage("Nao foi possivel abrir esta conversa no Supabase.");
        return;
      }

      setMessages(payload.messages);
      setActiveThreadId(threadId);
      saveLocalChatMessages(payload.messages);
      saveLocalChatThreadId(threadId);
      setHistoryMode("supabase");
    } catch {
      setHistoryMode("local");
      setErrorMessage("Historico remoto indisponivel; fallback local mantido.");
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleNewChat() {
    setMessages([]);
    setErrorMessage(null);
    clearLocalChatMessages();

    if (historyMode !== "supabase" && historyMode !== "supabase-ready") {
      setActiveThreadId(null);
      clearLocalChatThreadId();
      setHistoryMode("local");
      return;
    }

    try {
      const response = await fetch("/api/chat/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Nova conversa" }),
      });
      const payload = (await response.json()) as ChatThreadsApiResponse;

      if (!response.ok || !payload.available || !payload.thread) {
        setActiveThreadId(null);
        clearLocalChatThreadId();
        setHistoryMode("local");
        return;
      }

      setActiveThreadId(payload.thread.id);
      saveLocalChatThreadId(payload.thread.id);
      setThreads((currentThreads) => [payload.thread!, ...currentThreads]);
      setHistoryMode("supabase");
    } catch {
      setActiveThreadId(null);
      clearLocalChatThreadId();
      setHistoryMode("local");
    }
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
          const persistedMessages = [userMessage, assistantMessage];
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
          void persistMessages(activeThreadId, persistedMessages);
        })
        .catch(() => {
          const assistantMessage = createMessage(
            "assistant",
            createMockAssistantResponse(content),
          );
          const persistedMessages = [userMessage, assistantMessage];

          setProviderMode("mock");
          setErrorMessage("AI route failed; local mock fallback used.");
          setMessages((currentMessages) => [
            ...currentMessages,
            assistantMessage,
          ]);
          void persistMessages(activeThreadId, persistedMessages);
        })
        .finally(() => {
          setIsResponding(false);
        });
    }, 250);
  }

  function handleClearChat() {
    void archiveRemoteThread(activeThreadId);
    setMessages([]);
    setErrorMessage(null);
    setActiveThreadId(null);
    setHistoryMode("local");
    clearLocalChatMessages();
    clearLocalChatThreadId();
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
        mock local mantém o chat disponível. Quando Supabase está configurado,
        o histórico é salvo no banco; caso contrário, as mensagens ficam apenas
        neste navegador. Ainda não há streaming ou RAG.
      </p>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        Modo do provider: {providerMode} · Histórico: {historyMode}
      </p>

      {errorMessage ? (
        <p className="mt-4 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-100">
          {errorMessage}
        </p>
      ) : null}

      <ChatToolbar
        disabled={isResponding}
        hasMessages={messages.length > 0}
        onNew={handleNewChat}
        onClear={handleClearChat}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(220px,280px)_1fr]">
        <aside className="border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Historico
            </h3>
            <span className="text-xs text-zinc-500">
              {threads.length} salvas
            </span>
          </div>

          {isLoadingHistory ? (
            <p className="mt-4 text-sm text-zinc-500">Carregando...</p>
          ) : threads.length > 0 ? (
            <div className="mt-4 flex flex-col gap-2">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;

                return (
                  <button
                    className={`border px-3 py-3 text-left text-sm transition ${
                      isActive
                        ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600"
                    }`}
                    disabled={isResponding}
                    key={thread.id}
                    onClick={() => void loadThreadMessages(thread.id)}
                    type="button"
                  >
                    <span className="block truncate font-medium">
                      {thread.title}
                    </span>
                    <span className="mt-1 block text-xs opacity-75">
                      {new Date(thread.updated_at).toLocaleDateString([], {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Nenhuma conversa remota encontrada. O fallback local continua
              disponivel neste navegador.
            </p>
          )}
        </aside>

        <section>
          {messages.length > 0 ? (
            <ChatMessageList
              isResponding={isResponding}
              messages={messages}
            />
          ) : (
            <ChatEmptyState />
          )}
        </section>
      </div>

      <ChatInput disabled={isResponding} onSend={handleSend} />
    </div>
  );
}
