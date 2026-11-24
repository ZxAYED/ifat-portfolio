import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "@/lib/indexing";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  return ["/", "/work/visual-language-study/"].map(path => ({ url: `${siteOrigin()}${path}` }));
}
