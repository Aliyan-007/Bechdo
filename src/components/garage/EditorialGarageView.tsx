"use client";

import React from "react";
import Link from "next/link";
import { Heart, Scale, Trash2, ArrowRight, Car, ShieldCheck } from "lucide-react";
import { useFavorites } from "@/components/favorites-provider";
import { useCompare } from "@/components/compare-provider";
import { EditorialVehicleCard } from "@/components/editorial/EditorialVehicleCard";
import { formatPriceRange, formatPriceLakh } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GarageVehicle {
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

interface EditorialGarageViewProps {
  serverVehicles: GarageVehicle[];
}

export function EditorialGarageView({
  serverVehicles,
}: EditorialGarageViewProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const { toggleCompare, isCompared } = useCompare();

  // Combine client favorites with server benchmark garage vehicles
  const combinedVehicles =
    favorites.length > 0 && serverVehicles.length > 0
      ? serverVehicles.filter(
          (v) =>
            favorites.includes(v.id) ||
            serverVehicles.slice(0, 4).some((sv) => sv.id === v.id)
        )
      : serverVehicles;

  const minPrice =
    combinedVehicles.length > 0
      ? Math.min(...combinedVehicles.map((v) => v.priceMinLakh))
      : 0;
  const maxPrice =
    combinedVehicles.length > 0
      ? Math.max(...combinedVehicles.map((v) => v.priceMaxLakh))
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-[#0E0F11]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#2A2C30] mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#4EBA8E] bg-[#2F6B54]/15 px-2.5 py-0.5 rounded-sm border border-[#3E8A6C]/40">
              PERSONAL AUTOMOTIVE ARCHIVE
            </span>
            <span className="text-xs font-mono text-[#9A9994]">
              {combinedVehicles.length} {combinedVehicles.length === 1 ? "VEHICLE" : "VEHICLES"}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#EDEBE6]">
            Your Saved Garage &amp; Shortlist
          </h1>
          <p className="text-sm font-mono text-[#9A9994] max-w-2xl">
            Review your shortlisted vehicles, inspect side-by-side ex-factory price
            ladders, and export technical specifications across Pakistan&rsquo;s
            reconciled automotive catalog.
          </p>
        </div>

        {/* Action Controls */}
        {combinedVehicles.length > 0 && (
          <div className="flex items-center gap-4 bg-[#17181B] p-4 rounded-sm border border-[#2A2C30] font-mono text-xs shrink-0">
            <div>
              <span className="text-[10px] uppercase text-[#616266] block">
                GARAGE PRICE SPECTRUM
              </span>
              <span className="font-mono-num text-lg font-bold text-[#C9A227]">
                {minPrice > 0
                  ? formatPriceRange(minPrice, maxPrice)
                  : "Check dealers"}
              </span>
            </div>
            <div className="border-l border-[#2A2C30] pl-4">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6] font-bold uppercase transition-colors"
              >
                <Scale className="h-4 w-4" />
                <span>OPEN COMPARE ({combinedVehicles.length})</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Garage Grid */}
      {combinedVehicles.length === 0 ? (
        <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-16 text-center space-y-4">
          <Car className="h-10 w-10 text-[#9A9994] mx-auto" />
          <h2 className="font-display text-xl font-bold text-[#EDEBE6]">
            Your Saved Garage is Currently Empty
          </h2>
          <p className="text-xs font-mono text-[#9A9994] max-w-md mx-auto">
            Browse RASTA&rsquo;s catalog of 200 verified variants to bookmark and
            shortlist vehicles for your personal automotive archive.
          </p>
          <div className="pt-2">
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#2F6B54] hover:bg-[#3E8A6C] text-xs font-mono uppercase font-bold text-[#EDEBE6] transition-colors"
            >
              <span>EXPLORE FULL CATALOG</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Detailed Tabular Summary Matrix */}
          <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#2A2C30] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#4EBA8E]" />
                <h3 className="font-display font-bold text-lg text-[#EDEBE6]">
                  Shortlist Technical Ledger
                </h3>
              </div>
              <span className="text-xs font-mono text-[#9A9994]">
                RECONCILED DATA STANDARD
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2A2C30] text-[#9A9994] uppercase">
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Ex-Factory Price (PKR)</th>
                    <th className="py-3 px-3">Powertrain</th>
                    <th className="py-3 px-3">Power &amp; Torque</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2C30]">
                  {combinedVehicles.map((v) => {
                    const comparing = isCompared(v.id);
                    return (
                      <tr key={v.id} className="hover:bg-[#1F2023]">
                        <td className="py-3.5 px-3 font-semibold text-[#EDEBE6]">
                          <Link
                            href={`/cars/${v.brand.toLowerCase()}/${v.model.toLowerCase()}/${v.id}`}
                            className="hover:text-[#4EBA8E]"
                          >
                            {v.brand} {v.model} {v.variantName}
                          </Link>
                        </td>
                        <td className="py-3.5 px-3 font-mono-num text-[#C9A227] font-bold">
                          {formatPriceRange(v.priceMinLakh, v.priceMaxLakh)}
                        </td>
                        <td className="py-3.5 px-3 text-[#9A9994]">
                          {v.engine} ({v.transmission})
                        </td>
                        <td className="py-3.5 px-3 text-[#EDEBE6]">
                          {v.powerHp} HP • {v.torqueNm} Nm
                        </td>
                        <td className="py-3.5 px-3 text-right space-x-2">
                          <button
                            onClick={() =>
                              toggleCompare({
                                id: v.id,
                                brand: v.brand,
                                model: v.model,
                                variantName: v.variantName,
                                priceMinLakh: v.priceMinLakh,
                                priceMaxLakh: v.priceMaxLakh,
                              })
                            }
                            className={`px-2.5 py-1 rounded-sm border text-[10px] uppercase font-bold transition-colors ${
                              comparing
                                ? "bg-[#2F6B54]/20 border-[#3E8A6C] text-[#4EBA8E]"
                                : "bg-[#17181B] border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6]"
                            }`}
                          >
                            {comparing ? "Comparing" : "Compare"}
                          </button>
                          <button
                            onClick={() => toggleFavorite(v.id)}
                            className="p-1 text-[#9A9994] hover:text-[#B24A3C] transition-colors"
                            title="Remove from Saved Garage"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards Display */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-[#EDEBE6]">
              Saved Garage Cards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {combinedVehicles.map((v) => (
                <EditorialVehicleCard key={v.id} vehicle={v} variant="standard" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
