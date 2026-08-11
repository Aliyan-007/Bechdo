"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { EditorialVehicleCard } from "@/components/editorial/EditorialVehicleCard";

interface ShowcaseVehicle {
  id: string;
  brand: string;
  model: string;
  variantName: string;
  bodyType: string;
  fuelType: string;
  priceMinLakh: number;
  priceMaxLakh: number;
  badge: string | null;
  engine: string;
  transmission: string;
  seating: number;
  mileageKmpl?: number | null;
  powerHp: number;
  torqueNm: number;
  colors: string[];
  images: any[];
}

interface EditorialShowcaseFeedProps {
  featuredVehicles: ShowcaseVehicle[];
  popularVehicles: ShowcaseVehicle[];
  recentlyAddedVehicles: ShowcaseVehicle[];
}

export function EditorialShowcaseFeed({
  featuredVehicles,
  popularVehicles,
  recentlyAddedVehicles,
}: EditorialShowcaseFeedProps) {
  const [activeTab, setActiveTab] = useState<"featured" | "popular" | "recent">(
    "featured"
  );

  const activeVehicles =
    activeTab === "featured"
      ? featuredVehicles
      : activeTab === "popular"
      ? popularVehicles
      : recentlyAddedVehicles;

  const tabMeta = {
    featured: {
      title: "Featured Flagships & Premium Showcase",
      subtitle: "EDITOR'S SELECT • FLAGSHIP CKD & CBU RANGE",
      viewAllHref: "/cars?featured=true",
      viewAllLabel: "EXPLORE ALL FEATURED CARS",
    },
    popular: {
      title: "Popular Market Leaders in Pakistan",
      subtitle: "HIGHEST RETAIL VOLUME • DOMESTIC BENCHMARKS",
      viewAllHref: "/cars?popular=true",
      viewAllLabel: "EXPLORE ALL POPULAR CARS",
    },
    recent: {
      title: "Recently Verified & New Additions",
      subtitle: "LATEST TARIFF SCHEDULES • 2024–2026 ARCHIVE",
      viewAllHref: "/cars?recentlyAdded=true",
      viewAllLabel: "EXPLORE ALL NEW ADDITIONS",
    },
  }[activeTab];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-[#2A2C30]">
      {/* Editorial Navigation Ribbons */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-[#2A2C30] pb-6">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#4EBA8E] uppercase tracking-widest block">
            {tabMeta.subtitle}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#EDEBE6]">
            {tabMeta.title}
          </h2>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex items-center gap-1 bg-[#17181B] p-1.5 rounded-sm border border-[#2A2C30] self-start sm:self-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab("featured")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm transition-colors ${
              activeTab === "featured"
                ? "bg-[#2F6B54]/20 text-[#4EBA8E] border border-[#3E8A6C]/50 font-bold"
                : "text-[#9A9994] hover:text-[#EDEBE6]"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>FEATURED ({featuredVehicles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm transition-colors ${
              activeTab === "popular"
                ? "bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/50 font-bold"
                : "text-[#9A9994] hover:text-[#EDEBE6]"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>POPULAR ({popularVehicles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm transition-colors ${
              activeTab === "recent"
                ? "bg-[#3D7399]/20 text-[#71A8D4] border border-[#3D7399]/50 font-bold"
                : "text-[#9A9994] hover:text-[#EDEBE6]"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>RECENT ({recentlyAddedVehicles.length})</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {activeVehicles.map((vehicle) => (
          <EditorialVehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            variant="standard"
          />
        ))}
      </div>

      {/* View All Footer CTA */}
      <div className="flex justify-center">
        <Link
          href={tabMeta.viewAllHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#17181B] border border-[#2A2C30] hover:border-[#4EBA8E] text-xs font-mono uppercase font-bold text-[#EDEBE6] transition-colors"
        >
          <span>{tabMeta.viewAllLabel}</span>
          <ArrowRight className="h-4 w-4 text-[#4EBA8E]" />
        </Link>
      </div>
    </section>
  );
}
