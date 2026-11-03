"use client";
import { useSession } from "@/lib/query";
import { ChatConversation, type ChatTransport } from "@traiv/ui/components/chat";
import { useMemo } from "react";
import { API_BASE, http } from "@/lib/api/client";
import { Panel } from "./common";
export function Photos({ studio, onClose }: { studio: string; onClose: () => void }) {
  const userId = useSession().data?.user.id ?? "loading";
  const base = `/c/${studio}/chat`;
  const transport = useMemo<ChatTransport>(
    () => ({
      draftKey: `${userId}:${base}` ,
      get: async (path) => (await http.get(base + path)).data,
      post: async (path, body) => (await http.post(base + path, body)).data,
      events: `${API_BASE}${base}/events`,
      media: (id) => `${API_BASE}${base}/media/${id}`,
    }),
    [base, userId],
  );
  return (
    <Panel
      title="Photo Log"
      description="Share meal photos and messages with your coach."
      onClose={onClose}
    >
      <div className="h-[65dvh]">
        <ChatConversation transport={transport} channel="photo" name="Your coach" />
      </div>
    </Panel>
  );
}
