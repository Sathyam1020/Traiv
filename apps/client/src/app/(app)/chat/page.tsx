"use client";
import { ChatConversation, type ChatTransport } from "@traiv/ui/components/chat";
import { useMemo } from "react";
import { API_BASE, http } from "@/lib/api/client";
import { useActiveStudio, useSession } from "@/lib/query";
export default function ChatPage() {
  const userId = useSession().data?.user.id ?? "loading";
  const { studioId, isPending, error } = useActiveStudio();
  const base = `/c/${studioId}/chat`;
  const transport = useMemo<ChatTransport>(
    () => ({
      draftKey: `${userId}:${base}`,
      get: async (path) => (await http.get(base + path, { timeout: 15000 })).data,
      post: async (path, body) => (await http.post(base + path, body)).data,
      events: `${API_BASE}${base}/events`,
      media: (id) => `${API_BASE}${base}/media/${id}`,
    }),
    [base, userId],
  );
  if (!studioId)
    return (
      <div className="p-6 text-fg-muted">
        {isPending ? (
          "Loading your conversation…"
        ) : error ? (
          <>
            <p>Couldn't load your coach.</p>
            <button
              type="button"
              className="mt-3 text-signal-text"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </>
        ) : (
          "Chat will be available when you're connected with a coach."
        )}
      </div>
    );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatConversation key={studioId} transport={transport} name="Your coach" />
    </div>
  );
}
