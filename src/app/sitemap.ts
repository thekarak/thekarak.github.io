import type { MetadataRoute } from "next";
import { profile } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || profile.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
