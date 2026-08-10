import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin & Catalog Management | RASTA Automotive Pakistan",
  description:
    "Administrator portal for managing Pakistani automotive brands, vehicle specifications, ex-factory pricing, and historical timeline records.",
};

export default async function AdminPage() {
  const [
    totalBrands,
    totalModels,
    totalGenerations,
    totalVariants,
    totalImages,
    totalPriceHistories,
    totalEvents,
    currentVehicles,
    historicalVehicles,
    ckdVehicles,
    cbuVehicles,
    brands,
    recentVariants,
    auditLogs,
    correctionReports,
    session,
  ] = await Promise.all([
    prisma.brand.count(),
    prisma.model.count(),
    prisma.generation.count(),
    prisma.variant.count(),
    prisma.image.count(),
    prisma.priceHistory.count(),
    prisma.historicalEvent.count(),
    prisma.variant.count({ where: { status: "CURRENT" } }),
    prisma.variant.count({ where: { status: "HISTORICAL" } }),
    prisma.pakistanAvailability.count({ where: { isLocallyAssembled: true } }),
    prisma.pakistanAvailability.count({ where: { isLocallyAssembled: false } }),
    prisma.brand.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
    prisma.variant.findMany({
      include: {
        model: {
          include: { brand: true },
        },
        pakAvailability: true,
      },
      orderBy: {
        id: "asc",
      },
      take: 60,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.correctionReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        variant: {
          select: {
            name: true,
            model: {
              select: {
                name: true,
                brand: { select: { name: true } },
              },
            },
          },
        },
      },
      take: 20,
    }),
    getCurrentSession(),
  ]);

  const allBrands = brands.map((b) => b.name);

  const mappedVariants = recentVariants.map((v) => ({
    id: v.id,
    brand: v.model.brand.name,
    model: v.model.name,
    variantName: v.name,
    bodyType: v.bodyType,
    fuelType: v.fuelType,
    priceMinLakh: v.priceMinLakh,
    priceMaxLakh: v.priceMaxLakh,
    status: v.status,
    verificationStatus: v.verificationStatus,
    isLocallyAssembled: v.pakAvailability?.isLocallyAssembled ?? true,
    isFeatured: v.isFeatured,
    isPopular: v.isPopular,
  }));

  const stats = {
    totalBrands,
    totalModels,
    totalGenerations,
    totalVariants,
    totalImages,
    totalPriceHistories,
    totalEvents,
    currentVehicles,
    historicalVehicles,
    ckdVehicles,
    cbuVehicles,
  };

  return (
    <AdminDashboard
      stats={stats}
      allBrands={allBrands}
      recentVariants={mappedVariants}
      auditLogs={auditLogs}
      correctionReports={correctionReports}
      session={session}
    />
  );
}
