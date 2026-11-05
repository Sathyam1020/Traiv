export const RESOURCE_TYPES = ["Image", "Video", "Audio", "Document", "Link", "File"] as const;
export type VaultType = (typeof RESOURCE_TYPES)[number];
export type VaultResource = {
  id: string;
  name: string;
  description: string;
  type: VaultType;
  link: string | null;
  bytes: number | null;
  format: string | null;
  allClients: boolean;
  tagIds: string[];
  gender: string | null;
  createdAt: string;
  assignedAt?: string;
  openedAt?: string | null;
  seenAt?: string | null;
  direct?: boolean;
};
export function fileSize(bytes: number | null) {
  if (!bytes) return "—";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
export function resourceCategory(type: string) {
  return type === "Document"
    ? "Documents"
    : type === "Image"
      ? "Images"
      : type === "Video"
        ? "Videos"
        : "Other";
}
