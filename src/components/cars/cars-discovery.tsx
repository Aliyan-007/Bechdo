"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Car,
  Compass,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { EditorialVehicleCard } from "@/components/editorial/EditorialVehicleCard";
import { PriceHistoryChart } from "@/components/vehicle/PriceHistoryChart";

export interface DiscoveryVehicle {
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
  images: { url: string; category: string }[];
  isFeatured: boolean;
  isPopular: boolean;
  isRecentlyAdded: boolean;
}

interface CarsDiscoveryProps {
  initialVehicles: DiscoveryVehicle[];
  allBrands: string[];
}

export function CarsDiscovery({
  initialVehicles,
  allBrands,
}: CarsDiscoveryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL params
  const qParam = searchParams.get("q") || "";
  const brandParam = searchParams.get("brand") || "";
  const bodyParam = searchParams.get("bodyType") || "";
  const fuelParam = searchParams.get("fuelType") || "";
  const transParam = searchParams.get("transmission") || "";
  const budgetParam = searchParams.get("budget") || "";
  const sortParam = searchParams.get("sort") || "popular";
  const favoritesParam = searchParams.get("favorites") === "true";
  const featuredParam = searchParams.get("featured") === "true";
  const popularParam = searchParams.get("popular") === "true";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 24;

  const [query, setQuery] = useState(qParam);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const priceChartPoints = useMemo(() => {
    const sample = initialVehicles.slice(0, 5);
    return sample.map((vehicle, idx) => ({
      label: `V${idx + 1}`,
      value: vehicle.priceMaxLakh || vehicle.priceMinLakh,
    }));
  }, [initialVehicles]);

  const bodyTypes = ["Sedan", "Hatchback", "SUV", "Crossover", "Pickup", "MPV"];
  const fuelTypes = ["Petrol", "Hybrid", "Electric"];
  const transmissions = ["CVT", "AT", "MT", "DCT", "AGS"];
  const priceBands = [
    { id: "under-40", label: "Under 40 Lakh", max: 40 },
    { id: "40-80", label: "40 – 80 Lakh", min: 40, max: 80 },
    { id: "80-120", label: "80 – 120 Lakh", min: 80, max: 120 },
    { id: "over-120", label: "120 Lakh+", min: 120 },
  ];

  const updateParam = (key: string, value: string, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (resetPage && key !== "page") {
      params.delete("page"); // reset to page 1 when filtering
    }
    router.push(`/cars?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/cars");
    setQuery("");
  };

  // Compute active filters
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; value: string }[] = [];
    if (brandParam) list.push({ key: "brand", label: `Brand: ${brandParam}`, value: brandParam });
    if (bodyParam) list.push({ key: "bodyType", label: `Body: ${bodyParam}`, value: bodyParam });
    if (fuelParam) list.push({ key: "fuelType", label: `Fuel: ${fuelParam}`, value: fuelParam });
    if (transParam) list.push({ key: "transmission", label: `Trans: ${transParam}`, value: transParam });
    if (budgetParam) {
      const b = priceBands.find((x) => x.id === budgetParam);
      list.push({ key: "budget", label: b ? b.label : budgetParam, value: budgetParam });
    }
    if (favoritesParam) list.push({ key: "favorites", label: "Saved Favorites", value: "true" });
    if (featuredParam) list.push({ key: "featured", label: "Spotlight Featured", value: "true" });
    if (popularParam) list.push({ key: "popular", label: "Highest Volume", value: "true" });
    if (qParam) list.push({ key: "q", label: `Search: "${qParam}"`, value: qParam });
    return list;
  }, [brandParam, bodyParam, fuelParam, transParam, budgetParam, favoritesParam, featuredParam, popularParam, qParam]);

  // Filter and Sort logic
  const filteredVehicles = useMemo(() => {
    let list = [...initialVehicles];

    // Search text
    if (qParam.trim()) {
      const lower = qParam.toLowerCase().trim();
      list = list.filter((v) => {
        const full = `${v.brand} ${v.model} ${v.variantName} ${v.bodyType} ${v.fuelType} ${v.engine}`.toLowerCase();
        return full.includes(lower);
      });
    }

    if (brandParam) {
      list = list.filter((v) => v.brand.toLowerCase() === brandParam.toLowerCase());
    }

    if (bodyParam) {
      list = list.filter((v) => v.bodyType.toLowerCase() === bodyParam.toLowerCase());
    }

    if (fuelParam) {
      list = list.filter((v) => v.fuelType.toLowerCase() === fuelParam.toLowerCase());
    }

    if (transParam) {
      list = list.filter((v) => v.transmission.toLowerCase().includes(transParam.toLowerCase()));
    }

    if (budgetParam) {
      const band = priceBands.find((x) => x.id === budgetParam);
      if (band) {
        list = list.filter((v) => {
          if (band.min && band.max) {
            return v.priceMinLakh <= band.max && v.priceMaxLakh >= band.min;
          } else if (band.max) {
            return v.priceMinLakh <= band.max;
          } else if (band.min) {
            return v.priceMaxLakh >= band.min;
          }
          return true;
        });
      }
    }

    if (favoritesParam) {
      try {
        const saved = localStorage.getItem("rasta-favorites");
        const favIds = saved ? JSON.parse(saved) : [];
        list = list.filter((v) => favIds.includes(v.id));
      } catch (e) {
        console.error(e);
      }
    }

    if (featuredParam) {
      list = list.filter((v) => v.isFeatured);
    }

    if (popularParam) {
      list = list.filter((v) => v.isPopular);
    }

    // Sort
    if (sortParam === "price-asc") {
      list.sort((a, b) => a.priceMinLakh - b.priceMinLakh);
    } else if (sortParam === "price-desc") {
      list.sort((a, b) => b.priceMinLakh - a.priceMinLakh);
    } else if (sortParam === "power-desc") {
      list.sort((a, b) => b.powerHp - a.powerHp);
    } else {
      // default popular
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    return list;
  }, [initialVehicles, qParam, brandParam, bodyParam, fuelParam, transParam, budgetParam, favoritesParam, featuredParam, popularParam, sortParam]);

  // Pagination slicing
  const totalCount = filteredVehicles.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalCount);
  const paginatedVehicles = filteredVehicles.slice(startIdx, endIdx);

  const handlePageChange = (newPage: number) => {
    updateParam("page", newPage.toString(), false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Brand */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Manufacturer ({allBrands.length})
        </label>
        <select
          value={brandParam}
          onChange={(e) => updateParam("brand", e.target.value)}
          className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#2F6B54] focus:outline-none"
        >
          <option value="">All Brands</option>
          {allBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Body Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {bodyTypes.map((type) => {
            const isSelected = bodyParam === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  updateParam("bodyType", isSelected ? "" : type)
                }
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C]"
                    : "bg-[#17181B] text-[#9A9994] border-[#2A2C30] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Fuel Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {fuelTypes.map((type) => {
            const isSelected = fuelParam === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() =>
                  updateParam("fuelType", isSelected ? "" : type)
                }
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C]"
                    : "bg-[#17181B] text-[#9A9994] border-[#2A2C30] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Band */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Price Band (PKR)
        </label>
        <div className="flex flex-col gap-1.5">
          {priceBands.map((band) => {
            const isSelected = budgetParam === band.id;
            return (
              <button
                key={band.id}
                type="button"
                onClick={() =>
                  updateParam("budget", isSelected ? "" : band.id)
                }
                className={`px-3 py-2 rounded-sm text-xs font-medium border text-left transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-[#C9A227]/20 text-[#C9A227] border-[#C9A227]/50 font-semibold"
                    : "bg-[#17181B] text-[#9A9994] border-[#2A2C30] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
              >
                <span>{band.label}</span>
                {isSelected && <span className="text-[10px]">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Transmission
        </label>
        <div className="flex flex-wrap gap-1.5">
          {transmissions.map((t) => {
            const isSelected = transParam.toUpperCase() === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() =>
                  updateParam("transmission", isSelected ? "" : t)
                }
                className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C]"
                    : "bg-[#17181B] text-[#9A9994] border-[#2A2C30] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="pt-2 border-t border-[#2A2C30]">
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="w-full text-xs text-[#B24A3C] hover:text-[#E37A6D] hover:border-[#B24A3C]"
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2C30] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F6B54]">
            <Compass className="h-3.5 w-3.5" />
            <span>Automotive Catalog ({totalCount} verified variants)</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6]">
            Vehicle Discovery
          </h1>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParam("q", query.trim());
            }}
            className="relative flex-1 sm:w-64"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9A9994]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search car or trim..."
              className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#17181B] pl-9 pr-8 text-sm text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#2F6B54] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  updateParam("q", "");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#9A9994] hover:text-[#EDEBE6]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          <Button
            variant="outline"
            size="md"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden gap-1.5 shrink-0"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2F6B54] text-xs font-bold text-[#EDEBE6]">
                {activeFilters.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-[#EDEBE6]">
              Market Snapshot
            </h2>
            <p className="text-sm font-mono leading-relaxed text-[#9A9994]">
              An at-a-glance view of current ex-factory price levels across verified catalog variants.
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-sm bg-[#2A2C30] px-3 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[#9A9994]">
              Catalog price trend
            </span>
          </div>
        </div>
        <div className="mt-6">
          <PriceHistoryChart points={priceChartPoints} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 rounded-md border border-[#2A2C30] bg-[#141518] p-5">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#2A2C30]">
            <span className="font-display font-bold text-base text-[#EDEBE6] flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#2F6B54]" />
              <span>Filters</span>
            </span>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#E6C86E] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          {renderFilterControls()}
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filters & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md border border-[#2A2C30] bg-[#141518]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#9A9994] font-mono">
                Showing{" "}
                <strong className="text-[#EDEBE6]">
                  {totalCount === 0 ? 0 : startIdx + 1}–{endIdx}
                </strong>{" "}
                of {totalCount} variants
              </span>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 ml-2 border-l border-[#2A2C30] pl-2">
                  <span className="text-xs text-[#616266]">
                    ({activeFilters.length} applied):
                  </span>
                  {activeFilters.map((af) => (
                    <Badge
                      key={af.key}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-[#2A2C30]"
                      onClick={() => updateParam(af.key, "")}
                    >
                      <span>{af.label}</span>
                      <X className="h-3 w-3 text-[#9A9994] hover:text-[#EDEBE6]" />
                    </Badge>
                  ))}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#B24A3C] hover:underline ml-1 font-semibold"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Sort and View Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-[#9A9994]" />
                <select
                  value={sortParam}
                  onChange={(e) => updateParam("sort", e.target.value)}
                  className="h-9 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-2.5 text-xs text-[#EDEBE6] focus:border-[#2F6B54] focus:outline-none"
                >
                  <option value="popular">Sort by: Popularity</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="power-desc">Horsepower: High to Low</option>
                </select>
              </div>

              <div className="flex items-center border border-[#2A2C30] rounded-sm bg-[#0E0F11] p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-[#2F6B54] text-[#EDEBE6]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-[#2F6B54] text-[#EDEBE6]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Grid / List */}
          {paginatedVehicles.length === 0 ? (
            <div className="rounded-md border border-[#2A2C30] bg-[#141518] p-12 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-[#1F2023] flex items-center justify-center text-[#C9A227]">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#EDEBE6]">
                No vehicles match your criteria
              </h3>
              <p className="text-sm text-[#9A9994] max-w-md mx-auto">
                Try removing some filters, checking your budget range, or
                searching for a broader body type.
              </p>
              <Button variant="primary" size="md" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedVehicles.map((v) => (
                <EditorialVehicleCard key={v.id} vehicle={v} variant="standard" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedVehicles.map((v) => (
                <EditorialVehicleCard key={v.id} vehicle={v} variant="horizontal" />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#2A2C30]">
              <span className="text-xs text-[#9A9994] font-mono">
                Page <strong className="text-[#EDEBE6]">{currentPage}</strong> of{" "}
                <strong className="text-[#EDEBE6]">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </Button>

                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - currentPage) <= 1
                  )
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-xs text-[#616266] px-1">...</span>
                      )}
                      <Button
                        variant={p === currentPage ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(p)}
                        className="text-xs w-8 p-0"
                      >
                        {p}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="gap-1 text-xs"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sheet Filter Drawer */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-[#2A2C30]">
            <SheetTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#2F6B54]" />
                <span>Filter Vehicles</span>
              </span>
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#E6C86E]"
                >
                  Clear all
                </button>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">{renderFilterControls()}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
