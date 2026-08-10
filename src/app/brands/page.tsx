import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialBrandIndex } from "@/components/brands/EditorialBrandIndex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All 36 Automotive Brands in Pakistan | RASTA",
  description:
    "Explore 36 automotive manufacturers sold, locally assembled, or imported in Pakistan across 8 decades of history.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: {
          models: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const brandItems = brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoInitial: b.logoInitial,
    color: b.color,
    country: b.country,
    description: b.description,
    isPakistaniAssembled: b.isPakistaniAssembled,
    modelCount: b._count.models || 1,
  }));

  return <EditorialBrandIndex brands={brandItems} />;
}
