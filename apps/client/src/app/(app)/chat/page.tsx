import { Page } from "@traiv/ui/components/shell/page";
import { MessageCircle } from "@traiv/ui/icons";

export default function ChatPage() {
  return (
    <Page className="flex-1 pb-28">
      <h1 className="text-heading font-semibold">Chat</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-selected text-signal-text">
          <MessageCircle className="size-7" />
        </span>
        <h2 className="text-body font-semibold">Your coach conversations</h2>
        <p className="max-w-xs text-body-sm text-fg-muted">
          Chat preview. Messaging isn't available yet.
        </p>
      </div>
    </Page>
  );
}
