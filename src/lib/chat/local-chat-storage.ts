import type { ChatMessage } from "@/types/chat";

export const LOCAL_CHAT_STORAGE_KEY = "sensei.localChat.v1";
const LOCAL_CHAT_THREAD_STORAGE_KEY = "sensei.localChatThread.v1";

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<ChatMessage>;

  const hasSafeMetadata =
    message.metadata === undefined ||
    (typeof message.metadata === "object" &&
      message.metadata !== null &&
      !Array.isArray(message.metadata));

  return (
    typeof message.id === "string" &&
    (message.role === "user" ||
      message.role === "assistant" ||
      message.role === "system") &&
    typeof message.content === "string" &&
    typeof message.createdAt === "string" &&
    hasSafeMetadata
  );
}

export function loadLocalChatMessages(): ChatMessage[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(LOCAL_CHAT_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      clearLocalChatMessages();
      return [];
    }

    const messages = parsedValue.filter(isChatMessage);

    if (messages.length !== parsedValue.length) {
      saveLocalChatMessages(messages);
    }

    return messages;
  } catch {
    clearLocalChatMessages();
    return [];
  }
}

export function saveLocalChatMessages(messages: ChatMessage[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      LOCAL_CHAT_STORAGE_KEY,
      JSON.stringify(messages),
    );
  } catch {
    // Ignore storage quota or browser privacy errors.
  }
}

export function clearLocalChatMessages(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(LOCAL_CHAT_STORAGE_KEY);
  } catch {
    // Ignore browser storage errors.
  }
}

export function loadLocalChatThreadId(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    return window.localStorage.getItem(LOCAL_CHAT_THREAD_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLocalChatThreadId(threadId: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(LOCAL_CHAT_THREAD_STORAGE_KEY, threadId);
  } catch {
    // Ignore storage quota or browser privacy errors.
  }
}

export function clearLocalChatThreadId(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(LOCAL_CHAT_THREAD_STORAGE_KEY);
  } catch {
    // Ignore browser storage errors.
  }
}
