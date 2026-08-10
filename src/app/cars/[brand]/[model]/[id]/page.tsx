import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialVehicleDetail } from "@/components/vehicle/EditorialVehicleDetail";

interface Props {
  params: Promise<{
    brand: string;
    model: string;
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await prisma.variant.findUnique({
    where: { id },
    include: {
      model: {
        include: { brand: true },
      },
    },
  });

  if (!vehicle) {
    return {
      title: "Vehicle Not Found | RASTA",
    };
  }

  const title = `${vehicle.model.brand.name} ${vehicle.model.name} ${vehicle.name} Price in Pakistan | RASTA`;
  const description = `Check ex-factory price, specs, 4-year price history, and features for the ${vehicle.model.brand.name} ${vehicle.model.name} ${vehicle.name} (${vehicle.bodyType}).`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { id } = await params;

  const vehicle = await prisma.variant.findUnique({
    where: { id },
    include: {
      model: {
        include: {
          brand: true,
        },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
      specification: true,
      priceHistories: {
        orderBy: [{ year: "asc" }, { month: "asc" }],
      },
      pakAvailability: true,
      features: {
        include: {
          feature: true,
        },
      },
      generation: true,
    },
  });

  if (!vehicle) {
    notFound();
  }

  // Fetch similar vehicles
  const rawSimilar = await prisma.variant.findMany({
    where: {
      AND: [
        { id: { not: id } },
        {
          OR: [
            { bodyType: vehicle.bodyType },
            { modelId: vehicle.modelId },
          ],
        },
      ],
    },
    include: {
      model: {
        include: { brand: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    take: 8,
  });

  const similarVehicles = rawSimilar.map((v) => ({
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

  const mappedVehicle = {
    id: vehicle.id,
    brand: {
      name: vehicle.model.brand.name,
      slug: vehicle.model.brand.slug,
      color: vehicle.model.brand.color,
      country: vehicle.model.brand.country,
      description: vehicle.model.brand.description,
    },
    model: {
      name: vehicle.model.name,
      slug: vehicle.model.slug,
      bodyType: vehicle.model.bodyType,
    },
    name: vehicle.name,
    variantCount: vehicle.variantCount,
    priceMinLakh: vehicle.priceMinLakh,
    priceMaxLakh: vehicle.priceMaxLakh,
    badge: vehicle.badge,
    bodyType: vehicle.bodyType,
    fuelType: vehicle.fuelType,
    engine: vehicle.engine,
    transmission: vehicle.transmission,
    seating: vehicle.seating,
    mileageKmpl: vehicle.mileageKmpl,
    powerHp: vehicle.powerHp,
    torqueNm: vehicle.torqueNm,
    fuelTankL: vehicle.fuelTankL,
    bootSpaceL: vehicle.bootSpaceL,
    groundClearanceMm: vehicle.groundClearanceMm,
    airbags: vehicle.airbags,
    colors: vehicle.colors ? JSON.parse(vehicle.colors) : [],
    images: vehicle.images,
    specification: vehicle.specification,
    priceHistories: vehicle.priceHistories,
    pakAvailability: vehicle.pakAvailability,
    features: vehicle.features,
    generation: vehicle.generation,
  };

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `${vehicle.model.brand.name} ${vehicle.model.name} ${vehicle.name}`,
    image:
      vehicle.images[0]?.url ||
      "https://rasta-auto-pk.e2b.app/images/default-car.jpg",
    description: `Ex-factory price in Pakistan for the ${vehicle.model.brand.name} ${vehicle.model.name} ${vehicle.name}. Powertrain: ${vehicle.engine}, ${vehicle.powerHp} HP.`,
    brand: {
      "@type": "Brand",
      name: vehicle.model.brand.name,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "PKR",
      lowPrice: Math.round(vehicle.priceMinLakh * 100000),
      highPrice: Math.round(vehicle.priceMaxLakh * 100000),
      offerCount: vehicle.variantCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EditorialVehicleDetail
        vehicle={mappedVehicle}
        similarVehicles={similarVehicles}
      />
    </>
  );
}
