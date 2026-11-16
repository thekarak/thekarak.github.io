import type { MetadataRoute } from "next";
import { profile } from "@/data/projects";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_SITE_URL || profile.siteUrl;
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
  };
}
