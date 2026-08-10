"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Car, DollarSign, Layers, ArrowRight, ShieldCheck, TrendingUp, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSearchProps {
  totalVehicles: number;
  totalBrands: number;
}

export function HeroSearch({ totalVehicles, totalBrands }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"brand" | "body" | "budget">("brand");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBody, setSelectedBody] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  const brands = [
    "Toyota",
    "Honda",
    "Suzuki",
    "Kia",
    "Hyundai",
    "BYD",
    "Peugeot",
    "MG",
    "Haval",
    "Changan",
  ];

  const bodyTypes = [
    "Sedan",
    "SUV",
    "Hatchback",
    "Crossover",
    "MPV",
    "Pickup",
  ];

  const budgets = [
    { label: "Under 40 Lakh", value: "under-40" },
    { label: "40 – 80 Lakh", value: "40-80" },
    { label: "80 – 120 Lakh", value: "80-120" },
    { label: "120 Lakh & Above", value: "over-120" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cars?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchTab === "brand" && selectedBrand) {
      params.set("brand", selectedBrand);
    } else if (searchTab === "body" && selectedBody) {
      params.set("bodyType", selectedBody);
    } else if (searchTab === "budget" && selectedBudget) {
      params.set("budget", selectedBudget);
    }

    router.push(`/cars?${params.toString()}`);
  };

  const handleQuickBrandClick = (brandName: string) => {
    router.push(`/cars?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-[#2A2C30] bg-[#0E0F11] pt-12 pb-14 sm:pt-16 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Editorial Hero Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-sm border border-[#2F6B54]/40 bg-[#2F6B54]/15 px-2.5 py-1 text-xs font-mono text-[#4EBA8E]">
              <span className="h-2 w-2 rounded-full bg-[#2F6B54]" />
              <span>RASTA — PAKISTAN AUTOMOTIVE ARCHIVE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EDEBE6] leading-[1.08]">
              Pakistan&rsquo;s Automotive Archive
            </h1>

            <p className="text-base sm:text-lg text-[#9A9994] max-w-xl font-mono">
              {totalVehicles} verified variants • {totalBrands} manufacturers • 8 decades of history
            </p>

            {/* Primary Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9A9994]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cars, brands, aliases (e.g. 'Grande', 'Reborn', 'BYD')..."
                className="w-full h-12 rounded-sm border border-[#2A2C30] bg-[#17181B] pl-11 pr-28 text-base text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#2F6B54] focus:outline-none transition-colors"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="absolute right-1.5 top-1.5 h-9 px-4 font-semibold"
              >
                Search
              </Button>
            </form>

            {/* Popular Brand Pills */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono uppercase text-[#616266] block">
                Popular in Pakistan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["Toyota", "Honda", "Suzuki", "Kia", "Hyundai", "BYD", "Peugeot", "MG"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleQuickBrandClick(b)}
                    className="px-3 py-1.5 rounded-sm bg-[#17181B] border border-[#2A2C30] hover:border-[#3E8A6C] text-xs font-medium text-[#EDEBE6] transition-colors"
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Compact Discovery Filter */}
          <div className="lg:col-span-5">
            <div className="rounded-md border border-[#2A2C30] bg-[#17181B] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#2A2C30] pb-3">
                <h3 className="font-display text-base font-bold text-[#EDEBE6]">
                  Filter Database
                </h3>
                <span className="text-xs font-mono text-[#9A9994] uppercase">
                  CKD • CBU • HISTORICAL
                </span>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-[#0E0F11] p-1 rounded-sm border border-[#2A2C30] text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSearchTab("brand")}
                  className={`py-2 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                    searchTab === "brand"
                      ? "bg-[#2F6B54] text-[#EDEBE6]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                >
                  <Car className="h-3.5 w-3.5" />
                  <span>By Brand</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("body")}
                  className={`py-2 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                    searchTab === "body"
                      ? "bg-[#2F6B54] text-[#EDEBE6]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>By Body</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTab("budget")}
                  className={`py-2 rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                    searchTab === "budget"
                      ? "bg-[#2F6B54] text-[#EDEBE6]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                >
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>By Budget</span>
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleFilterSubmit} className="space-y-4">
                {searchTab === "brand" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994] block">
                      MANUFACTURER
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#2F6B54] focus:outline-none"
                    >
                      <option value="">All 36 Manufacturers</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {searchTab === "body" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994] block">
                      BODY TYPE
                    </label>
                    <select
                      value={selectedBody}
                      onChange={(e) => setSelectedBody(e.target.value)}
                      className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#2F6B54] focus:outline-none"
                    >
                      <option value="">All Body Types</option>
                      {bodyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {searchTab === "budget" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994] block">
                      PRICE BAND (EX-FACTORY)
                    </label>
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#2F6B54] focus:outline-none"
                    >
                      <option value="">Any Budget</option>
                      {budgets.map((b) => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-10 gap-2 font-semibold"
                >
                  <span>Filter Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
