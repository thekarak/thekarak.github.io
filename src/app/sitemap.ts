import type { MetadataRoute } from "next";
import { profile } from "@/data/projects";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL || profile.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
