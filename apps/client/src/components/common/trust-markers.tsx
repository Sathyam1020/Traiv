import { Lock, MessageCircle, ShieldCheck } from "lucide-react";

const markers = [
  { icon: Lock, label: "Secure & private" },
  { icon: MessageCircle, label: "Quick via WhatsApp" },
  { icon: ShieldCheck, label: "No spam" },
];

export function TrustMarkers() {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-line pt-4">
      {markers.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5 text-caption text-fg-subtle">
          <Icon className="size-3.5" />
          {label}
        </span>
      ))}
    </div>
  );
}
