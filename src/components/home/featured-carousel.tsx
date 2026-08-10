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
import { VehicleCard, type VehicleCardProps } from "@/components/vehicle-card";

interface FeaturedCarouselProps {
  vehicles: VehicleCardProps["vehicle"][];
}

export function FeaturedCarousel({ vehicles }: FeaturedCarouselProps) {
  return (
    <section className="py-14 border-b border-[#2A2C30]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#4EBA8E]">
              <Sparkles className="h-3.5 w-3.5 text-[#2F6B54]" />
              <span>Spotlight Vehicles</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              Featured in Pakistan
            </h2>
          </div>
          <Link
            href="/cars?featured=true"
            className="text-sm font-semibold text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>View All Featured ({vehicles.length})</span>
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
                  className="pl-4 basis-[88%] sm:basis-[48%] lg:basis-[32%]"
                >
                  <VehicleCard vehicle={v} variant="featured" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-5" />
            <CarouselNext className="hidden md:flex -right-5" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
