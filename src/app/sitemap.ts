import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rasta-auto.pk";

  // Core static pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Fetch all brands
  const brands = await prisma.brand.findMany({
    select: { slug: true },
  });

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${baseUrl}/brands/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Fetch all published variants
  const variants = await prisma.variant.findMany({
    where: { publicationStatus: "PUBLISHED" },
    select: {
      id: true,
      lastVerified: true,
      model: {
        select: {
          slug: true,
          brand: {
            select: { slug: true },
          },
        },
      },
    },
  });

  const variantRoutes: MetadataRoute.Sitemap = variants.map((v) => ({
    url: `${baseUrl}/cars/${v.model.brand.slug}/${v.model.slug}/${v.id}`,
    lastModified: v.lastVerified ? new Date(v.lastVerified) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...coreRoutes, ...brandRoutes, ...variantRoutes];
}
