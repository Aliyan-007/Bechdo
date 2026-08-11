"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, ArrowUpRight } from "lucide-react";

export interface EditorialBrandItem {
  id: string;
  name: string;
  slug: string;
  logoInitial: string;
  color: string;
  country: string;
  modelCount: number;
}

interface EditorialBrandDirectoryProps {
  brands: EditorialBrandItem[];
}

export function EditorialBrandDirectory({
  brands,
}: EditorialBrandDirectoryProps) {
  // Sort brands alphabetically
  const sortedBrands = [...brands].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="py-16 border-b border-[#2A2C30] bg-[#0E0F11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <Compass className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>MANUFACTURER INDEX • TYPOGRAPHIC DIRECTORY</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6] tracking-tight">
              Brands &amp; Assemblers
            </h2>
            <p className="text-xs font-mono text-[#9A9994] max-w-lg">
              Explore {brands.length} verified manufacturers across Pakistani local assembly (CKD) and official import (CBU) channels.
            </p>
          </div>
          <Link
            href="/brands"
            className="text-xs font-mono uppercase tracking-widest text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1.5 group"
          >
            <span>ALL {brands.length} MANUFACTURER PROFILES</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Typographic Directory Table (Zero Card Box Clutter!) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-4">
          {sortedBrands.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.slug}`}
              className="group py-2.5 border-b border-[#2A2C30]/80 hover:border-[#C9A227] transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 truncate pr-2">
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-sm font-display font-bold text-xs shrink-0"
                  style={{
                    backgroundColor: b.color || "#2F6B54",
                    color: "#EDEBE6",
                  }}
                >
                  {b.logoInitial}
                </div>
                <div className="truncate">
                  <span className="font-display font-bold text-base text-[#EDEBE6] group-hover:text-[#C9A227] transition-colors block truncate leading-tight">
                    {b.name.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#9A9994] block mt-0.5">
                    {b.country} • {b.modelCount} {b.modelCount === 1 ? "MOD" : "MODS"}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#9A9994] group-hover:text-[#C9A227] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
