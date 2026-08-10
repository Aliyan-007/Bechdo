"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Compass, Scale, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorialHeroProps {
  totalVehicles: number;
  totalBrands: number;
}

export function EditorialHero({ totalVehicles, totalBrands }: EditorialHeroProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const brands = [
    "Toyota",
    "Honda",
    "Suzuki",
    "Kia",
    "Hyundai",
    "BYD",
    "Peugeot",
    "MG",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cars?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickBrandClick = (brandName: string) => {
    router.push(`/cars?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-[#2A2C30] bg-[#0E0F11] pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Subtle architectural grid pattern background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Monumental Typographic Cover (Zero Container Boxes) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 text-xs font-mono tracking-widest text-[#C9A227] uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-[#C9A227]" />
              <span>EST. 2026 • AUTHORITATIVE REFERENCE ARCHIVE</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#EDEBE6] leading-[0.98]">
                Pakistan&rsquo;s <br />
                <span className="text-[#9A9994] font-normal">Automotive Archive.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#9A9994] max-w-xl font-mono leading-relaxed pt-2">
                A permanent, verified record of {totalVehicles} variants across{" "}
                {totalBrands} manufacturers. Documenting ex-factory pricing, CKD/CBU
                assembly provenance, and 8 decades of local motoring history.
              </p>
            </div>

            {/* New Editorial Search Block */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-lg pt-4">
              <label htmlFor="editorial-search" className="sr-only">
                Search the archive
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9994]">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  id="editorial-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brands, models, trims, or keywords..."
                  className="w-full h-14 rounded-none border border-[#2A2C30] bg-[#141518] pl-12 pr-32 text-base text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#2F6B54] focus:outline-none transition-colors shadow-sm"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-none font-mono text-xs font-semibold tracking-wider uppercase bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6]"
                >
                  SEARCH
                </Button>
              </div>
            </form>

            {/* Typography-led Quick Discovery Strip */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#616266] block">
                FREQUENT RESEARCH QUERIES:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleQuickBrandClick(b)}
                    className="px-3 py-1.5 rounded-sm bg-[#141518] border border-[#2A2C30] hover:border-[#C9A227] text-xs font-mono font-medium text-[#EDEBE6] transition-colors"
                  >
                    {b}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => router.push("/cars?isLocallyAssembled=true")}
                  className="px-3 py-1.5 rounded-sm bg-[#2F6B54]/15 border border-[#2F6B54]/40 hover:border-[#2F6B54] text-xs font-mono font-medium text-[#4EBA8E] transition-colors"
                >
                  • LOCAL CKD
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/cars?isLocallyAssembled=false")}
                  className="px-3 py-1.5 rounded-sm bg-[#141518] border border-[#2A2C30] hover:border-[#C9A227] text-xs font-mono font-medium text-[#EDEBE6] transition-colors"
                >
                  • OFFICIAL CBU
                </button>
              </div>
            </div>
          </div>

          {/* Right: Zero-Container Editorial Vehicle Composition (No Card Boxes!) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="relative">
              {/* Decorative architectural crosshairs */}
              <div className="absolute -top-3 -left-3 h-3 w-3 border-t border-l border-[#C9A227]" />
              <div className="absolute -bottom-3 -right-3 h-3 w-3 border-b border-r border-[#C9A227]" />

              <div className="aspect-[16/10] overflow-hidden bg-[#0E0F11] relative">
                {/* SVG Illustration of flagship Pakistani vehicle silhouette with architectural styling */}
                <svg
                  viewBox="0 0 800 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-90 transition-transform duration-700 hover:scale-[1.02]"
                >
                  <rect width="800" height="500" fill="#141518" />
                  {/* Subtle Grid on canvas */}
                  <g opacity="0.1" stroke="#8C8C85" strokeWidth="0.5">
                    <line x1="0" y1="100" x2="800" y2="100" />
                    <line x1="0" y1="200" x2="800" y2="200" />
                    <line x1="0" y1="300" x2="800" y2="300" />
                    <line x1="0" y1="400" x2="800" y2="400" />
                    <line x1="200" y1="0" x2="200" y2="500" />
                    <line x1="400" y1="0" x2="400" y2="500" />
                    <line x1="600" y1="0" x2="600" y2="500" />
                  </g>
                  {/* Modern Automotive Sedan Silhouette */}
                  <path
                    d="M120 340 L160 280 L250 250 L420 230 L580 260 L680 300 L710 340 Z"
                    fill="#1F2023"
                    stroke="#C9A227"
                    strokeWidth="2"
                  />
                  <path
                    d="M260 255 L390 238 L540 265 L540 285 L260 285 Z"
                    fill="#17181B"
                    stroke="#2F6B54"
                    strokeWidth="1"
                  />
                  {/* Wheels */}
                  <circle cx="230" cy="340" r="42" fill="#0E0F11" stroke="#C9A227" strokeWidth="3" />
                  <circle cx="230" cy="340" r="22" fill="#1F2023" />
                  <circle cx="610" cy="340" r="42" fill="#0E0F11" stroke="#C9A227" strokeWidth="3" />
                  <circle cx="610" cy="340" r="22" fill="#1F2023" />
                  {/* Ground Line */}
                  <line x1="60" y1="382" x2="740" y2="382" stroke="#2A2C30" strokeWidth="2" />
                </svg>

                {/* Editorial Caption overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#C9A227] block tracking-widest">
                      ARCHIVE PLATE NO. 01 — KARACHI, PK
                    </span>
                    <span className="font-display font-bold text-lg text-[#EDEBE6]">
                      Toyota Corolla Altis Grande
                    </span>
                  </div>
                  <div className="text-right font-mono-num text-xs text-[#9A9994]">
                    <span>1.8L • CVT • E170 PK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Strips below hero */}
            <div className="grid grid-cols-3 gap-2 pt-6">
              <button
                type="button"
                onClick={() => router.push("/cars")}
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group"
              >
                <Compass className="h-4 w-4 text-[#C9A227] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Catalog
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  160 Variants
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/compare")}
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group"
              >
                <Scale className="h-4 w-4 text-[#2F6B54] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Compare
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  Side-by-Side
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push("/history")}
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group"
              >
                <BookOpen className="h-4 w-4 text-[#C9A227] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Timeline
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  1950s–2020s
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
