"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Car, Zap, History, Compass } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { formatPriceRange } from "@/lib/utils";

interface SearchVehicle {
  id: string;
  brand: string;
  model: string;
  variantName: string;
  bodyType: string;
  fuelType: string;
  priceMinLakh: number;
  priceMaxLakh: number;
  badge: string | null;
  aliases?: string[];
  image?: string | null;
}

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: SearchVehicle[];
}

export function GlobalSearchModal({
  open,
  onOpenChange,
  vehicles,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rasta-recent-searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addRecent = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((item) => item !== q)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("rasta-recent-searches", JSON.stringify(updated));
  };

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const filtered = vehicles.filter((v) => {
      const aliasText = (v.aliases || []).join(" ").toLowerCase();
      const full = `${v.brand} ${v.model} ${v.variantName} ${v.bodyType} ${v.fuelType} ${aliasText}`.toLowerCase();
      if (full.includes(q)) return true;
      const tokens = q.split(/\s+/);
      return tokens.every((t) => full.includes(t));
    });

    return filtered
      .sort((a, b) => {
        const aIsExact =
          a.model.toLowerCase() === q || a.brand.toLowerCase() === q ? 1 : 0;
        const bIsExact =
          b.model.toLowerCase() === q || b.brand.toLowerCase() === q ? 1 : 0;
        if (aIsExact !== bIsExact) return bIsExact - aIsExact;
        if (a.model === "Corolla" && b.model !== "Corolla") return -1;
        if (b.model === "Corolla" && a.model !== "Corolla") return 1;
        return a.brand.localeCompare(b.brand);
      })
      .slice(0, 8);
  }, [query, vehicles]);

  const handleSelect = (v: SearchVehicle) => {
    addRecent(`${v.brand} ${v.model}`);
    onOpenChange(false);
    router.push(
      `/cars/${v.brand.toLowerCase()}/${v.model.toLowerCase()}/${v.id}`
    );
  };

  const handleSearchAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecent(query.trim());
      onOpenChange(false);
      router.push(`/cars?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleChipClick = (chip: string) => {
    setQuery(chip);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-[#3E8A6C]">
        <DialogHeader className="p-4 border-b border-[#2A2C30] pb-3">
          <DialogTitle className="flex items-center gap-2 text-sm text-[#9A9994] font-mono uppercase">
            <Compass className="h-4 w-4 text-[#2F6B54]" />
            <span>Automotive Intelligence Command Search</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSearchAll} className="flex items-center px-4 py-3 bg-[#0E0F11]">
          <Search className="h-5 w-5 text-[#9A9994] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Brand, Model, Body Type, or Budget (e.g. 'Corolla', 'Hybrid', 'SUV', 'Under 50L')..."
            className="w-full bg-transparent text-base text-[#EDEBE6] placeholder:text-[#616266] focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-[#9A9994] hover:text-[#EDEBE6]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query.trim() && (
            <>
              {/* Popular Searches */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#616266] uppercase tracking-wider block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Toyota Corolla",
                    "Honda Civic",
                    "Kia Sportage",
                    "Hybrid Cars",
                    "Under 50 Lakh",
                    "MG 4 EV",
                    "7 Seater SUV",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-1.5 rounded-sm bg-[#1F2023] border border-[#2A2C30] hover:border-[#3E8A6C] text-xs text-[#EDEBE6] transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#2A2C30]">
                  <span className="text-xs font-semibold text-[#616266] uppercase tracking-wider block flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" />
                    <span>Recent Searches</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((rec) => (
                      <button
                        key={rec}
                        onClick={() => handleChipClick(rec)}
                        className="px-3 py-1.5 rounded-sm bg-[#17181B] border border-[#2A2C30] hover:border-[#3E8A6C] text-xs text-[#9A9994] hover:text-[#EDEBE6] transition-colors"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Search Results */}
          {query.trim() && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#616266] uppercase tracking-wider">
                  Matches ({results.length})
                </span>
                <button
                  onClick={handleSearchAll}
                  className="text-xs text-[#2F6B54] hover:text-[#3E8A6C] font-semibold flex items-center gap-1"
                >
                  <span>See all results in catalog</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              {results.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#9A9994]">
                  No exact vehicles found for "{query}". Try searching a brand
                  name like "Toyota" or body type like "SUV".
                </div>
              ) : (
                <div className="divide-y divide-[#2A2C30]">
                  {results.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleSelect(v)}
                      className="flex items-center justify-between py-3 px-2 hover:bg-[#1F2023] rounded-sm cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-16 rounded-sm bg-[#1F2023] border border-[#2A2C30] overflow-hidden flex items-center justify-center shrink-0">
                          {v.image ? (
                            <img
                              src={v.image}
                              alt={`${v.brand} ${v.model}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] font-mono font-bold text-[#E6C86E]">
                              {v.brand.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-display font-semibold text-[#EDEBE6]">
                            {v.brand} {v.model}{" "}
                            <span className="text-sm font-normal text-[#9A9994]">
                              {v.variantName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#9A9994]">
                            <span>{v.bodyType}</span>
                            <span>•</span>
                            <span>{v.fuelType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono-num text-sm font-bold text-[#C9A227]">
                          {formatPriceRange(v.priceMinLakh, v.priceMaxLakh)}
                        </div>
                        {v.badge && (
                          <Badge variant="outline" className="text-[10px]">
                            {v.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-[#0E0F11] border-t border-[#2A2C30] flex items-center justify-between text-xs text-[#616266] font-mono">
          <span>Press ENTER to search full catalog</span>
          <span>ESC to close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
