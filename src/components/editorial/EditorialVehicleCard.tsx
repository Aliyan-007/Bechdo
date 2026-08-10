"use client";

import React from "react";
import Link from "next/link";
import { Heart, Scale, Zap, Gauge, Users, Fuel, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPriceRange } from "@/lib/utils";
import { getVehicleImageUrl } from "@/lib/images";
import { useCompare } from "@/components/compare-provider";
import { useFavorites } from "@/components/favorites-provider";

export interface EditorialVehicleCardProps {
  vehicle: {
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
    colors?: string[];
    images?: { url: string; category: string }[];
  };
  variant?: "standard" | "compact" | "featured" | "horizontal";
  brandColor?: string;
}

export function EditorialVehicleCard({
  vehicle,
  variant = "standard",
  brandColor = "#2F6B54",
}: EditorialVehicleCardProps) {
  const { isCompared, toggleCompare } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();

  const compared = isCompared(vehicle.id);
  const favorited = isFavorite(vehicle.id);

  const rawImg =
    vehicle.images?.find((img) => img.category === "exterior") ||
    vehicle.images?.[0] ||
    null;
  const primaryImage = getVehicleImageUrl(
    rawImg,
    vehicle.brand,
    vehicle.model,
    brandColor,
    "exterior"
  );
  const isPlaceholder = primaryImage.startsWith("data:");

  const href = `/cars/${vehicle.brand.toLowerCase()}/${vehicle.model.toLowerCase()}/${vehicle.id}`;

  if (variant === "compact") {
    return (
      <div className="group relative flex flex-col rounded-sm border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-200 hover:border-[#3E8A6C]">
        <Link href={href} className="block aspect-[16/10] overflow-hidden bg-[#0E0F11] relative">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#616266] font-mono text-xs">
              NO IMAGE
            </div>
          )}
          {isPlaceholder && (
            <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#9A9994] flex items-center gap-1">
              <ImageIcon className="h-2.5 w-2.5" />
              <span>Illustrative placeholder</span>
            </div>
          )}
        </Link>
        <div className="flex flex-col p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#9A9994] uppercase tracking-wider">
              {vehicle.brand}
            </span>
            {vehicle.badge && (
              <Badge variant={vehicle.badge === "New" ? "new" : "default"} className="text-[10px]">
                {vehicle.badge}
              </Badge>
            )}
          </div>
          <Link
            href={href}
            className="font-display text-base font-semibold text-[#EDEBE6] hover:text-[#E6C86E] transition-colors truncate block"
          >
            {vehicle.model}{" "}
            <span className="text-[#9A9994] font-normal">
              {vehicle.variantName}
            </span>
          </Link>
          <div className="font-mono-num text-sm font-semibold text-[#C9A227]">
            {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
          </div>
          <div className="flex items-center gap-2 pt-1.5 text-xs text-[#9A9994] font-mono-num border-t border-[#2A2C30]/50">
            <span>{vehicle.engine}</span>
            <span>•</span>
            <span>{vehicle.transmission}</span>
            <span>•</span>
            <span>{vehicle.bodyType}</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="group relative flex flex-col sm:flex-row rounded-sm border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-200 hover:border-[#3E8A6C]">
        <Link
          href={href}
          className="sm:w-64 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden bg-[#0E0F11] relative"
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#616266] font-mono text-xs">
              NO IMAGE
            </div>
          )}
          {isPlaceholder && (
            <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#9A9994] flex items-center gap-1">
              <ImageIcon className="h-2.5 w-2.5" />
              <span>Illustrative placeholder</span>
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-between p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#9A9994] uppercase tracking-wider">
                  {vehicle.brand}
                </span>
                <Badge variant="outline" className="text-[10px]">{vehicle.bodyType}</Badge>
                {vehicle.badge && (
                  <Badge variant={vehicle.badge === "New" ? "new" : "default"} className="text-[10px]">
                    {vehicle.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCompare(vehicle);
                  }}
                  className={`p-2.5 rounded-sm border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    compared
                      ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10"
                      : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#C9A227]"
                  }`}
                  aria-label="Toggle compare"
                  title="Add vehicle to comparison"
                >
                  <Scale className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Link
              href={href}
              className="font-display text-xl font-bold text-[#EDEBE6] hover:text-[#E6C86E] transition-colors block"
            >
              {vehicle.model}{" "}
              <span className="text-[#9A9994] font-normal text-lg">
                {vehicle.variantName}
              </span>
            </Link>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs text-[#9A9994] font-mono-num">
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2.5 py-1 rounded-sm">
                <Zap className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>{vehicle.engine}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2.5 py-1 rounded-sm">
                <Gauge className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>
                  {vehicle.powerHp} HP • {vehicle.torqueNm} Nm
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2.5 py-1 rounded-sm">
                <Users className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>
                  {vehicle.seating} Seats • {vehicle.transmission}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2.5 py-1 rounded-sm">
                <Fuel className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>{vehicle.fuelType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#2A2C30]/50">
            <div>
              <span className="text-xs font-mono text-[#616266] uppercase block">
                EX-FACTORY PRICE RANGE
              </span>
              <span className="font-mono-num text-lg font-bold text-[#C9A227]">
                {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
              </span>
            </div>
            <Link href={href}>
              <Button variant="outline" size="sm">
                View Full Specs →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="group relative flex flex-col rounded-sm border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-300 hover:border-[#3E8A6C]">
        <Link
          href={href}
          className="block aspect-[16/9] overflow-hidden bg-[#0E0F11] relative"
        >
          {primaryImage && (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="default" className="uppercase font-semibold">
              {vehicle.brand}
            </Badge>
            {vehicle.badge && (
              <Badge variant={vehicle.badge === "New" ? "new" : "accent"}>
                {vehicle.badge}
              </Badge>
            )}
          </div>
          {isPlaceholder && (
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-[#9A9994] flex items-center gap-1 border border-[#2A2C30]">
              <ImageIcon className="h-3 w-3" />
              <span>Illustrative placeholder</span>
            </div>
          )}
        </Link>
        <div className="flex flex-col p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Link
                href={href}
                className="font-display text-2xl font-bold text-[#EDEBE6] hover:text-[#E6C86E] transition-colors block"
              >
                {vehicle.model}
              </Link>
              <span className="text-sm text-[#9A9994]">
                {vehicle.variantName} • {vehicle.bodyType}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#616266] block uppercase">
                PRICE
              </span>
              <span className="font-mono-num text-lg font-bold text-[#C9A227]">
                {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#2A2C30] font-mono-num text-xs text-[#9A9994]">
            <div className="flex flex-col items-center justify-center p-2.5 bg-[#1F2023] rounded-sm">
              <span className="text-[#616266] uppercase text-[10px]">
                Engine
              </span>
              <span className="font-semibold text-[#EDEBE6]">
                {vehicle.engine}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 bg-[#1F2023] rounded-sm">
              <span className="text-[#616266] uppercase text-[10px]">
                Power
              </span>
              <span className="font-semibold text-[#EDEBE6]">
                {vehicle.powerHp} HP
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2.5 bg-[#1F2023] rounded-sm">
              <span className="text-[#616266] uppercase text-[10px]">
                Trans
              </span>
              <span className="font-semibold text-[#EDEBE6]">
                {vehicle.transmission}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleCompare(vehicle)}
                className={`p-2.5 rounded-sm border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  compared
                    ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10"
                    : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#C9A227]"
                }`}
                aria-label="Toggle compare"
                title="Add vehicle to comparison"
              >
                <Scale className="h-4 w-4" />
              </button>
            </div>
            <Link href={href}>
              <Button variant="primary" size="sm">
                Explore Variants &amp; Specs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD VARIANT (Editorial Publication Plate — Zero Boxy Card Borders)
  return (
    <div className="group relative flex flex-col justify-between border-b border-[#2A2C30] pb-6 bg-transparent transition-all duration-200">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#141518] rounded-sm mb-4">
        <Link href={href} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[#616266] font-mono text-xs">
              NO IMAGE
            </div>
          )}
          {isPlaceholder && (
            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-[#9A9994] flex items-center gap-1">
              <ImageIcon className="h-2.5 w-2.5" />
              <span>Illustrative placeholder</span>
            </div>
          )}
        </Link>
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="uppercase font-semibold text-[10px] bg-[#0E0F11]/90 border border-[#2A2C30] text-[#EDEBE6]"
          >
            {vehicle.brand}
          </Badge>
          {vehicle.badge && (
            <Badge
              variant={
                vehicle.badge === "New"
                  ? "new"
                  : vehicle.badge === "EV"
                  ? "ev"
                  : "default"
              }
              className="text-[10px]"
            >
              {vehicle.badge}
            </Badge>
          )}
        </div>
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(vehicle);
            }}
            className={`p-2 rounded-sm backdrop-blur-md border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              compared
                ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/20"
                : "border-[#2A2C30] text-[#EDEBE6] bg-black/60 hover:bg-black/80 hover:border-[#C9A227]"
            }`}
            aria-label="Toggle compare"
            title="Add vehicle to comparison"
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <Link
            href={href}
            className="font-display text-xl font-bold text-[#EDEBE6] hover:text-[#C9A227] transition-colors block leading-tight truncate"
          >
            {vehicle.model}
          </Link>
          <p className="text-xs font-mono text-[#9A9994] truncate">
            {vehicle.variantName} • {vehicle.bodyType}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-1 font-mono-num text-xs text-[#9A9994]">
          <span className="text-[#EDEBE6] font-semibold">{vehicle.engine}</span>
          <span>•</span>
          <span>{vehicle.powerHp} HP</span>
          <span>•</span>
          <span>{vehicle.transmission}</span>
          <span>•</span>
          <span>{vehicle.fuelType}</span>
        </div>

        <div className="flex items-end justify-between pt-2">
          <div>
            <span className="text-[10px] font-mono text-[#616266] uppercase block leading-none mb-1">
              EX-FACTORY PRICE
            </span>
            <span className="font-mono-num text-base font-bold text-[#C9A227]">
              {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
            </span>
          </div>
          <Link
            href={href}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-[#EDEBE6] hover:text-[#C9A227] transition-colors flex items-center gap-1"
          >
            <span>ARCHIVE SPEC →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
