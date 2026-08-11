"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    } else {
      router.push("/cars");
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
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#EDEBE6] leading-[1.1]">
                <span className="font-nastaliq font-normal text-6xl sm:text-7xl lg:text-8xl inline-block leading-normal py-2">
                  بیچ دو
                </span>{" "}
                <span className="text-[#C9A227] font-normal text-3xl sm:text-4xl">(BECH DO)</span> <br />
                <span className="text-[#9A9994] font-normal text-3xl sm:text-4xl">BUY OR SELL CARS</span>
              </h1>
              <p className="text-base sm:text-lg text-[#4EBA8E] font-semibold font-mono">
                PAKISTAN&apos;S AUTOMOTIVE WORLD • Buy cars. Sell cars. Discover cars.
              </p>
              <p className="text-sm sm:text-base text-[#9A9994] max-w-xl font-mono leading-relaxed pt-1">
                A permanent, verified record of {totalVehicles} variants across{" "}
                {totalBrands} manufacturers. Documenting ex-factory pricing, CKD/CBU
                assembly provenance, used classifieds, and 8 decades of local motoring history.
              </p>
            </div>

            {/* Precision Command Search Bar (No generic boxy containers) */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-[#9A9994] pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search catalog by model, chassis code, or alias (e.g. 'Grande', 'E170', 'Reborn')..."
                  className="w-full h-14 rounded-sm border border-[#2A2C30] bg-[#141518] pl-12 pr-28 text-base text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#C9A227] focus:outline-none transition-colors font-body shadow-subtle"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="absolute right-2 h-10 px-5 font-mono text-xs font-semibold tracking-wider uppercase bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6]"
                >
                  SEARCH
                </Button>
              </div>
            </form>

            {/* Primary & Secondary Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg pt-1">
              <Link href="/cars" className="w-full">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="w-full font-display font-bold text-sm uppercase bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6] min-h-[44px]"
                >
                  <span>BUY A CAR</span>
                </Button>
              </Link>
              <Link href="/sell" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full font-display font-bold text-sm uppercase border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227]/10 min-h-[44px]"
                >
                  <span>SELL A CAR</span>
                </Button>
              </Link>
              <Link href="/cars" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full font-display text-xs uppercase border-[#2A2C30] text-[#EDEBE6] hover:border-[#4EBA8E] min-h-[44px]"
                >
                  <span>BROWSE CARS</span>
                </Button>
              </Link>
              <Link href="/compare" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="w-full font-display text-xs uppercase border-[#2A2C30] text-[#EDEBE6] hover:border-[#4EBA8E] min-h-[44px]"
                >
                  <span>COMPARE CARS</span>
                </Button>
              </Link>
            </div>

            {/* Typography-led Quick Discovery Strip */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#616266] block">
                FREQUENT RESEARCH QUERIES:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {brands.map((b) => (
                  <Link
                    key={b}
                    href={`/cars?brand=${encodeURIComponent(b)}`}
                    className="px-3 py-1.5 rounded-sm bg-[#141518] border border-[#2A2C30] hover:border-[#C9A227] text-xs font-mono font-medium text-[#EDEBE6] transition-colors inline-block"
                  >
                    {b}
                  </Link>
                ))}
                <Link
                  href="/cars?isLocallyAssembled=true"
                  className="px-3 py-1.5 rounded-sm bg-[#2F6B54]/15 border border-[#2F6B54]/40 hover:border-[#2F6B54] text-xs font-mono font-medium text-[#4EBA8E] transition-colors inline-block"
                >
                  • LOCAL CKD
                </Link>
                <Link
                  href="/cars?isLocallyAssembled=false"
                  className="px-3 py-1.5 rounded-sm bg-[#141518] border border-[#2A2C30] hover:border-[#C9A227] text-xs font-mono font-medium text-[#EDEBE6] transition-colors inline-block"
                >
                  • OFFICIAL CBU
                </Link>
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
              <Link
                href="/cars"
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group block"
              >
                <Compass className="h-4 w-4 text-[#C9A227] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Catalog
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  160 Variants
                </span>
              </Link>

              <Link
                href="/compare"
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group block"
              >
                <Scale className="h-4 w-4 text-[#2F6B54] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Compare
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  Side-by-Side
                </span>
              </Link>

              <Link
                href="/history"
                className="p-3 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-colors text-left group block"
              >
                <BookOpen className="h-4 w-4 text-[#C9A227] mb-1 group-hover:scale-110 transition-transform" />
                <span className="block font-display font-bold text-xs text-[#EDEBE6]">
                  Timeline
                </span>
                <span className="block font-mono text-[10px] text-[#9A9994]">
                  1950s–2020s
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
