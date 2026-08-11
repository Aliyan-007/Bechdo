"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button, buttonVariants } from "@/components/ui/button";
import { EditorialVehicleCard, type EditorialVehicleCardProps } from "@/components/editorial/EditorialVehicleCard";

interface EditorialFeaturedProps {
  vehicles: EditorialVehicleCardProps["vehicle"][];
}

export function EditorialFeatured({ vehicles }: EditorialFeaturedProps) {
  if (vehicles.length === 0) return null;

  // Lead spotlight story is the first featured vehicle
  const lead = vehicles[0];
  const remaining = vehicles.slice(1);

  const hrefLead = `/cars/${lead.brand.toLowerCase()}/${lead.model.toLowerCase()}/${lead.id}`;
  const leadImage =
    lead.images?.find((x) => x.category === "exterior")?.url ||
    lead.images?.[0]?.url ||
    "";

  return (
    <section className="py-14 border-b border-[#2A2C30] bg-[#0E0F11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4EBA8E]">
              <span className="h-1.5 w-1.5 bg-[#2F6B54]" />
              <span>FEATURED IN PAKISTAN</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6] tracking-tight">
              The Spotlight
            </h2>
          </div>
          <Link
            href="/cars?featured=true"
            className="text-xs font-mono uppercase tracking-widest text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>ALL FEATURED ({vehicles.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Major Editorial Story Box (Asymmetrical Split - Breaks the card grid!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 sm:p-8 mb-10">
          <div className="lg:col-span-7 aspect-[16/9] bg-[#0E0F11] overflow-hidden rounded-sm border border-[#2A2C30] relative group">
            {leadImage && (
              <img
                src={leadImage}
                alt={`${lead.brand} ${lead.model}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 bg-[#2F6B54] text-[#EDEBE6] text-[10px] font-mono font-bold uppercase tracking-wider">
                LEAD STORY
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9A9994]">
                {lead.brand} • {lead.bodyType}
              </span>
              <h3 className="font-display text-3xl font-bold text-[#EDEBE6] leading-tight">
                {lead.model} {lead.variantName}
              </h3>
            </div>

            <div className="font-mono-num text-2xl font-bold text-[#C9A227] py-2 border-y border-[#2A2C30]/60">
              PKR {lead.priceMinLakh} – {lead.priceMaxLakh} Lakh
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#9A9994]">
              <div>
                <span className="text-[10px] text-[#616266] uppercase block">
                  POWERTRAIN
                </span>
                <span className="text-[#EDEBE6] font-semibold">
                  {lead.engine}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#616266] uppercase block">
                  TRANSMISSION
                </span>
                <span className="text-[#EDEBE6] font-semibold">
                  {lead.transmission}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={hrefLead}
                className={buttonVariants({
                  variant: "primary",
                  size: "md",
                  className: "font-semibold text-xs tracking-wider uppercase inline-flex",
                })}
              >
                VIEW VEHICLE →
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel for remaining spotlight variants */}
        {remaining.length > 0 && (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <div className="relative">
              <CarouselContent className="-ml-4">
                {remaining.map((v) => (
                  <CarouselItem
                    key={v.id}
                    className="pl-4 basis-[88%] sm:basis-[48%] lg:basis-[32%]"
                  >
                    <EditorialVehicleCard vehicle={v} variant="featured" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-5" />
              <CarouselNext className="hidden md:flex -right-5" />
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}
