import React, { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialPriceHistoryView } from "@/components/history/EditorialPriceHistoryView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pakistan Automotive Price History & Ex-Factory Trends | BECH DO (بیچ دو)",
  description:
    "Longitudinal analysis of Pakistani ex-factory sticker prices, tariff revisions, and inflation-adjusted historical benchmarks across 8 decades.",
};

export default async function PriceHistoryPage() {
  const [priceHistories, allBrands] = await Promise.all([
    prisma.priceHistory.findMany({
      orderBy: [
        { year: "asc" },
        { month: "asc" },
      ],
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
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { name: true },
    }),
  ]);

  const points = priceHistories.map((ph) => {
    const mm = String(ph.month || 1).padStart(2, "0");
    return {
      id: ph.id,
      label: `${ph.year}-${mm}`,
      year: ph.year,
      month: ph.month || 1,
      value: ph.priceLakh || 0,
      inflationValue: ph.inflationAdjustedLakh || null,
      note: ph.tariffNote || ph.note || null,
      variantName: ph.variant.name,
      modelName: ph.variant.model.name,
      brandName: ph.variant.model.brand.name,
    };
  });

  const validPrices = points.map((p) => p.value).filter((v) => v > 0);
  const totalRecords = points.length;
  const earliestYear = totalRecords > 0 ? points[0].year : 1953;
  const latestYear = totalRecords > 0 ? points[totalRecords - 1].year : 2026;
  const lowestPriceLakh = validPrices.length > 0 ? Math.min(...validPrices) : 0;
  const highestPriceLakh = validPrices.length > 0 ? Math.max(...validPrices) : 0;

  const currentPoints = points.filter((p) => p.year >= 2024);
  const historicalPoints = points.filter((p) => p.year < 2015);

  const avgCurrentPriceLakh =
    currentPoints.length > 0
      ? Math.round(
          (currentPoints.reduce((sum, p) => sum + p.value, 0) /
            currentPoints.length) *
            10
        ) / 10
      : 65;

  const avgHistoricalPriceLakh =
    historicalPoints.length > 0
      ? Math.round(
          (historicalPoints.reduce((sum, p) => sum + p.value, 0) /
            historicalPoints.length) *
            10
        ) / 10
      : 15;

  const percentageChange =
    avgHistoricalPriceLakh > 0
      ? Math.round(
          ((avgCurrentPriceLakh - avgHistoricalPriceLakh) /
            avgHistoricalPriceLakh) *
            100
        )
      : 330;

  const metrics = {
    totalRecords,
    earliestYear,
    latestYear,
    lowestPriceLakh,
    highestPriceLakh,
    avgCurrentPriceLakh,
    avgHistoricalPriceLakh,
    percentageChange,
  };

  const brandNames = allBrands.map((b) => b.name);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-[#9A9994] font-mono">
          Loading BECH DO Price History Archive...
        </div>
      }
    >
      <EditorialPriceHistoryView
        points={points}
        allBrands={brandNames}
        metrics={metrics}
      />
    </Suspense>
  );
}
