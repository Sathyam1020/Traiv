import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { isPreview } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    ...(isPreview ? {} : { sitemap: `${SITE.url}/sitemap.xml` }),
  };
}
