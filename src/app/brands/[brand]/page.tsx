import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialBrandDetail } from "@/components/brands/EditorialBrandDetail";

interface Props {
  params: Promise<{
    brand: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = await prisma.brand.findUnique({
    where: { slug },
  });

  if (!brand) {
    return { title: "Brand Not Found | RASTA" };
  }

  return {
    title: `${brand.name} Cars in Pakistan | Price, Models & Specs | RASTA`,
    description: `${brand.name} Pakistan: Explore ex-factory prices, specifications, and local assembly status for all ${brand.name} vehicles sold in Pakistan.`,
  };
}

export default async function BrandDetailPage({ params }: Props) {
  const { brand: slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      models: true,
    },
  });

  if (!brand) {
    notFound();
  }

  const rawVariants = await prisma.variant.findMany({
    where: {
      model: {
        brandId: brand.id,
      },
    },
    include: {
      model: {
        include: { brand: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const vehicles = rawVariants.map((v) => ({
    id: v.id,
    brand: v.model.brand.name,
    model: v.model.name,
    variantName: v.name,
    bodyType: v.bodyType,
    fuelType: v.fuelType,
    priceMinLakh: v.priceMinLakh,
    priceMaxLakh: v.priceMaxLakh,
    badge: v.badge,
    engine: v.engine,
    transmission: v.transmission,
    seating: v.seating,
    mileageKmpl: v.mileageKmpl,
    powerHp: v.powerHp,
    torqueNm: v.torqueNm,
    colors: v.colors ? JSON.parse(v.colors) : [],
    images: v.images,
  }));

  const events = await prisma.historicalEvent.findMany({
    where: {
      OR: [
        { brandName: brand.name },
        { title: { contains: brand.name } },
        { description: { contains: brand.name } },
      ],
    },
    take: 3,
  });

  return (
    <EditorialBrandDetail
      brand={brand}
      vehicles={vehicles}
      events={events}
    />
  );
}
