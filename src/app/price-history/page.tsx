import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PriceHistoryChart } from "@/components/vehicle/PriceHistoryChart";
import { formatPriceLakh } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Price History — RASTA",
  description:
    "Dedicated price history analytics for Pakistan's verified automotive catalog. View saved ex-factory and historical price movements in one place.",
};

export default async function PriceHistoryPage() {
  const priceHistories = await prisma.priceHistory.findMany({
    where: {
      priceLakh: {
        not: null,
      },
    },
    orderBy: [{ year: "asc" }, { month: "asc" }],
    take: 16,
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
  });

  const points = priceHistories.map((ph) => ({
    label: `${ph.year}-${String(ph.month).padStart(2, "0")}`,
    value: ph.priceLakh as number,
    priceType: ph.priceType,
    currency: ph.currency,
    note: ph.variant
      ? `${ph.variant.model.brand.name} ${ph.variant.model.name}`
      : ph.note,
  }));

  const firstPoint = points[0];
  const latestPoint = points[points.length - 1];
  const rateChange = firstPoint && latestPoint
    ? (((latestPoint.value - firstPoint.value) / firstPoint.value) * 100).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 bg-[#0E0F11] text-[#EDEBE6] min-h-screen">
      <div className="space-y-6">
        <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2 max-w-3xl">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#616266]">
                Price History Analytics
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6]">
                Dedicated Market Price History
              </h1>
              <p className="text-sm font-mono leading-relaxed text-[#9A9994]">
                Explore saved ex-factory and historical sticker prices from the RASTA catalog. This new page surfaces verified price movement data across the local market.
              </p>
            </div>
            {rateChange !== null && (
              <div className="rounded-sm border border-[#2A2C30] bg-[#141518] px-4 py-3 text-sm font-semibold text-[#EDEBE6]">
                {points.length} recorded points · Change: {rateChange}% since first entry
              </div>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6">
          <PriceHistoryChart points={points} />
        </div>

        <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-[#EDEBE6]">
            Sample Price History Entries
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-[#2A2C30] text-[#9A9994] uppercase text-xs">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Variant</th>
                  <th className="py-3 px-4">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2C30]">
                {priceHistories.map((ph) => (
                  <tr key={ph.id} className="hover:bg-[#141518]">
                    <td className="py-3 px-4 text-[#EDEBE6]">
                      {ph.year}-{String(ph.month).padStart(2, "0")}
                    </td>
                    <td className="py-3 px-4 text-[#C9A227] font-semibold">
                      {ph.priceLakh ? formatPriceLakh(ph.priceLakh) : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-[#9A9994]">
                      {ph.variant?.model.brand.name} {ph.variant?.model.name}
                    </td>
                    <td className="py-3 px-4 text-[#4EBA8E] uppercase">
                      {ph.priceType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
