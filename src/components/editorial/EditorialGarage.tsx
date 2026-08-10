"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { EditorialVehicleCard, type EditorialVehicleCardProps } from "@/components/editorial/EditorialVehicleCard";

interface EditorialGarageProps {
  title: string;
  subtitle: string;
  vehicles: EditorialVehicleCardProps["vehicle"][];
  viewAllHref: string;
  viewAllText?: string;
  brandColor?: string;
}

export function EditorialGarage({
  title,
  subtitle,
  vehicles,
  viewAllHref,
  viewAllText = "EXPLORE CATALOG",
  brandColor = "#2F6B54",
}: EditorialGarageProps) {
  if (vehicles.length === 0) return null;

  return (
    <section className="py-14 border-b border-[#2A2C30] bg-[#0E0F11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <Flame className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>{subtitle}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6] tracking-tight">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className="text-xs font-mono uppercase tracking-widest text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>{viewAllText} ({vehicles.length})</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
                  className="pl-4 basis-[82%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%]"
                >
                  <EditorialVehicleCard
                    vehicle={v}
                    variant="standard"
                    brandColor={brandColor}
                  />
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
