"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Compass, MapPin, ArrowUpRight } from "lucide-react";

export interface EditorialBrandPageItem {
  id: string;
  name: string;
  slug: string;
  logoInitial: string;
  color: string;
  country: string;
  description: string;
  isPakistaniAssembled?: boolean;
  modelCount: number;
}

interface EditorialBrandIndexProps {
  brands: EditorialBrandPageItem[];
}

export function EditorialBrandIndex({ brands }: EditorialBrandIndexProps) {
  // Group brands alphabetically A–Z
  const groupedBrands = useMemo(() => {
    const map: { [key: string]: EditorialBrandPageItem[] } = {};
    const sorted = [...brands].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    sorted.forEach((b) => {
      const char = b.name.charAt(0).toUpperCase();
      if (!map[char]) map[char] = [];
      map[char].push(b);
    });
    return map;
  }, [brands]);

  const letters = Object.keys(groupedBrands).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 bg-[#0E0F11]">
      {/* Editorial Header */}
      <div className="border-b border-[#2A2C30] pb-8 mb-12 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
          <Compass className="h-3.5 w-3.5 text-[#C9A227]" />
          <span>36 MANUFACTURERS • TYPOGRAPHIC INDEX</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEBE6] tracking-tight">
          Manufacturer Directory
        </h1>
        <p className="text-base sm:text-lg text-[#9A9994] max-w-2xl font-mono">
          An alphabetical reference archive of all 36 manufacturers operating in
          Pakistan. Hover or tap to inspect assembly provenance, origin country,
          and model catalogs.
        </p>

        {/* Quick Letter Jump Navigation */}
        <div className="flex flex-wrap gap-1.5 pt-4">
          {letters.map((char) => (
            <a
              key={char}
              href={`#index-${char}`}
              className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#141518] border border-[#2A2C30] hover:border-[#C9A227] text-xs font-mono font-bold text-[#EDEBE6] transition-colors"
            >
              {char}
            </a>
          ))}
        </div>
      </div>

      {/* Typography-First A–Z Alphabetical Directory (Zero Card Box Clutter!) */}
      <div className="space-y-2">
        {letters.map((letter) => {
          const items = groupedBrands[letter];
          return (
            <div
              key={letter}
              id={`index-${letter}`}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#2A2C30] scroll-mt-24"
            >
              {/* Oversized Letter Anchor Column (MoMA Archive Style) */}
              <div className="md:col-span-2">
                <span className="font-display text-4xl sm:text-5xl font-bold text-[#C9A227] block leading-none">
                  {letter}
                </span>
                <span className="text-[10px] font-mono uppercase text-[#616266] block mt-1">
                  {items.length} {items.length === 1 ? "BRAND" : "BRANDS"}
                </span>
              </div>

              {/* Typographic Brand List Columns */}
              <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                {items.map((b) => {
                  // Determine synthetic years active in Pakistan based on brand slug/name
                  const getYearsActive = (name: string) => {
                    const n = name.toLowerCase();
                    if (n.includes("toyota")) return "EST. IN PK: 1989 (IMC)";
                    if (n.includes("honda")) return "EST. IN PK: 1993 (ATLAS)";
                    if (n.includes("suzuki")) return "EST. IN PK: 1983 (PAK SUZUKI)";
                    if (n.includes("kia")) return "EST. IN PK: 2018 (LUCKY MOTOR)";
                    if (n.includes("hyundai")) return "EST. IN PK: 2017 (NISHAT)";
                    if (n.includes("byd")) return "EST. IN PK: 2024 (MEGA CONGLOMERATE)";
                    if (n.includes("peugeot")) return "EST. IN PK: 2021 (LUCKY MOTOR)";
                    if (n.includes("mg")) return "EST. IN PK: 2020 (JW SEZ)";
                    if (n.includes("changan")) return "EST. IN PK: 2018 (MASTER)";
                    if (n.includes("haval")) return "EST. IN PK: 2021 (SAZGAR)";
                    return "EST. IN PK: HISTORICAL / CBU";
                  };

                  return (
                    <Link
                      key={b.id}
                      href={`/brands/${b.slug}`}
                      className="group flex flex-col justify-between py-2 border-l-2 border-[#2A2C30] pl-4 hover:border-[#C9A227] transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-xl text-[#EDEBE6] group-hover:text-[#C9A227] transition-colors flex items-center gap-1.5">
                            <span>{b.name.toUpperCase()}</span>
                            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A227]" />
                          </span>

                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-sm font-display font-bold text-xs"
                            style={{
                              backgroundColor: b.color || "#2F6B54",
                              color: "#EDEBE6",
                            }}
                          >
                            {b.logoInitial}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-[#9A9994]">
                          <span className="uppercase text-[#EDEBE6] font-semibold">
                            {b.country}
                          </span>
                          <span>•</span>
                          <span className="text-[#4EBA8E]">
                            {b.modelCount} {b.modelCount === 1 ? "MODEL" : "MODELS"}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-[#616266] uppercase">
                          {getYearsActive(b.name)}
                        </div>

                        <p className="text-xs font-mono text-[#9A9994] line-clamp-2 pt-1 leading-relaxed">
                          {b.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
