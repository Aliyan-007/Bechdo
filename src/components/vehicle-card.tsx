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

export interface VehicleCardProps {
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

export function VehicleCard({
  vehicle,
  variant = "standard",
  brandColor = "#2F6B54",
}: VehicleCardProps) {
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
      <div className="group relative flex flex-col rounded-md border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-200 hover:border-[#3E8A6C] hover:shadow-medium">
        <Link href={href} className="block aspect-[16/10] overflow-hidden bg-[#0E0F11] relative">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="flex flex-col p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9A9994] uppercase tracking-wider">
              {vehicle.brand}
            </span>
            {vehicle.badge && (
              <Badge variant={vehicle.badge === "New" ? "new" : "default"}>
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
          <div className="flex items-center gap-2 pt-1 text-xs text-[#9A9994] font-mono-num border-t border-[#2A2C30]/50">
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
      <div className="group relative flex flex-col sm:flex-row rounded-md border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-200 hover:border-[#3E8A6C] hover:shadow-medium">
        <Link
          href={href}
          className="sm:w-64 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden bg-[#0E0F11] relative"
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#9A9994] uppercase tracking-wider">
                  {vehicle.brand}
                </span>
                <Badge variant="outline">{vehicle.bodyType}</Badge>
                {vehicle.badge && (
                  <Badge variant={vehicle.badge === "New" ? "new" : "default"}>
                    {vehicle.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(vehicle.id);
                  }}
                  className={`p-1.5 rounded-sm border transition-colors ${
                    favorited
                      ? "border-[#B24A3C] text-[#B24A3C] bg-[#B24A3C]/10"
                      : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Heart
                    className="h-4 w-4"
                    fill={favorited ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleCompare(vehicle);
                  }}
                  className={`p-1.5 rounded-sm border transition-colors ${
                    compared
                      ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10"
                      : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                  }`}
                  aria-label="Toggle compare"
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
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2 py-1 rounded-sm">
                <Zap className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>{vehicle.engine}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2 py-1 rounded-sm">
                <Gauge className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>
                  {vehicle.powerHp} HP • {vehicle.torqueNm} Nm
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2 py-1 rounded-sm">
                <Users className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>
                  {vehicle.seating} Seats • {vehicle.transmission}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#1F2023] px-2 py-1 rounded-sm">
                <Fuel className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>{vehicle.fuelType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#2A2C30]/50">
            <div>
              <span className="text-xs text-[#616266] uppercase block">
                Ex-Factory Price Range
              </span>
              <span className="font-mono-num text-lg font-bold text-[#C9A227]">
                {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
              </span>
            </div>
            <Link href={href}>
              <Button variant="outline" size="sm">
                View Full Specs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div className="group relative flex flex-col rounded-lg border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-300 hover:border-[#3E8A6C] hover:shadow-elevated">
        <Link
          href={href}
          className="block aspect-[16/9] overflow-hidden bg-[#0E0F11] relative"
        >
          {primaryImage && (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
            <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-mono text-[#9A9994] flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              <span>Illustrative placeholder</span>
            </div>
          )}
        </Link>
        <div className="flex flex-col p-5 space-y-4">
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
              <span className="text-xs text-[#616266] block uppercase">
                Price
              </span>
              <span className="font-mono-num text-lg font-bold text-[#C9A227]">
                {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#2A2C30] font-mono-num text-xs text-[#9A9994]">
            <div className="flex flex-col items-center justify-center p-2 bg-[#1F2023] rounded-sm">
              <span className="text-[#616266] uppercase text-[10px]">
                Engine
              </span>
              <span className="font-semibold text-[#EDEBE6]">
                {vehicle.engine}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-[#1F2023] rounded-sm">
              <span className="text-[#616266] uppercase text-[10px]">
                Power
              </span>
              <span className="font-semibold text-[#EDEBE6]">
                {vehicle.powerHp} HP
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-[#1F2023] rounded-sm">
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
                onClick={() => toggleFavorite(vehicle.id)}
                className={`p-2 rounded-sm border transition-colors ${
                  favorited
                    ? "border-[#B24A3C] text-[#B24A3C] bg-[#B24A3C]/10"
                    : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
                aria-label="Toggle favorite"
              >
                <Heart
                  className="h-4 w-4"
                  fill={favorited ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => toggleCompare(vehicle)}
                className={`p-2 rounded-sm border transition-colors ${
                  compared
                    ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10"
                    : "border-[#2A2C30] text-[#9A9994] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
                }`}
                aria-label="Toggle compare"
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

  // STANDARD VARIANT
  return (
    <div className="group relative flex flex-col rounded-md border border-[#2A2C30] bg-[#17181B] overflow-hidden transition-all duration-200 hover:border-[#3E8A6C] hover:shadow-medium">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0E0F11]">
        <Link href={href} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="uppercase font-semibold text-[10px]"
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
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(vehicle.id);
            }}
            className={`p-1.5 rounded-sm backdrop-blur-md border transition-colors ${
              favorited
                ? "border-[#B24A3C] text-[#B24A3C] bg-[#B24A3C]/20"
                : "border-[#2A2C30] text-[#EDEBE6] bg-black/50 hover:bg-black/70 hover:border-[#3E8A6C]"
            }`}
            aria-label="Toggle favorite"
          >
            <Heart
              className="h-3.5 w-3.5"
              fill={favorited ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(vehicle);
            }}
            className={`p-1.5 rounded-sm backdrop-blur-md border transition-colors ${
              compared
                ? "border-[#C9A227] text-[#C9A227] bg-[#C9A227]/20"
                : "border-[#2A2C30] text-[#EDEBE6] bg-black/50 hover:bg-black/70 hover:border-[#3E8A6C]"
            }`}
            aria-label="Toggle compare"
          >
            <Scale className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 justify-between p-4 space-y-3">
        <div className="space-y-1">
          <Link
            href={href}
            className="font-display text-lg font-bold text-[#EDEBE6] hover:text-[#E6C86E] transition-colors block leading-tight truncate"
          >
            {vehicle.model}
          </Link>
          <p className="text-xs text-[#9A9994] truncate">
            {vehicle.variantName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1.5 py-2 border-t border-[#2A2C30]/50 font-mono-num text-[11px] text-[#9A9994]">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-[#2F6B54]" />
            <span className="truncate">{vehicle.engine}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-3 w-3 text-[#2F6B54]" />
            <span className="truncate">{vehicle.powerHp} HP</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-[#2F6B54]" />
            <span className="truncate">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3 text-[#2F6B54]" />
            <span className="truncate">{vehicle.fuelType}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#2A2C30]/60">
          <div>
            <span className="text-[10px] text-[#616266] uppercase block leading-none mb-0.5">
              Price
            </span>
            <span className="font-mono-num text-sm font-bold text-[#C9A227]">
              {formatPriceRange(vehicle.priceMinLakh, vehicle.priceMaxLakh)}
            </span>
          </div>
          <Link href={href}>
            <span className="text-xs font-semibold text-[#EDEBE6] hover:text-[#2F6B54] transition-colors">
              Details →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
