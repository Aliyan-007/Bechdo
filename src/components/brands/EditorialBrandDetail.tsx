"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Car } from "lucide-react";
import { EditorialVehicleCard } from "@/components/editorial/EditorialVehicleCard";
import { formatPriceRange } from "@/lib/utils";

interface EditorialBrandDetailProps {
  brand: {
    id: string;
    name: string;
    slug: string;
    logoInitial: string;
    color: string;
    country: string;
    description: string;
    isPakistaniAssembled: boolean;
  };
  vehicles: any[];
  events: any[];
}

export function EditorialBrandDetail({
  brand,
  vehicles,
  events,
}: EditorialBrandDetailProps) {
  const minPrice =
    vehicles.length > 0
      ? Math.min(...vehicles.map((v) => v.priceMinLakh))
      : 0;
  const maxPrice =
    vehicles.length > 0
      ? Math.max(...vehicles.map((v) => v.priceMaxLakh))
      : 0;
  const bodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType)));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-[#0E0F11]">
      {/* Back Link */}
      <Link
        href="/brands"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9A9994] hover:text-[#EDEBE6] mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO ALL MANUFACTURERS</span>
      </Link>

      {/* Brand Hero Cover */}
      <div className="rounded-sm border border-[#2A2C30] bg-[#141518] p-8 sm:p-10 mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-sm font-display font-bold text-3xl"
              style={{
                backgroundColor: brand.color || "#2F6B54",
                color: "#EDEBE6",
              }}
            >
              {brand.logoInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#9A9994] flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#2F6B54]" />
                  <span>{brand.country} ORIGIN</span>
                </span>
                <span className="text-xs font-mono text-[#4EBA8E] bg-[#2F6B54]/15 px-2 py-0.5 rounded-sm">
                  {brand.isPakistaniAssembled
                    ? "CKD LOCAL ASSEMBLY"
                    : "CBU IMPORT"}
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEBE6] mt-1">
                {brand.name.toUpperCase()}
              </h1>
            </div>
          </div>

          <p className="text-sm font-mono text-[#9A9994] leading-relaxed max-w-3xl">
            {brand.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {bodyTypes.map((bt) => (
              <span
                key={bt}
                className="px-3 py-1 rounded-sm bg-[#1F2023] border border-[#2A2C30] text-xs font-mono text-[#EDEBE6]"
              >
                {bt.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Right Statistics Box */}
        <div className="md:col-span-4 rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-4 font-mono">
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-[#C9A227] pb-2 border-b border-[#2A2C30]">
            PAKISTAN MARKET PROFILE
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#2A2C30]/50">
              <span className="text-[#9A9994]">MODELS TRACKED</span>
              <span className="font-bold text-[#EDEBE6]">
                {vehicles.length} {vehicles.length === 1 ? "MODEL" : "MODELS"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-[#2A2C30]/50">
              <span className="text-[#9A9994]">PRICE SPECTRUM</span>
              <span className="font-bold text-[#C9A227]">
                {minPrice > 0
                  ? formatPriceRange(minPrice, maxPrice)
                  : "Check dealers"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#9A9994]">PRESENCE STATUS</span>
              <span className="font-bold text-[#4EBA8E]">ACTIVE ARCHIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2C30] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#4EBA8E] uppercase tracking-wider">
              VERIFIED CATALOG
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              {brand.name} Models in Pakistan ({vehicles.length})
            </h2>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-12 text-center space-y-3">
            <Car className="h-8 w-8 text-[#9A9994] mx-auto" />
            <h3 className="font-display text-lg font-semibold text-[#EDEBE6]">
              No current models found for {brand.name}
            </h3>
            <p className="text-xs font-mono text-[#9A9994]">
              Check our full catalog for upcoming imports and dealer listings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <EditorialVehicleCard key={v.id} vehicle={v} variant="standard" />
            ))}
          </div>
        )}
      </div>

      {/* Brand History Timeline Box if available */}
      {events.length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#2A2C30] space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-wider">
              AUTOMOTIVE HERITAGE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              {brand.name} Milestones in Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-3"
              >
                <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/15 px-2.5 py-1 rounded-sm">
                  {ev.year} • {ev.decade}
                </span>
                <h3 className="font-display font-bold text-lg text-[#EDEBE6]">
                  {ev.title}
                </h3>
                <p className="text-xs font-mono text-[#9A9994] leading-relaxed">
                  {ev.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
