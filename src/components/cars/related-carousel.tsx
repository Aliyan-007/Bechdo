"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { VehicleCard, type VehicleCardProps } from "@/components/vehicle-card";

interface RelatedCarsCarouselProps {
  vehicles: VehicleCardProps["vehicle"][];
  currentModel: string;
}

export function RelatedCarsCarousel({
  vehicles,
  currentModel,
}: RelatedCarsCarouselProps) {
  return (
    <section className="mt-16 pt-12 border-t border-[#2A2C30]">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4EBA8E]">
            <Layers className="h-3.5 w-3.5 text-[#2F6B54]" />
            <span>Similar Competitors</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
            More Cars Like the {currentModel}
          </h2>
        </div>
        <Link
          href="/cars"
          className="text-sm font-semibold text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="relative">
          <CarouselContent className="-ml-4">
            {vehicles.map((v) => (
              <CarouselItem
                key={v.id}
                className="pl-4 basis-[85%] sm:basis-[48%] md:basis-[33.33%] lg:basis-[25%]"
              >
                <VehicleCard vehicle={v} variant="standard" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-5" />
          <CarouselNext className="hidden md:flex -right-5" />
        </div>
      </Carousel>
    </section>
  );
}
