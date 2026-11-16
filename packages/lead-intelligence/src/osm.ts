import { mkdir, writeFile } from "node:fs/promises";
import { z } from "zod";
import { requestJson } from "./adapters.ts";
import type { Store } from "./store.ts";

const attribution =
  "© OpenStreetMap contributors. ODbL 1.0 https://opendatacommons.org/licenses/odbl/1-0/";
const response = z.object({
  remark: z.string().optional(),
  elements: z.array(
    z.object({
      type: z.enum(["node", "way", "relation"]),
      id: z.number(),
      lat: z.number().optional(),
      lon: z.number().optional(),
      center: z.object({ lat: z.number(), lon: z.number() }).optional(),
      tags: z.record(z.string(), z.string()),
    }),
  ),
});
export async function discoverOsm(store: Store, refresh = false) {
  const query =
    '[out:json][timeout:25];nwr["leisure"="fitness_centre"](12.70,77.35,13.25,77.90);out center tags;';
  const key = "osm-bengaluru-fitness-centres";
  if (!refresh && store.db.prepare("SELECT value FROM meta WHERE key=?").get(key)) {
    return;
  }
  try {
    const raw = response.parse(
      await requestJson(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "TraivLeadResearch/1.0",
          },
          body: new URLSearchParams({ data: query }),
        },
        2,
      ),
    );
    if (raw.remark) throw Error(`Overpass partial/error response: ${raw.remark}`);
    const candidates = raw.elements
      .filter((e) => e.tags.name && !e.tags["disused:leisure"] && !e.tags["abandoned:leisure"])
      .map((e) => ({
        providerId: `osm:${e.type}/${e.id}`,
        name: e.tags.name,
        source: `https://www.openstreetmap.org/${e.type}/${e.id}`,
        lat: e.lat ?? e.center?.lat,
        lon: e.lon ?? e.center?.lon,
        website: e.tags.website ?? e.tags["contact:website"] ?? "",
        phone: e.tags.phone ?? e.tags["contact:phone"] ?? "",
        locality: e.tags["addr:suburb"] ?? "",
        address: e.tags["addr:full"] ?? "",
        collectedAt: new Date().toISOString(),
        verification:
          "Map candidate only; current operation, exact metro locality and coaching offer require independent verification",
        attribution,
      }));
    await mkdir("data", { recursive: true });
    await writeFile(
      "data/osm-candidates-odbl.json",
      JSON.stringify({ attribution, candidates }, null, 2),
    );
    store.audit(
      "OpenStreetMap Overpass",
      query,
      raw.elements.length,
      0,
      0,
      "",
      `${attribution}; separate candidate dataset, not counted as accepted CRM leads`,
    );
    store.db
      .prepare("INSERT OR REPLACE INTO meta VALUES(?,?)")
      .run(
        key,
        JSON.stringify({ collectedAt: new Date().toISOString(), count: candidates.length }),
      );
  } catch (e) {
    store.audit(
      "OpenStreetMap Overpass",
      query,
      0,
      0,
      0,
      e instanceof Error ? e.message : "Collection failed",
      attribution,
    );
    throw e;
  }
}
