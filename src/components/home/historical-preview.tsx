"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, History, Calendar } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export interface HistoricalEventCard {
  id: string;
  year: number;
  decade: string;
  title: string;
  description: string;
  brandName: string | null;
}

interface HistoricalPreviewProps {
  events: HistoricalEventCard[];
}

export function HistoricalPreview({ events }: HistoricalPreviewProps) {
  return (
    <section className="py-14 border-b border-[#2A2C30] bg-[#141518]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A227]">
              <History className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>1950s — 2020s Heritage</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              Pakistan Automotive History Timeline
            </h2>
          </div>
          <Link
            href="/history"
            className="text-sm font-semibold text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>Explore Full 8-Decade Timeline</span>
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
              {events.map((ev) => (
                <CarouselItem
                  key={ev.id}
                  className="pl-4 basis-[85%] sm:basis-[50%] md:basis-[33.33%]"
                >
                  <div className="group flex flex-col justify-between h-full rounded-md border border-[#2A2C30] bg-[#17181B] p-6 transition-all duration-200 hover:border-[#C9A227]/60 hover:shadow-subtle">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/15 px-2.5 py-1 rounded-sm">
                          {ev.year} • {ev.decade}
                        </span>
                        {ev.brandName && (
                          <span className="text-xs font-semibold uppercase text-[#9A9994]">
                            {ev.brandName}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors">
                        {ev.title}
                      </h3>

                      <p className="text-sm text-[#9A9994] leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#2A2C30]/50 flex items-center justify-between text-xs text-[#616266]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Milestone Event</span>
                      </span>
                      <Link
                        href="/history"
                        className="text-[#E6C86E] hover:underline font-semibold"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
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
