"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function EditorialFooter() {
  const currentYear = 2026;

  const bodyTypes = [
    { name: "Sedan", href: "/cars?bodyType=Sedan" },
    { name: "Hatchback", href: "/cars?bodyType=Hatchback" },
    { name: "SUV", href: "/cars?bodyType=SUV" },
    { name: "Crossover", href: "/cars?bodyType=Crossover" },
    { name: "Pickup", href: "/cars?bodyType=Pickup" },
    { name: "MPV", href: "/cars?bodyType=MPV" },
  ];

  const popularBrands = [
    { name: "Toyota", href: "/brands/toyota" },
    { name: "Honda", href: "/brands/honda" },
    { name: "Suzuki", href: "/brands/suzuki" },
    { name: "Kia", href: "/brands/kia" },
    { name: "Hyundai", href: "/brands/hyundai" },
    { name: "BYD", href: "/brands/byd" },
    { name: "Peugeot", href: "/brands/peugeot" },
    { name: "MG", href: "/brands/mg" },
  ];

  return (
    <footer className="w-full border-t border-[#2A2C30] bg-[#0E0F11] text-[#EDEBE6] pt-14 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#2A2C30]">
          {/* Editorial Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#2F6B54] text-[#EDEBE6] font-display font-bold text-xl">
                R
              </div>
              <span className="font-display font-bold text-xl tracking-wider">
                RASTA
              </span>
            </Link>
            <p className="text-xs font-mono text-[#9A9994] max-w-sm leading-relaxed">
              160 verified variants • 36 manufacturers • 8 decades of history.
              Pakistan&rsquo;s authoritative automotive publication and reference
              archive.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#616266]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#2F6B54]" />
              <span>LIVE PRODUCTION CATALOG — KARACHI, PK</span>
            </div>
          </div>

          {/* Body Types */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              BODY TYPES
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#9A9994]">
              {bodyTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    href={type.href}
                    className="hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
                  >
                    <span>{type.name.toUpperCase()}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2F6B54]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              MANUFACTURERS
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#9A9994]">
              {popularBrands.map((brand) => (
                <li key={brand.name}>
                  <Link
                    href={brand.href}
                    className="hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
                  >
                    <span>{brand.name.toUpperCase()}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2F6B54]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Editorial Index Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              INDEX
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[#9A9994]">
              <li>
                <Link
                  href="/cars"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  CARS
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  BRANDS (36)
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  COMPARE
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  HISTORY
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#616266] gap-4">
          <p>
            © {currentYear} RASTA Automotive Pakistan. All rights reserved.
            Ex-factory prices indicative and subject to change without notice by
            local assemblers.
          </p>
          <div className="flex items-center gap-4">
            <span>IMC</span>
            <span>•</span>
            <span>HONDA ATLAS</span>
            <span>•</span>
            <span>PAK SUZUKI</span>
            <span>•</span>
            <span>LUCKY MOTOR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
