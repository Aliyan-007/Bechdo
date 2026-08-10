"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { History, Calendar, Compass, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export interface TimelineEvent {
  id: string;
  year: number;
  decade: string;
  title: string;
  description: string;
  brandName: string | null;
  imageUrl: string | null;
}

interface HistoryTimelineProps {
  events: TimelineEvent[];
}

export function HistoryTimeline({ events }: HistoryTimelineProps) {
  const decades = [
    "All",
    "1950s",
    "1960s",
    "1970s",
    "1980s",
    "1990s",
    "2000s",
    "2010s",
    "2020s",
  ];

  const [activeDecade, setActiveDecade] = useState<string>("All");

  const filteredEvents = useMemo(() => {
    if (activeDecade === "All") return events;
    return events.filter((ev) => ev.decade === activeDecade);
  }, [events, activeDecade]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="border-b border-[#2A2C30] pb-6 mb-10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A227]">
          <History className="h-4 w-4 text-[#C9A227]" />
          <span>8-Decade National Retrospective</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEBE6]">
          Pakistan Automotive Heritage &amp; Timeline
        </h1>
        <p className="text-base sm:text-lg text-[#9A9994] max-w-3xl leading-relaxed">
          Explore the industrial milestones, iconic model launches, and regulatory
          policies that shaped personal mobility in Pakistan from the 1950s to the
          modern hybrid and NEV era.
        </p>
      </div>

      {/* Decade Selector Navigation */}
      <div className="mb-12 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-b border-[#2A2C30]">
        {decades.map((dec) => {
          const isSelected = activeDecade === dec;
          return (
            <button
              key={dec}
              onClick={() => setActiveDecade(dec)}
              className={`px-4 py-2 rounded-sm text-sm font-mono transition-all shrink-0 border ${
                isSelected
                  ? "bg-[#C9A227] text-[#0E0F11] border-[#C9A227] font-bold shadow-subtle"
                  : "bg-[#17181B] text-[#9A9994] border-[#2A2C30] hover:text-[#EDEBE6] hover:border-[#3E8A6C]"
              }`}
            >
              {dec}
            </button>
          );
        })}
      </div>

      {/* Vertical Timeline */}
      <div className="relative border-l-2 border-[#2A2C30] ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {filteredEvents.map((ev, idx) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Node Icon */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1 h-6 w-6 rounded-full bg-[#1F2023] border-2 border-[#C9A227] flex items-center justify-center text-[10px] font-mono font-bold text-[#EDEBE6] group-hover:bg-[#C9A227] group-hover:text-[#0E0F11] transition-colors shadow-subtle">
              ●
            </div>

            <div className="rounded-lg border border-[#2A2C30] bg-[#17181B] p-6 sm:p-8 transition-all duration-200 hover:border-[#3E8A6C] hover:bg-[#1F2023] hover:shadow-elevated grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#C9A227] bg-[#C9A227]/15 px-3 py-1 rounded-sm">
                    {ev.year}
                  </span>
                  <span className="font-mono text-xs text-[#9A9994] uppercase tracking-wider">
                    {ev.decade} ERA
                  </span>
                  {ev.brandName && (
                    <span className="text-xs font-semibold uppercase text-[#4EBA8E] bg-[#2F6B54]/15 px-2.5 py-0.5 rounded-sm">
                      {ev.brandName}
                    </span>
                  )}
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors">
                  {ev.title}
                </h2>

                <p className="text-base text-[#9A9994] leading-relaxed">
                  {ev.description}
                </p>

                {ev.brandName && (
                  <div className="pt-2">
                    <Link
                      href={`/brands/${ev.brandName.toLowerCase()}`}
                      className="text-xs font-semibold text-[#E6C86E] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all {ev.brandName} models in catalog</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Decorative / Brand Emblem preview */}
              <div className="md:col-span-4 flex items-center justify-center bg-[#0E0F11] p-6 rounded-md border border-[#2A2C30] aspect-[16/9]">
                {ev.imageUrl ? (
                  <img
                    src={ev.imageUrl}
                    alt={ev.title}
                    className="h-full w-full object-cover rounded-sm opacity-90"
                  />
                ) : (
                  <div className="text-center space-y-1">
                    <Calendar className="h-8 w-8 text-[#C9A227] mx-auto" />
                    <span className="font-display font-bold text-lg text-[#EDEBE6] block">
                      {ev.year}
                    </span>
                    <span className="text-xs font-mono text-[#9A9994]">
                      MILESTONE RECORD
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
