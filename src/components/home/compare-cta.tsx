"use client";

import React from "react";
import Link from "next/link";
import { Scale, CheckCircle2, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function CompareCta() {
  return (
    <section className="py-14 border-b border-[#2A2C30] bg-[#141518]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-md border border-[#2A2C30] bg-[#17181B] p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#4EBA8E]">
              <Scale className="h-3.5 w-3.5 text-[#2F6B54]" />
              <span>SIDE-BY-SIDE INTELLIGENCE</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6]">
              Compare cars.
            </h2>

            <p className="text-base text-[#9A9994] max-w-xl font-mono">
              Compare up to 4 Pakistani vehicles side by side. Toggle &ldquo;Show Only Differences&rdquo; to analyze pricing, powertrains, dimensions, and CKD assembly warranties.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs font-mono text-[#EDEBE6]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>Price vs. Spec Ladder</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>Show Only Differences</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2F6B54]" />
                <span>Best Value Highlight</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center gap-3 bg-[#0E0F11] p-6 rounded-sm border border-[#2A2C30]">
            <span className="text-xs font-mono text-[#C9A227] uppercase">
              BENCHMARK PRESETS
            </span>
            <div className="flex flex-col gap-2">
              <Link
                href="/compare"
                className={buttonVariants({
                  variant: "primary",
                  size: "md",
                  className: "w-full justify-between font-semibold text-xs bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6]",
                })}
              >
                <span className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  <span>+ Make Comparison</span>
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/compare?ids=toy-corolla-e170-2014-altis-grande,hon-civic-fe-15-oriel-2022,hyu-elantra"
                className={buttonVariants({
                  variant: "outline",
                  size: "md",
                  className: "w-full justify-between font-semibold text-xs",
                })}
              >
                <span>Corolla vs Civic vs Elantra</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/compare?ids=kia-sportage,hyu-tucson,hav-h6,mg-hs"
                className={buttonVariants({
                  variant: "outline",
                  size: "md",
                  className: "w-full justify-between text-xs",
                })}
              >
                <span>C-Segment SUVs (4 Cars)</span>
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/compare?ids=suz-alto,suz-swift,suz-cultus-mk2-2000"
                className={buttonVariants({
                  variant: "outline",
                  size: "md",
                  className: "w-full justify-between text-xs",
                })}
              >
                <span>Hatchbacks: Alto vs Swift vs Cultus</span>
                <SlidersHorizontal className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
