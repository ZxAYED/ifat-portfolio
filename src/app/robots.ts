import type { MetadataRoute } from "next";
import { indexingEnabled, siteOrigin } from "@/lib/indexing";
export default function robots(): MetadataRoute.Robots {
  return indexingEnabled()
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteOrigin()}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
