import type { VaultResource } from "@traiv/ui/lib/vault";
import { http } from "./client";
export const vaultPath = (studioId: string) => `/studios/${studioId}/vault`;
export const vaultApi = {
  list: async (studioId: string, clientId?: string) =>
    (
      await http.get<VaultResource[]>(
        vaultPath(studioId) + (clientId ? `/clients/${clientId}` : ""),
      )
    ).data,
  open: async (studioId: string, id: string) =>
    (await http.get<{ url: string }>(`${vaultPath(studioId)}/${id}/open`)).data.url,
  upload: async (studioId: string, file: File) => {
    const { data: ticket } = await http.post<{
      id: string;
      url: string;
      fields: Record<string, string>;
    }>(`${vaultPath(studioId)}/uploads`, { name: file.name, mime: file.type });
    const form = new FormData();
    form.append("file", file);
    for (const [key, value] of Object.entries(ticket.fields)) form.append(key, value);
    const response = await fetch(ticket.url, { method: "POST", body: form });
    if (!response.ok) throw new Error("Upload failed. Please try again.");
    return ticket.id;
  },
};
