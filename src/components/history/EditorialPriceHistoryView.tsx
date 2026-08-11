"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Filter,
  ArrowRight,
  ShieldCheck,
  Scale,
  Compass,
  DollarSign,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PriceHistoryChart,
  type PriceHistoryPoint,
} from "@/components/history/PriceHistoryChart";

interface EditorialPriceHistoryViewProps {
  points: PriceHistoryPoint[];
  allBrands: string[];
  metrics: {
    totalRecords: number;
    earliestYear: number;
    latestYear: number;
    lowestPriceLakh: number;
    highestPriceLakh: number;
    avgCurrentPriceLakh: number;
    avgHistoricalPriceLakh: number;
    percentageChange: number;
  };
}

export function EditorialPriceHistoryView({
  points,
  allBrands,
  metrics,
}: EditorialPriceHistoryViewProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPoints = useMemo(() => {
    let list = [...points];
    if (selectedBrand) {
      list = list.filter(
        (p) => p.brandName.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.modelName.toLowerCase().includes(q) ||
          p.variantName.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          (p.note && p.note.toLowerCase().includes(q))
      );
    }
    return list;
  }, [points, selectedBrand, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0E0F11] pb-24">
      {/* 1. EDITORIAL HEADER */}
      <section className="border-b border-[#2A2C30] bg-[#141518] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>MARKET INTELLIGENCE • EX-FACTORY TARIFF CHRONICLE</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEBE6] tracking-tight">
              Pakistan Automotive Price History
            </h1>
            <p className="text-sm sm:text-base text-[#9A9994] font-mono leading-relaxed">
              Longitudinal analysis of ex-factory sticker prices, regulatory tariff
              revisions, devaluation adjustments, and CKD assembly inflation across{" "}
              {metrics.totalRecords} verified milestones ({metrics.earliestYear}–{metrics.latestYear}).
            </p>
          </div>
        </div>
      </section>

      {/* 2. SUMMARY HEADER WITH KEY METRICS & PERCENTAGE CHANGE */}
      <section className="border-b border-[#2A2C30] bg-[#17181B] py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
            <div className="p-4 rounded-sm border border-[#2A2C30] bg-[#141518] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A9994] block">
                TOTAL DOCUMENTED MILESTONES
              </span>
              <span className="font-bold text-2xl text-[#EDEBE6]">
                {metrics.totalRecords} Records
              </span>
              <span className="text-xs text-[#4EBA8E] block">
                {metrics.earliestYear} – {metrics.latestYear} Archive
              </span>
            </div>

            <div className="p-4 rounded-sm border border-[#2A2C30] bg-[#141518] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A9994] block">
                HISTORICAL LOW vs. PEAK
              </span>
              <div className="font-bold text-xl text-[#C9A227]">
                PKR {metrics.lowestPriceLakh}L – {metrics.highestPriceLakh}L
              </div>
              <span className="text-xs text-[#9A9994] block">
                Ex-Factory PKR Lakh Range
              </span>
            </div>

            <div className="p-4 rounded-sm border border-[#2A2C30] bg-[#141518] space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#9A9994] block">
                MARKET AVERAGE BENCHMARK
              </span>
              <div className="font-bold text-2xl text-[#EDEBE6]">
                PKR {metrics.avgCurrentPriceLakh} Lakh
              </div>
              <span className="text-xs text-[#9A9994] block">
                2024–2026 CKD / CBU Average
              </span>
            </div>

            <div className="p-4 rounded-sm border border-[#C9A227]/30 bg-[#C9A227]/10 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#C9A227] block font-bold">
                CUMULATIVE MARKET CHANGE
              </span>
              <div className="font-bold text-2xl text-[#C9A227]">
                +{metrics.percentageChange}%
              </div>
              <span className="text-xs text-[#9A9994] block">
                Ex-Factory Tariff Index Increase
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FILTER BAR & GRAPH */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#C9A227]" />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="h-10 rounded-sm border border-[#2A2C30] bg-[#17181B] px-3 text-sm font-mono text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
            >
              <option value="">All Manufacturers ({allBrands.length})</option>
              {allBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9994]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by model, variant, or note..."
              className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#17181B] pl-9 pr-4 text-sm font-mono text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#C9A227] focus:outline-none"
            />
          </div>
        </div>

        {/* PRICE HISTORY CHART */}
        <PriceHistoryChart
          points={filteredPoints}
          selectedBrand={selectedBrand}
        />

        {/* 4. SAMPLE PRICING TABLE BENEATH THE CHART */}
        <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2C30] pb-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#EDEBE6]">
                Ex-Factory Tariff Schedule &amp; Provenance Table
              </h3>
              <p className="text-xs font-mono text-[#9A9994] mt-1">
                Showing {filteredPoints.length} chronological pricing ledgers
                across Pakistani local assembly and CBU import categories.
              </p>
            </div>
            <Link
              href="/cars"
              className="text-xs font-mono uppercase tracking-widest text-[#C9A227] hover:underline"
            >
              EXPLORE FULL CATALOG →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm font-mono">
              <thead>
                <tr className="border-b border-[#2A2C30] text-[#9A9994] text-xs uppercase">
                  <th className="py-3 px-4">Period (YYYY-MM)</th>
                  <th className="py-3 px-4">Manufacturer &amp; Model</th>
                  <th className="py-3 px-4">Sticker Price (PKR Lakh)</th>
                  <th className="py-3 px-4">2026 Inflation Adjusted</th>
                  <th className="py-3 px-4">Tariff Revision &amp; Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2C30]">
                {filteredPoints.slice(0, 35).map((p) => (
                  <tr key={p.id} className="hover:bg-[#1F2023] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#EDEBE6] whitespace-nowrap">
                      {p.label}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#EDEBE6] block">
                        {p.brandName} {p.modelName}
                      </span>
                      <span className="text-xs text-[#9A9994]">
                        {p.variantName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num font-bold text-[#C9A227] whitespace-nowrap">
                      PKR {p.value} Lakh
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-[#4EBA8E] whitespace-nowrap">
                      {p.inflationValue
                        ? `~PKR ${p.inflationValue} Lakh`
                        : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#9A9994] leading-relaxed max-w-md">
                      {p.note || "Standard assembler ex-factory tariff schedule."}
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
