"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, History, Calendar, Compass } from "lucide-react";

export interface EditorialTimelineEvent {
  id: string;
  year: number;
  decade: string;
  title: string;
  description: string;
  brandName: string | null;
}

interface EditorialArchiveTimelineProps {
  events: EditorialTimelineEvent[];
}

export function EditorialArchiveTimeline({
  events,
}: EditorialArchiveTimelineProps) {
  const [selectedDecade, setSelectedDecade] = useState<string>("ALL");

  const decades = ["ALL", "1950s", "1960s", "1980s", "1990s", "2000s", "2010s", "2020s"];

  const filteredEvents =
    selectedDecade === "ALL"
      ? events
      : events.filter((ev) => ev.decade.toLowerCase() === selectedDecade.toLowerCase());

  return (
    <section className="py-16 border-b border-[#2A2C30] bg-[#0E0F11]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Decade Navigation Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <History className="h-3.5 w-3.5 text-[#C9A227]" />
              <span>1950S — 2020S HERITAGE TIMELINE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6] tracking-tight">
              Pakistan&rsquo;s Automotive Chronicle
            </h2>
            <p className="text-xs font-mono text-[#9A9994] max-w-lg">
              Documenting 8 decades of mobility milestones—from early Ford and Bedford imports to Suzuki&rsquo;s CKD revolution, Indus Corolla dominance, and modern crossovers.
            </p>
          </div>

          {/* Decade Pills Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#141518] p-1.5 rounded-sm border border-[#2A2C30]">
            {decades.map((dec) => {
              const isSelected = selectedDecade === dec;
              return (
                <button
                  key={dec}
                  onClick={() => setSelectedDecade(dec)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? "bg-[#C9A227] text-[#0E0F11]"
                      : "text-[#9A9994] hover:text-[#EDEBE6]"
                  }`}
                >
                  {dec}
                </button>
              );
            })}
          </div>
        </div>

        {/* Vertical Archive Timeline Grid (No SaaS Card Box Clutter!) */}
        <div className="space-y-12 border-l-2 border-[#2A2C30] pl-6 sm:pl-10">
          {filteredEvents.map((ev, idx) => (
            <div
              key={ev.id}
              className="relative group transition-opacity duration-300"
            >
              {/* Timeline dot anchor */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-2 h-4 w-4 rounded-full bg-[#0E0F11] border-2 border-[#C9A227] group-hover:bg-[#C9A227] transition-colors" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Huge Year Numerals & Brand Badge (Phase 16 requirement) */}
                <div className="md:col-span-3 space-y-1">
                  <span className="font-display text-5xl sm:text-6xl font-bold text-[#C9A227] block leading-none">
                    {ev.year}
                  </span>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono uppercase text-[#9A9994] font-semibold">
                      {ev.decade} ERA
                    </span>
                    {ev.brandName && (
                      <span className="px-2 py-0.5 rounded bg-[#17181B] border border-[#2A2C30] text-[10px] font-mono text-[#EDEBE6]">
                        {ev.brandName.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Milestone Title & Archival Context */}
                <div className="md:col-span-9 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6] group-hover:text-[#C9A227] transition-colors">
                      {ev.title}
                    </h3>
                    <Link
                      href="/history"
                      className="text-xs font-mono uppercase tracking-wider text-[#9A9994] hover:text-[#EDEBE6] transition-colors flex items-center gap-1"
                    >
                      <span>CHRONICLE ENTRY →</span>
                    </Link>
                  </div>

                  <p className="text-sm sm:text-base font-mono text-[#9A9994] leading-relaxed max-w-3xl">
                    {ev.description}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#616266]">
                    <span>ARCHIVAL ACCESSION REF: PK-HIST-{ev.year}</span>
                    <span>•</span>
                    <span>DOCUMENTED IN RASTA DATABASE</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-14 pt-8 border-t border-[#2A2C30] flex items-center justify-between">
          <span className="text-xs font-mono text-[#9A9994]">
            Showing {filteredEvents.length} documented historical records
          </span>
          <Link
            href="/history"
            className="text-xs font-mono uppercase font-bold text-[#C9A227] hover:underline flex items-center gap-1"
          >
            <span>EXPLORE FULL 1950S–2020S TIMELINE</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
