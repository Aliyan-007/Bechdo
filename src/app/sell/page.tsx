import React, { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialSellView } from "@/components/sell/EditorialSellView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sell Your Car in Pakistan — Verified Valuation & Secondary Classifieds | BECH DO (بیچ دو)",
  description:
    "Post your vehicle for sale across Karachi, Lahore, and Islamabad. Benchmark your asking price against ex-factory pricing and connect with serious Pakistani car buyers.",
};

export default async function SellPage() {
  const [brands, usedListings] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        models: {
          orderBy: { name: "asc" },
          include: {
            variants: {
              orderBy: { name: "asc" },
              select: {
                id: true,
                name: true,
                priceMinLakh: true,
                priceMaxLakh: true,
              },
            },
          },
        },
      },
    }),
    prisma.usedListing.findMany({
      where: { status: "ACTIVE" },
      include: {
        variant: {
          include: {
            model: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const mappedBrands = brands.map((b) => ({
    name: b.name,
    models: b.models.map((m) => ({
      name: m.name,
      variants: m.variants.map((v) => ({
        id: v.id,
        name: v.name,
        priceMinLakh: v.priceMinLakh,
        priceMaxLakh: v.priceMaxLakh,
      })),
    })),
  }));

  const mappedListings = usedListings.map((u) => ({
    id: u.id,
    brand: u.variant.model.brand.name,
    model: u.variant.model.name,
    variant: u.variant.name,
    registrationYear: u.registrationYear,
    priceLakh: u.askingPriceLakh,
    mileageKm: u.mileageKm,
    location: u.registrationCity,
    grade: u.inspectionGrade,
    notes: u.notes || "",
  }));

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-[#9A9994] font-mono">
          Loading BECH DO Secondary Marketplace...
        </div>
      }
    >
      <EditorialSellView brands={mappedBrands} initialListings={mappedListings} />
    </Suspense>
  );
}
