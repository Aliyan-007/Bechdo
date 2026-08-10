import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/cars/", "/brands/", "/compare", "/history"],
      disallow: ["/admin/", "/api/"],
    },
    sitemap: "https://rasta-auto.pk/sitemap.xml",
  };
}
