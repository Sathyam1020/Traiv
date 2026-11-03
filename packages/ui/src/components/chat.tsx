"use client";

import {
  IconActivity,
  IconArrowBackUp,
  IconArrowsMaximize,
  IconBarbell,
  IconBolt,
  IconCalendar,
  IconChecks,
  IconChevronDown,
  IconChevronRight,
  IconCircleCheck,
  IconClipboardCheck,
  IconClock,
  IconExternalLink,
  IconHash,
  IconMessage,
  IconMicrophone,
  IconMoodHappy,
  IconMoodSmile,
  IconPaperclip,
  IconRepeat,
  IconSend2,
  IconStar,
  IconUserCheck,
  IconWeight,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Plus, X } from "../icons";
import { notifyAction } from "../lib/action-feedback";
import { createChatRefreshGate, mergeChatPage } from "../lib/chat-sync";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
export type ChatChannel = "chat" | "photo";
export type Attachment = { id: string; name: string; type: string; format: string | null };
type Answer = {
  name: string;
  code: string;
  ratingValue: number | null;
  numberValue: number | null;
  textValue: string | null;
  imageUrl: string | null;
  unit: string | null;
};
type WorkoutLog = {
  exercise: { id: string; name: string; imageUrl?: string | null; equipment?: string };
  log: {
    id: string;
    sessionExerciseId: string | null;
    setNumber: number;
    loadKg: number | null;
    reps: number | null;
    restSeconds: number | null;
    completed: boolean;
  };
  prescription?: {
    loadKg?: number | null;
    repsMin?: number | null;
    repsMax?: number | null;
  } | null;
};
export type Message = {
  id: string;
  kind: string;
  body: string;
  author: string;
  mine: boolean;
  replyTo: string | null;
  sourceId: string | null;
  createdAt: string;
  read: boolean;
  legacyImage: string | null;
  attachments: Attachment[];
  reactions: { emoji: string; mine: boolean }[];
  detail: null | {
    name?: string;
    programName?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    date?: string;
    dueOn?: string;
    totalSeconds?: number | null;
    quality?: number | null;
    intensity?: number | null;
    totalCompletedSets?: number | null;
    totalWeightLiftedKg?: number | null;
    totalReps?: number | null;
    note?: string | null;
    exercises?: WorkoutLog[];
    answers?: Answer[];
    review?: { reviewedAt: string } | null;
    histories?: {
      id: string;
      history: {
        date: string;
        sets: { setNumber: number; loadKg: number | null; reps: number | null }[];
      }[];
    }[];
  };
};
export type ChatHistory = { messages: Message[]; hasMore: boolean; readAt: string | null };
export type ChatTransport = {
  draftKey: string;
  get: (path: string) => Promise<unknown>;
  post: (path: string, body: unknown) => Promise<unknown>;
  events: string;
  media: (id: string) => string;
};
type Pending = {
  id: string;
  body: string;
  replyTo?: string;
  assets: string[];
  attachments?: Attachment[];
  failed: boolean;
};
const conversationCache = new Map<string, ChatHistory>();
const emojis = ["👍", "❤️", "🔥", "👏", "💪", "🎉"];
const time = (date: string) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function ChatConversation({
  transport,
  channel = "chat",
  name,
  coach = false,
  onBack,
  clientHref,
}: {
  transport: ChatTransport;
  channel?: ChatChannel;
  name: string;
  coach?: boolean;
  onBack?: () => void;
  clientHref?: string;
}) {
  const [history, setHistory] = useState<ChatHistory | null>(null),
    [error, setError] = useState(""),
    [draft, setDraft] = useState(""),
    [reply, setReply] = useState<Message | null>(null),
    [pending, setPending] = useState<Pending[]>([]),
    [assets, setAssets] = useState<Attachment[]>([]),
    [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(0),
    [detail, setDetail] = useState<Message | null>(null),
    [image, setImage] = useState<string | null>(null),
    [pdf, setPdf] = useState<string | null>(null),
    [recording, setRecording] = useState(false),
    [live, setLive] = useState(false),
    [typing, setTyping] = useState(false);
  const pendingRef = useRef<Pending[]>([]);
  function updatePending(update: (old: Pending[]) => Pending[]) {
    const next = update(pendingRef.current);
    pendingRef.current = next;
    setPending(next);
    sessionStorage.setItem(`${storageKey}:pending`, JSON.stringify(next));
  }
  const typingAt = useRef(0);
  const scroll = useRef<HTMLDivElement>(null),
    bottom = useRef<HTMLDivElement>(null),
    file = useRef<HTMLInputElement>(null),
    abort = useRef<XMLHttpRequest | null>(null),
    recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    latest = useRef<Message[]>([]),
    nearBottom = useRef(true),
    request = useRef(0),
    refreshGate = useRef(createChatRefreshGate()),
    readInFlight = useRef(false),
    readThrough = useRef<string | null>(null),
    [atBottom, setAtBottom] = useState(true);
  const storageKey = `traiv:chat:${transport.draftKey}:${channel}`;
  const refresh = useCallback((): Promise<void> => {
    // SSE heartbeats, focus and polling must share one request. Starting another
    // version every five seconds starved slow responses: none could ever commit.
    return refreshGate.current.run(async () => {
      const version = request.current;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const data = await Promise.race([
          transport.get(`/messages?channel=${channel}`) as Promise<ChatHistory>,
          new Promise<never>(
            (_, reject) =>
              (timer = setTimeout(
                () => reject(new Error("Messages are taking too long. Retry to reconnect.")),
                15000,
              )),
          ),
        ]);
        if (version !== request.current) return;
        setHistory((old) => {
          const next = { ...data, messages: mergeChatPage(old?.messages ?? [], data.messages) };
          conversationCache.set(storageKey, next);
          if (conversationCache.size > 30)
            conversationCache.delete(conversationCache.keys().next().value as string);
          return next;
        });
        setPending((old) => {
          const next = old.filter((p) => !data.messages.some((m) => m.id === p.id));
          pendingRef.current = next;
          sessionStorage.setItem(`${storageKey}:pending`, JSON.stringify(next));
          return next;
        });
        setError("");
      } catch (e) {
        if (version === request.current)
          setError(e instanceof Error ? e.message : "Couldn't load messages.");
      } finally {
        clearTimeout(timer);
      }
    });
  }, [transport, channel, storageKey]);
  useEffect(() => {
    setHistory(conversationCache.get(storageKey) ?? null);
    readThrough.current = null;
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(`${storageKey}:pending`) ?? "[]",
      ) as Pending[];
      pendingRef.current = Array.isArray(saved) ? saved.map((p) => ({ ...p, failed: true })) : [];
    } catch {
      pendingRef.current = [];
    }
    setPending(pendingRef.current);
    setAssets([]);
    setReply(null);
    setDraft(localStorage.getItem(storageKey) ?? "");
    void refresh();
    const events = new EventSource(`${transport.events}?channel=${channel}`, {
      withCredentials: true,
    });
    events.addEventListener("change", (event) => {
      try {
        setTyping(Boolean(JSON.parse(event.data).typing));
      } catch {
        setTyping(false);
      }
      setLive(true);
      // A commit notification can arrive while an older snapshot is in flight.
      // Reconcile once after that snapshot, without discarding its first paint.
      const wasBusy = refreshGate.current.busy();
      const generation = request.current;
      void refresh().then(() => {
        if (wasBusy && generation === request.current) void refresh();
      });
    });
    events.onerror = () => setLive(false);
    const fallback = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 15000);
    const focus = () => void refresh();
    window.addEventListener("focus", focus);
    return () => {
      request.current++;
      refreshGate.current.reset();
      events.close();
      clearInterval(fallback);
      window.removeEventListener("focus", focus);
      abort.current?.abort();
      if (recorder.current) recorder.current.onstop = null;
      recorder.current?.stop();
      stream.current?.getTracks().forEach((t) => {
        t.stop();
      });
    };
  }, [transport, channel, refresh, storageKey]);
  useEffect(() => {
    latest.current = history?.messages ?? [];
    if (nearBottom.current) bottom.current?.scrollIntoView({ block: "end" });
  }, [history, pending, assets]);
  function changeDraft(value: string) {
    if (value && Date.now() - typingAt.current > 3000) {
      typingAt.current = Date.now();
      void transport.post("/typing", { channel }).catch(() => {});
    }
    setDraft(value);
    localStorage.setItem(storageKey, value);
  }
  async function transmit(item: Pending) {
    updatePending((old) => old.map((p) => (p.id === item.id ? { ...p, failed: false } : p)));
    try {
      const saved = await transport.post("/messages", {
        id: item.id,
        body: item.body,
        replyTo: item.replyTo,
        assets: item.assets,
        channel,
      });
      // Commit the server acknowledgement before removing the optimistic bubble.
      const row = saved as { id: string; createdAt: string };
      const message: Message = {
        id: item.id,
        body: item.body,
        replyTo: item.replyTo ?? null,
        sourceId: null,
        createdAt: row.createdAt ?? new Date().toISOString(),
        author: coach ? "coach" : "client",
        mine: true,
        kind: "text",
        read: false,
        legacyImage: null,
        attachments: item.attachments ?? [],
        reactions: [],
        detail: null,
      };
      setHistory((old) => {
        const base = old ?? { messages: [], hasMore: false, readAt: null };
        const next = {
          ...base,
          messages: base.messages.some((m) => m.id === item.id)
            ? base.messages
            : [...base.messages, message],
        };
        conversationCache.set(storageKey, next);
        return next;
      });
      updatePending((old) => old.filter((p) => p.id !== item.id));
      void refresh();
    } catch (e) {
      updatePending((old) => old.map((p) => (p.id === item.id ? { ...p, failed: true } : p)));
      notifyAction(e instanceof Error ? e.message : "Couldn't send your message.", "error");
    }
  }
  function sendMessage() {
    if ((!draft.trim() && !assets.length) || uploading) return;
    const item = {
      id: crypto.randomUUID(),
      body: draft.trim(),
      replyTo: reply?.id,
      assets: assets.map((a) => a.id),
      attachments: assets,
      failed: false,
    };
    updatePending((old) => [...old, item]);
    changeDraft("");
    setReply(null);
    setAssets([]);
    nearBottom.current = true;
    void transmit(item);
  }
  async function upload(selected: File) {
    if (selected.size > 100 * 1024 * 1024) {
      notifyAction("Choose a file smaller than 100 MB.", "error");
      return;
    }
    if (!/^(image\/|video\/|audio\/|application\/pdf$)/.test(selected.type)) {
      notifyAction("Choose an image, video, audio file or PDF.", "error");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const type = selected.type.startsWith("image/")
        ? "image"
        : selected.type === "application/pdf"
          ? "raw"
          : "video";
      const ticket = (await transport.post("/uploads", { name: selected.name, type })) as {
        id: string;
        url: string;
        fields: Record<string, string>;
      };
      const form = new FormData();
      for (const [k, v] of Object.entries(ticket.fields)) form.append(k, v);
      form.append("file", selected);
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        abort.current = xhr;
        xhr.open("POST", ticket.url);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error("Upload failed. Please try again."));
        xhr.onerror = () => reject(new Error("Upload interrupted. Please try again."));
        xhr.onabort = () => reject(new Error("Upload cancelled."));
        xhr.send(form);
      });
      await transport.post(`/uploads/${ticket.id}/complete`, {});
      setAssets((old) => [
        ...old,
        { id: ticket.id, name: selected.name, type, format: selected.type.split("/")[1] ?? null },
      ]);
    } catch (e) {
      notifyAction(e instanceof Error ? e.message : "Couldn't upload this file.", "error");
    } finally {
      setUploading(false);
      abort.current = null;
    }
  }
  async function record() {
    if (recording) {
      if (recorder.current) recorder.current.onstop = null;
      recorder.current?.stop();
      setRecording(false);
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream.current);
      recorder.current = media;
      const parts: Blob[] = [];
      media.ondataavailable = (e) => parts.push(e.data);
      media.onstop = () => {
        stream.current?.getTracks().forEach((t) => {
          t.stop();
        });
        const format = media.mimeType.includes("mp4") ? "m4a" : "webm";
        void upload(new File(parts, `Voice message.${format}`, { type: media.mimeType }));
      };
      media.start();
      setRecording(true);
    } catch {
      notifyAction(
        "Microphone access isn't available. You can attach an audio file instead.",
        "error",
      );
    }
  }
  async function older() {
    if (!history?.messages[0]) return;
    const node = scroll.current,
      height = node?.scrollHeight ?? 0;
    try {
      const data = (await transport.get(
        `/messages?channel=${channel}&before=${history.messages[0].id}`,
      )) as ChatHistory;
      setHistory((old) =>
        old
          ? { ...old, hasMore: data.hasMore, messages: [...data.messages, ...old.messages] }
          : data,
      );
      requestAnimationFrame(() => {
        if (node) node.scrollTop += node.scrollHeight - height;
      });
    } catch {
      notifyAction("Couldn't load earlier messages. Try again.", "error");
    }
  }
  async function read() {
    const last = latest.current.at(-1);
    if (!last || readInFlight.current || readThrough.current === last.id) return;
    readInFlight.current = true;
    try {
      await transport.post("/read", { messageId: last.id, channel });
      readThrough.current = last.id;
      setHistory((old) => (old ? { ...old, readAt: last.createdAt } : old));
      window.dispatchEvent(new Event("traiv:chat-read"));
    } catch {
      // Keep unread state; retry on the next visible update rather than showing a toast every heartbeat.
    } finally {
      readInFlight.current = false;
    }
  }
  useEffect(() => {
    const markVisible = () => {
      if (
        document.visibilityState === "visible" &&
        document.hasFocus() &&
        nearBottom.current &&
        history?.messages.some((m) => !m.mine && (!history.readAt || m.createdAt > history.readAt))
      )
        void read();
    };
    markVisible();
    window.addEventListener("focus", markVisible);
    document.addEventListener("visibilitychange", markVisible);
    return () => {
      window.removeEventListener("focus", markVisible);
      document.removeEventListener("visibilitychange", markVisible);
    };
  }, [history, atBottom, transport, channel]);
  async function react(message: Message, emoji: string) {
    try {
      await transport.post("/reactions", {
        messageId: message.id,
        emoji: message.reactions.some((r) => r.mine && r.emoji === emoji) ? null : emoji,
      });
      await refresh();
    } catch {
      notifyAction("Couldn't update your reaction.", "error");
    }
  }
  const unread = history?.messages.some(
    (m) => !m.mine && (!history.readAt || m.createdAt > history.readAt),
  );
  return (
    <section
      className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-panel"
      aria-label={`Conversation with ${name}`}
    >
      <header className="z-10 flex h-[68px] shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={cn(!onBack && "hidden", coach && "md:hidden")}
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <span className="flex size-10 items-center justify-center rounded-full bg-selected font-semibold text-signal-text">
          {name.slice(0, 1)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-body font-semibold">{name}</h1>
          <p className="text-caption text-fg-subtle">
            {channel === "photo"
              ? "Photo Log"
              : live
                ? "Messages"
                : "Reconnecting · messages refresh automatically"}
          </p>
        </div>
        {clientHref ? (
          <a href={clientHref} className="text-label text-signal-text">
            Show client
          </a>
        ) : null}
      </header>
      <div
        ref={scroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-6"
        onScroll={() => {
          const n = scroll.current;
          if (n) {
            nearBottom.current = n.scrollHeight - n.scrollTop - n.clientHeight < 100;
            setAtBottom(nearBottom.current);
          }
        }}
      >
        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-control bg-danger/10 p-3 text-body-sm text-danger"
          >
            {error}{" "}
            <button type="button" className="underline" onClick={() => void refresh()}>
              Retry
            </button>
          </div>
        ) : null}
        {!history && !error ? (
          <p className="py-12 text-center text-fg-muted">Loading conversation…</p>
        ) : null}
        {history?.hasMore ? (
          <Button variant="ghost" className="mb-5 w-full" onClick={() => void older()}>
            Load earlier messages
          </Button>
        ) : null}
        {history?.messages.length === 0 ? (
          <p className="py-12 text-center text-fg-muted">
            This is the beginning of your conversation.
          </p>
        ) : null}
        {history?.messages.map((m, index) => {
          const previous = history.messages[index - 1];
          const showDate =
            !previous ||
            new Date(previous.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
          const firstUnread =
            !m.mine &&
            (!history.readAt || m.createdAt > history.readAt) &&
            !history.messages
              .slice(0, index)
              .some((item) => !item.mine && (!history.readAt || item.createdAt > history.readAt));
          return (
            <div key={m.id}>
              {showDate ? (
                <p className="my-6 text-center text-caption text-fg-subtle">
                  {new Date(m.createdAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              ) : null}
              {firstUnread ? (
                <div className="my-5 border-t border-signal/30 text-right text-caption text-signal-text">
                  New
                </div>
              ) : null}
              <article
                className={cn("group mb-3 flex flex-col", m.mine ? "items-end" : "items-start")}
              >
                {m.kind === "workout" || m.kind === "check-in" ? (
                  <ActivityCard
                    message={m}
                    onOpen={() => {
                      setDetail(m);
                      void transport
                        .get(`/activities/${m.id}`)
                        .then((data) =>
                          setDetail((current) =>
                            current?.id === m.id ? (data as Message) : current,
                          ),
                        )
                        .catch(() =>
                          notifyAction("Couldn't load full activity history. Try again.", "error"),
                        );
                    }}
                    coach={coach}
                    onReview={async () => {
                      await transport.post(`/reviews/${m.sourceId}`, {});
                      await refresh();
                    }}
                    onImage={setImage}
                  />
                ) : (
                  <div
                    className={cn(
                      "max-w-[90%] overflow-hidden rounded-2xl border border-line p-3 sm:max-w-[75%]",
                      m.mine ? "bg-signal text-white" : "bg-surface",
                    )}
                  >
                    {m.replyTo ? (
                      <button
                        type="button"
                        className="mb-2 block w-full rounded-lg border-l-2 border-current bg-black/5 px-3 py-2 text-left text-caption opacity-80"
                        onClick={() =>
                          document
                            .getElementById(`message-${m.replyTo}`)
                            ?.scrollIntoView({ block: "center" })
                        }
                      >
                        ↩{" "}
                        {history.messages.find((r) => r.id === m.replyTo)?.body.slice(0, 90) ||
                          "Earlier message"}
                      </button>
                    ) : null}
                    <div id={`message-${m.id}`}>
                      {m.body ? (
                        <p className="whitespace-pre-wrap break-words text-body-sm">{m.body}</p>
                      ) : null}
                      {m.legacyImage ? (
                        <button
                          type="button"
                          onClick={() => setImage(m.legacyImage)}
                          aria-label="View photo"
                        >
                          <img
                            src={m.legacyImage}
                            alt="Shared meal"
                            className="max-h-80 rounded-xl object-contain"
                          />
                        </button>
                      ) : null}
                      {m.attachments.map((a) => (
                        <Media
                          key={a.id}
                          asset={a}
                          url={transport.media(a.id)}
                          onPdf={setPdf}
                          onImage={setImage}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-fg-subtle">
                  <time dateTime={m.createdAt}>{time(m.createdAt)}</time>
                  {m.mine ? (
                    <span role="img" aria-label={m.read ? "Read" : "Sent"}>
                      {m.read ? (
                        <IconChecks className="size-3.5 text-signal-text" />
                      ) : (
                        <Check className="size-3" />
                      )}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setReply(m)}
                    className="px-1 opacity-0 transition-opacity hover:text-signal-text focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    <IconArrowBackUp className="size-3.5" aria-label="Reply" />
                  </button>
                  <details className="relative">
                    <summary
                      className="cursor-pointer list-none px-1 opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                      aria-label="React to message"
                    >
                      <IconMoodSmile className="size-3.5" />
                    </summary>
                    <div className="absolute bottom-full z-20 flex gap-1 rounded-full border border-line bg-surface p-2 shadow-lg">
                      {emojis.map((e) => (
                        <button
                          key={e}
                          type="button"
                          className="p-1 text-lg"
                          aria-label={`React ${e}`}
                          onClick={(event) => {
                            void react(m, e);
                            event.currentTarget.closest("details")?.removeAttribute("open");
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </details>
                  {m.reactions.map((r, i) => (
                    <button
                      key={`${r.emoji}-${i}`}
                      type="button"
                      onClick={() => void react(m, r.emoji)}
                      className={cn(
                        "rounded-full border px-1.5",
                        r.mine ? "border-signal bg-selected" : "border-line",
                      )}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              </article>
            </div>
          );
        })}
        {pending.map((p) => (
          <div key={p.id} className="mb-4 ml-auto max-w-[80%] rounded-2xl bg-selected p-3">
            <p className="whitespace-pre-wrap text-body-sm">{p.body || "Attachment"}</p>
            {p.failed ? (
              <button
                type="button"
                className="text-caption text-danger underline"
                onClick={() => void transmit(p)}
              >
                Couldn't send · Retry
              </button>
            ) : (
              <p className="flex items-center gap-1 text-caption text-fg-muted">
                <IconClock className="size-3" /> Sending…
              </p>
            )}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      {typing ? (
        <p role="status" className="px-4 py-1 text-caption text-fg-muted">
          {name} is typing…
        </p>
      ) : null}
      <div className={cn("shrink-0 px-3 pb-3 pt-1", coach ? "bg-panel px-3" : "bg-panel px-3")}>
        {unread ? (
          <button
            type="button"
            className="mb-2 w-full text-center text-caption text-signal-text"
            onClick={() => void read()}
          >
            ✓✓ Mark as read
          </button>
        ) : null}
        {reply ? (
          <div className="mb-2 flex items-center justify-between rounded-control bg-selected p-2 text-caption">
            <span className="truncate">Replying to {reply.body || reply.kind}</span>
            <button type="button" aria-label="Cancel reply" onClick={() => setReply(null)}>
              <X className="size-4" />
            </button>
          </div>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-2">
          {assets.map((a) => (
            <span
              key={a.id}
              className="flex items-center gap-2 rounded-control bg-selected p-2 text-caption"
            >
              {a.type === "image" ? (
                <img
                  src={transport.media(a.id)}
                  alt="Attachment preview"
                  className="size-10 rounded object-cover"
                />
              ) : null}
              {a.name}
              <button
                type="button"
                aria-label={`Remove ${a.name}`}
                onClick={() => setAssets((old) => old.filter((x) => x.id !== a.id))}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
        {uploading ? (
          <div role="status" className="mb-2 text-caption text-fg-muted">
            Uploading {progress}%{" "}
            <button type="button" className="underline" onClick={() => abort.current?.abort()}>
              Cancel
            </button>
          </div>
        ) : null}
        <div
          className={cn(
            "relative flex gap-2 border border-line bg-surface shadow-sm",
            coach ? "flex-col rounded-2xl p-2" : "items-end rounded-[28px] p-1.5",
          )}
        >
          {!coach ? (
            <details className="relative mb-0.5 shrink-0">
              <summary
                aria-label="Message options"
                className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full bg-panel text-fg-muted"
              >
                <Plus className="size-5" />
              </summary>
              <div className="absolute bottom-full left-0 z-20 mb-3 w-48 rounded-2xl border border-line bg-surface p-2 shadow-lg">
                <button
                  type="button"
                  disabled={uploading || assets.length >= 5}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-panel"
                  onClick={(e) => {
                    file.current?.click();
                    e.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                >
                  <IconPaperclip className="size-4" />
                  Attach file
                </button>
                <button
                  type="button"
                  disabled={uploading || assets.length >= 5}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-sm hover:bg-panel"
                  onClick={(e) => {
                    void record();
                    e.currentTarget.closest("details")?.removeAttribute("open");
                  }}
                >
                  <IconMicrophone className="size-4" />
                  {recording ? "Stop recording" : "Voice message"}
                </button>
              </div>
            </details>
          ) : null}
          <textarea
            value={draft}
            onChange={(e) => changeDraft(e.target.value)}
            maxLength={10000}
            rows={1}
            placeholder="Write your message…"
            aria-label="Message"
            style={{ height: coach ? 44 : 40, minHeight: coach ? 44 : 40, maxHeight: 112 }}
            className="block min-w-0 flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm leading-6 outline-none focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <div className={cn("flex shrink-0 items-center gap-1", !coach && "pb-0.5")}>
            <input
              ref={file}
              type="file"
              accept="image/*,video/*,audio/*,application/pdf"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Attach file"
              className={cn(!coach && "hidden")}
              disabled={uploading || assets.length >= 5}
              onClick={() => file.current?.click()}
            >
              <IconPaperclip className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={recording ? "Stop recording" : "Record voice message"}
              className={cn(!coach && "hidden")}
              disabled={uploading || assets.length >= 5}
              onClick={() => void record()}
            >
              <IconMicrophone className={cn("size-5", recording && "text-danger animate-pulse")} />
            </Button>
            <details className={cn("relative", !coach && "hidden")}>
              <summary className="cursor-pointer list-none p-2" aria-label="Insert emoji">
                <IconMoodSmile className="size-5 text-fg-subtle" />
              </summary>
              <div className="absolute bottom-full left-0 z-20 flex gap-1 rounded-full border border-line bg-surface p-2 shadow-lg">
                {emojis.map((e) => (
                  <button key={e} type="button" onClick={() => changeDraft(draft + e)}>
                    {e}
                  </button>
                ))}
              </div>
            </details>
            <Button
              className="ml-auto size-10 shrink-0 rounded-full p-0"
              aria-label="Send message"
              disabled={uploading || recording || (!draft.trim() && !assets.length)}
              onClick={sendMessage}
            >
              <IconSend2 className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={Boolean(detail)}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent
          variant="scrollable"
          showCloseButton={false}
          className="max-h-[85dvh] w-[calc(100vw-2rem)] max-w-[960px] overflow-hidden rounded-3xl p-0"
        >
          <div className="relative shrink-0 bg-gradient-to-br from-signal to-[#153a79] px-6 py-6 text-white sm:px-7">
            <button
              type="button"
              aria-label="Close activity"
              onClick={() => setDetail(null)}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white text-fg shadow-sm"
            >
              <X className="size-4" />
            </button>
            <DialogTitle className="pr-12 text-xl font-semibold text-white">
              {detail?.kind === "workout" ? (detail.detail?.name ?? "Workout") : "Check-in"}
            </DialogTitle>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/85">
              <IconClock className="size-4" />
              {detail?.kind === "workout" ? `${duration(detail.detail?.totalSeconds)} – ` : ""}
              {activityDate(detail?.detail?.date ?? detail?.detail?.dueOn ?? detail?.createdAt)}
            </p>
            {detail?.kind === "workout" ? (
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-lg border border-white/30 bg-white/15 px-2.5 py-1 text-xs font-medium">
                  Intensity: {detail.detail?.intensity ?? "—"}/5
                </span>
                <span>Rating:</span>
                <span className="flex gap-0.5 text-amber-300">
                  {Array.from({ length: 5 }, (_, i) => (
                    <IconStar
                      key={i}
                      className="size-5"
                      fill={i < (detail.detail?.quality ?? 0) ? "currentColor" : "none"}
                    />
                  ))}
                </span>
                <span>({detail.detail?.quality ?? "—"}/5)</span>
              </div>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {detail ? <ActivityDetail message={detail} onImage={setImage} /> : null}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(pdf)}
        onOpenChange={(open) => {
          if (!open) setPdf(null);
        }}
      >
        <DialogContent className="h-[85dvh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document</DialogTitle>
          </DialogHeader>
          {pdf ? (
            <iframe
              title="PDF attachment"
              src={pdf}
              className="h-full min-h-96 w-full rounded-control"
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(image)}
        onOpenChange={(open) => {
          if (!open) setImage(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Photo</DialogTitle>
          </DialogHeader>
          {image ? (
            <img
              src={image}
              alt="Full size attachment"
              className="max-h-[75dvh] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
function Media({
  asset,
  url,
  onImage,
  onPdf,
}: {
  asset: Attachment;
  url: string;
  onImage: (url: string) => void;
  onPdf: (url: string) => void;
}) {
  if (asset.type === "image")
    return (
      <button
        type="button"
        className="mt-2 block"
        aria-label={`View ${asset.name}`}
        onClick={() => onImage(url)}
      >
        <img
          src={url}
          alt={asset.name}
          loading="lazy"
          className="max-h-80 rounded-xl object-contain"
        />
      </button>
    );
  if (asset.type === "video")
    return /mp3|m4a|ogg|wav/.test(asset.format ?? "") || asset.name.startsWith("Voice") ? (
      <audio controls preload="metadata" src={url} className="mt-2 max-w-full">
        <track kind="captions" />
      </audio>
    ) : (
      <video controls preload="metadata" src={url} className="mt-2 max-h-80 rounded-xl">
        <track kind="captions" />
      </video>
    );
  return (
    <button type="button" onClick={() => onPdf(url)} className="mt-2 block underline">
      PDF · {asset.name}
    </button>
  );
}
function ActivityCard({
  message: m,
  onOpen,
  coach,
  onReview,
  onImage,
}: {
  message: Message;
  onOpen: () => void;
  coach: boolean;
  onReview: () => Promise<void>;
  onImage: (url: string) => void;
}) {
  const d = m.detail,
    ratings = d?.answers?.filter((a) => a.ratingValue != null) ?? [],
    weight = d?.answers?.find((a) => a.code === "weight");
  const [busy, setBusy] = useState(false);
  if (!coach)
    return (
      <div className="w-full max-w-sm">
        <p className="mb-1.5 text-right text-xs text-fg-subtle">
          {m.kind === "workout" ? "You tracked a workout" : "You completed a check-in"}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center gap-3 rounded-[24px] rounded-br-md bg-signal px-4 py-4 text-left text-white"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            {m.kind === "workout" ? (
              <IconBarbell className="size-6" />
            ) : (
              <IconClipboardCheck className="size-6" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block truncate text-base">
              {m.kind === "workout" ? (d?.name ?? "Workout") : "Check-in"}
            </strong>
            <span className="mt-1 block text-xs text-white/75">
              {m.kind === "workout"
                ? `${Math.round((d?.totalSeconds ?? 0) / 60)} min · Rating ${d?.quality ?? "—"}/5`
                : ratings.length
                  ? `${(ratings.reduce((sum, a) => sum + (a.ratingValue ?? 0), 0) / ratings.length).toFixed(1)} / 5`
                  : "View your responses"}
            </span>
          </span>
          <IconChevronRight className="size-5 shrink-0 text-white/70" />
        </button>
      </div>
    );
  return (
    <div className={cn("w-full", m.kind === "workout" ? "max-w-[290px]" : "max-w-[540px]")}>
      <p className="mb-2 flex items-center gap-1.5 text-xs text-fg-subtle">
        {m.kind === "workout" ? (
          <IconActivity className="size-3.5" />
        ) : (
          <IconUserCheck className="size-3.5" />
        )}
        Client completed {m.kind === "workout" ? "a workout" : "a check-in"}
      </p>
      <div className="overflow-hidden rounded-[22px] border border-line bg-surface">
        {m.kind === "workout" ? (
          <>
            <button
              type="button"
              onClick={onOpen}
              className="relative flex w-full items-center gap-4 border-b border-line p-5 text-left"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                <IconActivity className="size-8" />
              </span>
              <span className="min-w-0 pr-4">
                <strong className="block truncate text-base font-semibold">
                  {d?.name ?? "Workout"}
                </strong>
                {d?.programName ? (
                  <span className="mt-1 block truncate text-sm text-fg-muted">{d.programName}</span>
                ) : null}
              </span>
              <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-surface text-fg-muted shadow-sm">
                <IconExternalLink className="size-4" />
              </span>
            </button>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <IconClock className="size-5 shrink-0 text-blue-500" />
                  <div>
                    <p className="text-xs text-fg-muted">Duration</p>
                    <strong className="text-base">{duration(d?.totalSeconds)}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconWeight className="size-5 shrink-0 text-purple-500" />
                  <div>
                    <p className="whitespace-nowrap text-xs text-fg-muted">Total Weight</p>
                    <strong className="text-base">
                      {number(d?.totalWeightLiftedKg)} <span className="text-sm">kg</span>
                    </strong>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1.5 whitespace-nowrap text-xs">
                <span className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-500">
                  <IconStar className="size-4" />
                  {d?.quality ?? "—"}/5
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 font-semibold text-red-500">
                  <IconBolt className="size-4" />
                  {d?.intensity ?? "—"}/5
                </span>
                {d?.startedAt && d?.completedAt ? (
                  <span className="ml-auto text-fg-subtle">
                    {time(d.startedAt)} – {time(d.completedAt)}
                  </span>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative p-5">
              <div className="flex flex-wrap items-center gap-2 pr-8">
                <IconCalendar className="size-5 text-blue-500" />
                <strong className="text-base">{activityDate(d?.dueOn ?? m.createdAt)}</strong>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    d?.review ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-500",
                  )}
                >
                  {d?.review ? "Reviewed" : "Pending Review"}
                </span>
              </div>
              <button
                type="button"
                aria-label="Open check-in"
                onClick={onOpen}
                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-surface text-fg-muted shadow-sm"
              >
                <IconExternalLink className="size-4" />
              </button>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00c853] text-white">
                    <IconMoodHappy className="size-6" />
                  </span>
                  <div>
                    <p className="text-xs text-fg-muted">Overall Rating</p>
                    <strong className="text-base">
                      {ratings.length
                        ? (
                            ratings.reduce((s, a) => s + (a.ratingValue ?? 0), 0) / ratings.length
                          ).toFixed(1)
                        : "—"}
                      /5
                    </strong>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <IconWeight className="size-5 shrink-0 text-purple-500" />
                  <div>
                    <p className="text-xs text-fg-muted">Current Weight</p>
                    <strong className="text-base">
                      {weight?.numberValue ?? "—"}{" "}
                      <span className="text-sm">{weight?.unit ?? "kg"}</span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
            <CheckAnswers answers={d?.answers ?? []} onImage={onImage} />
            {!d?.review ? (
              <div className="border-t border-line px-5 py-4">
                <Button
                  className="h-12 w-full rounded-full text-sm font-semibold"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    try {
                      await onReview();
                    } catch {
                      notifyAction("Couldn't mark this check-in as reviewed.", "error");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Mark as reviewed
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
function duration(seconds?: number | null) {
  if (seconds == null) return "—";
  const minutes = Math.floor(seconds / 60);
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}
function number(value?: number | null) {
  return value == null ? "—" : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}
function activityDate(value?: string) {
  return value
    ? new Date(value.length === 10 ? `${value}T12:00:00` : value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
}
function CheckAnswers({ answers, onImage }: { answers: Answer[]; onImage: (url: string) => void }) {
  const photos = answers
      .filter((a) => a.imageUrl)
      .sort((a, b) => {
        const order = ["photo_back", "photo_front", "photo_side"];
        return order.indexOf(a.code) - order.indexOf(b.code);
      }),
    ratings = answers
      .filter((a) => a.ratingValue != null)
      .sort((a, b) => {
        const order = ["mood", "energy", "nutrition", "progress", "sleep_quality"];
        const rank = (code: string) => {
          const index = order.indexOf(code);
          return index < 0 ? order.length : index;
        };
        return rank(a.code) - rank(b.code);
      }),
    responses = answers.filter((a) => Boolean(a.textValue?.trim()));
  return (
    <>
      {photos.length ? (
        <div className="grid grid-cols-3 gap-2.5 border-t border-line p-5">
          {photos.map((a) => (
            <button
              key={a.name}
              type="button"
              className="relative overflow-hidden rounded-xl"
              onClick={() => onImage(a.imageUrl ?? "")}
            >
              <img
                src={a.imageUrl ?? ""}
                alt={a.name}
                className="aspect-[5/9] w-full object-cover"
              />
              <span className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/55 text-white">
                <IconArrowsMaximize className="size-3.5" />
              </span>
            </button>
          ))}
        </div>
      ) : null}
      {ratings.length ? (
        <section className="border-t border-line p-5">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium text-fg-muted">
            <IconStar className="size-4 text-amber-400" />
            Ratings ({ratings.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {ratings.map((a) => (
              <span
                key={a.name}
                className="flex items-center gap-2 rounded-xl border border-line px-2.5 py-2 text-sm"
              >
                <b className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#00c853] text-xs font-semibold text-white">
                  {a.ratingValue}
                </b>
                <span className="font-medium">{a.code === "sleep_quality" ? "Sleep" : a.name}</span>
              </span>
            ))}
          </div>
        </section>
      ) : null}
      {responses.length ? (
        <section className="space-y-3 border-t border-line p-5">
          <p className="flex items-center gap-2 text-xs font-medium text-fg-muted">
            <IconMessage className="size-4 text-blue-500" />
            {responses.length} Responses
          </p>
          {responses.map((a) => (
            <div key={a.name} className="text-sm">
              <p className="font-medium text-fg-muted">{a.name}</p>
              <p className="mt-0.5 whitespace-pre-wrap leading-relaxed text-fg">
                {a.textValue ?? `${a.numberValue} ${a.unit ?? ""}`}
              </p>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
export function ActivityDetail({
  message,
  onImage,
}: {
  message: Message;
  onImage: (url: string) => void;
}) {
  const d = message.detail;
  if (message.kind === "check-in")
    return <CheckAnswers answers={d?.answers ?? []} onImage={onImage} />;
  const groups = new Map<string, WorkoutLog[]>();
  for (const row of d?.exercises ?? []) {
    const key = row.log.sessionExerciseId ?? row.exercise.name;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }
  return (
    <div className="p-5 sm:p-7">
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { label: "Total Sets", value: d?.totalCompletedSets, unit: "completed", Icon: IconHash },
          { label: "Total Volume", value: d?.totalWeightLiftedKg, unit: "kg", Icon: IconWeight },
          { label: "Total Reps", value: d?.totalReps, unit: "count", Icon: IconRepeat },
        ].map(({ label, value, unit, Icon }) => (
          <div key={label} className="rounded-xl border border-line p-3 shadow-sm sm:p-4">
            <p className="mb-2 flex items-center gap-2 text-xs text-fg-muted sm:text-sm">
              <Icon className="size-4 text-fg" />
              {label}
            </p>
            <strong className="text-xl sm:text-2xl">{number(value)}</strong>
            <span className="ml-1 text-xs text-fg-subtle">{unit}</span>
          </div>
        ))}
      </div>
      {d?.programName ? <h3 className="mb-5 text-base font-semibold">{d.programName}</h3> : null}
      {d?.note ? <p className="mb-5 whitespace-pre-wrap text-sm text-fg-muted">{d.note}</p> : null}
      {!d?.exercises?.length ? (
        <p className="py-6 text-center text-sm text-fg-subtle">
          {d?.histories ? "No exercise sets recorded." : "Loading exercise details…"}
        </p>
      ) : null}
      {[...groups.entries()].map(([key, rows]) => (
        <section key={key} className="mb-7 border-t border-line pt-5">
          <h3 className="mb-4 flex items-center gap-3 text-sm font-semibold">
            {rows[0]?.exercise.imageUrl ? (
              <img
                src={rows[0].exercise.imageUrl}
                alt=""
                className="size-12 rounded-lg object-cover"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-lg bg-panel">
                <IconBarbell className="size-6 text-fg-muted" />
              </span>
            )}
            {rows[0]?.exercise.name}
          </h3>
          {rows.map(({ log, prescription }) => (
            <div
              key={log.id}
              className="mb-2 grid grid-cols-[32px_1fr_1fr_0.8fr_32px] items-center gap-2 rounded-xl border border-line p-2.5 text-center shadow-sm sm:grid-cols-[52px_1fr_1fr_1fr_52px] sm:gap-4 sm:p-3"
            >
              <span className="flex h-12 items-center justify-center rounded-lg bg-panel text-sm font-semibold">
                {log.setNumber}
              </span>
              <div>
                <p className="text-xs text-fg-subtle">Weight</p>
                {prescription?.loadKg != null ? (
                  <p className="text-[10px] text-fg-subtle">Plan: {prescription.loadKg} kg</p>
                ) : null}
                <p className="mt-1 text-sm font-semibold">
                  {prescription?.loadKg != null && prescription.loadKg !== log.loadKg ? (
                    <del className="mr-1 font-normal text-fg-subtle">{prescription.loadKg}</del>
                  ) : null}
                  {number(log.loadKg)} kg
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-subtle">Reps</p>
                {prescription?.repsMin != null ? (
                  <p className="text-[10px] text-fg-subtle">
                    Plan: {prescription.repsMin}
                    {prescription.repsMax != null && prescription.repsMax !== prescription.repsMin
                      ? `–${prescription.repsMax}`
                      : ""}
                  </p>
                ) : null}
                <p className="mt-1 text-sm font-semibold">{log.reps ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-fg-subtle">Rest</p>
                <p className="mt-1 text-sm font-semibold">
                  {log.restSeconds == null
                    ? "—"
                    : `${Math.floor(log.restSeconds / 60)}:${String(log.restSeconds % 60).padStart(2, "0")}`}
                </p>
              </div>
              <span
                role="img"
                aria-label={log.completed ? "Completed" : "Skipped"}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg",
                  log.completed ? "bg-emerald-100 text-emerald-600" : "bg-panel text-fg-subtle",
                )}
              >
                {log.completed ? <IconCircleCheck className="size-5" /> : "—"}
              </span>
            </div>
          ))}
          <details className="group/history mt-5 overflow-hidden rounded-xl border border-line">
            <summary className="grid cursor-pointer list-none grid-cols-[1fr_1fr_32px] items-center gap-3 bg-panel/40 p-4 text-center">
              <span>
                <span className="block text-xs text-fg-muted">Total</span>
                <strong className="text-base">
                  {rows.reduce((s, r) => s + (r.log.completed ? (r.log.reps ?? 0) : 0), 0)} reps
                </strong>
              </span>
              <span>
                <span className="block text-xs text-fg-muted">Volume</span>
                <strong className="text-base">
                  {number(
                    rows.reduce(
                      (s, r) => s + (r.log.completed ? (r.log.loadKg ?? 0) * (r.log.reps ?? 0) : 0),
                      0,
                    ),
                  )}{" "}
                  kg
                </strong>
              </span>
              <IconChevronDown className="size-5 transition-transform group-open/history:rotate-180" />
            </summary>
            <div className="overflow-x-auto border-t border-line">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    {rows.map((r) => (
                      <th key={r.log.id} className="p-3">
                        Set {r.log.setNumber}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d?.histories
                    ?.find((h) => h.id === rows[0]?.exercise.id)
                    ?.history.map((h, i) => (
                      <tr key={`${h.date}-${i}`} className="border-t border-line">
                        <td className="whitespace-nowrap p-3 text-left">{activityDate(h.date)}</td>
                        {rows.map((r) => {
                          const set = h.sets.find((s) => s.setNumber === r.log.setNumber);
                          return (
                            <td key={r.log.id} className="whitespace-nowrap p-3">
                              {set ? `${number(set.loadKg)} kg · ${set.reps ?? "—"} reps` : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      ))}
    </div>
  );
}
