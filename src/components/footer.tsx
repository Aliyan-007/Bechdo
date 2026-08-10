"use client";

import React from "react";
import Link from "next/link";
import { Compass, Car, History, ShieldAlert, Scale, ArrowUpRight } from "lucide-react";

export function Footer() {
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
    { name: "MG", href: "/brands/mg" },
    { name: "Haval", href: "/brands/haval" },
    { name: "Changan", href: "/brands/changan" },
  ];

  return (
    <footer className="w-full border-t border-[#2A2C30] bg-[#0E0F11] text-[#EDEBE6] pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#2A2C30]">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#2F6B54] text-[#EDEBE6] font-display font-bold text-xl">
                R
              </div>
              <span className="font-display font-bold text-xl tracking-wider">
                RASTA
              </span>
            </Link>
            <p className="text-sm text-[#9A9994] max-w-sm leading-relaxed">
              Pakistan&rsquo;s definitive automotive intelligence, discovery, and
              comparison platform. Tracking 70+ models across 26 manufacturers
              with verified ex-factory pricing, specifications, and historical
              data.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#616266]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#2F6B54] animate-pulse" />
              <span>LIVE PRODUCTION DATASET — KARACHI, PK</span>
            </div>
          </div>

          {/* Body Types */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#C9A227]">
              Browse Body Types
            </h4>
            <ul className="space-y-2 text-sm text-[#9A9994]">
              {bodyTypes.map((type) => (
                <li key={type.name}>
                  <Link
                    href={type.href}
                    className="hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
                  >
                    <span>{type.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2F6B54]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#C9A227]">
              Manufacturers
            </h4>
            <ul className="space-y-2 text-sm text-[#9A9994]">
              {popularBrands.map((brand) => (
                <li key={brand.name}>
                  <Link
                    href={brand.href}
                    className="hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
                  >
                    <span>{brand.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#2F6B54]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-[#C9A227]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#9A9994]">
              <li>
                <Link
                  href="/cars"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  Cars Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  All 26 Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  Compare Vehicles
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="hover:text-[#EDEBE6] transition-colors block"
                >
                  History Timeline
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#616266] gap-4">
          <p>
            © {currentYear} RASTA Automotive Pakistan. All rights reserved. Ex-factory
            prices indicative and subject to change without notice by local
            assemblers.
          </p>
          <div className="flex items-center gap-4">
            <span>Indus Motor Co.</span>
            <span>•</span>
            <span>Honda Atlas</span>
            <span>•</span>
            <span>Pak Suzuki</span>
            <span>•</span>
            <span>Lucky Motor Corp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
