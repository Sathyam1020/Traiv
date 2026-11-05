"use client";
import { FileText, Image, Link as LinkIcon, Video } from "@traiv/ui/icons";
import { resourceCategory } from "@traiv/ui/lib/vault";
import Link from "next/link";
import { useVault } from "@/lib/query/use-vault";
export const VAULT_CATEGORIES = ["Documents", "Images", "Videos", "Other"] as const;
const icons = [FileText, Image, Video, LinkIcon];
export function VaultCard({ studioId }: { studioId: string }) {
  const resources = useVault(studioId);
  if (!resources.data?.length) return null;
  return (
    <section aria-label="Shared resources" className="grid grid-cols-2 gap-2">
      {VAULT_CATEGORIES.map((category, i) => {
        const Icon = icons[i]!;
        const count = resources.data.filter((r) => resourceCategory(r.type) === category).length;
        return (
          <Link
            key={category}
            href={`/vault?category=${category}`}
            className="client-tappable flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 text-sm"
          >
            <Icon className="size-5 text-fg-subtle" />
            <span className="flex-1">{category}</span>
            <span className="rounded-md bg-sunken px-1.5 py-0.5 text-xs">{count}</span>
          </Link>
        );
      })}
    </section>
  );
}
