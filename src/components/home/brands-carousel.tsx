"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoInitial: string;
  color: string;
  country: string;
  modelCount: number;
}

interface BrandsCarouselProps {
  brands: BrandItem[];
}

export function BrandsCarousel({ brands }: BrandsCarouselProps) {
  return (
    <section className="py-14 border-b border-[#2A2C30]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9994]">
              <Compass className="h-3.5 w-3.5 text-[#2F6B54]" />
              <span>Manufacturer Directory</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              Browse by Brand
            </h2>
          </div>
          <Link
            href="/brands"
            className="text-sm font-semibold text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>View All {brands.length} Brands</span>
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
            <CarouselContent className="-ml-3">
              {brands.map((b) => (
                <CarouselItem
                  key={b.id}
                  className="pl-3 basis-[55%] sm:basis-[33%] md:basis-[25%] lg:basis-[16.66%]"
                >
                  <Link
                    href={`/brands/${b.slug}`}
                    className="group flex flex-col items-center justify-center rounded-md border border-[#2A2C30] bg-[#17181B] p-5 text-center transition-all duration-200 hover:border-[#3E8A6C] hover:bg-[#1F2023] hover:shadow-subtle"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-sm font-display font-bold text-xl mb-3 shadow-subtle group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: b.color || "#2F6B54",
                        color: "#EDEBE6",
                      }}
                    >
                      {b.logoInitial}
                    </div>
                    <span className="font-display font-semibold text-base text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors">
                      {b.name}
                    </span>
                    <span className="text-xs text-[#9A9994] mt-0.5">
                      {b.country}
                    </span>
                    <span className="font-mono text-[10px] text-[#4EBA8E] uppercase tracking-wider mt-2 border-t border-[#2A2C30]/50 pt-1 w-full">
                      {b.modelCount} {b.modelCount === 1 ? "Model" : "Models"}
                    </span>
                  </Link>
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
