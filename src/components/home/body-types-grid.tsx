"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Layers, Car, Truck, Compass, Shield } from "lucide-react";

export interface BodyTypeCount {
  bodyType: string;
  count: number;
  description: string;
}

interface BodyTypesGridProps {
  bodyTypes: BodyTypeCount[];
}

export function BodyTypesGrid({ bodyTypes }: BodyTypesGridProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sedan":
        return <Car className="h-7 w-7 text-[#2F6B54]" />;
      case "hatchback":
        return <Car className="h-7 w-7 text-[#C9A227]" />;
      case "suv":
        return <Shield className="h-7 w-7 text-[#2F6B54]" />;
      case "crossover":
        return <Compass className="h-7 w-7 text-[#E6C86E]" />;
      case "pickup":
        return <Truck className="h-7 w-7 text-[#B24A3C]" />;
      case "mpv":
        return <Layers className="h-7 w-7 text-[#3D7399]" />;
      default:
        return <Car className="h-7 w-7 text-[#2F6B54]" />;
    }
  };

  return (
    <section className="py-14 border-b border-[#2A2C30] bg-[#141518]/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A9994]">
              <Layers className="h-3.5 w-3.5 text-[#2F6B54]" />
              <span>Category Navigation</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              Browse by Body Type
            </h2>
          </div>
          <Link
            href="/cars"
            className="text-sm font-semibold text-[#E6C86E] hover:text-[#EDEBE6] transition-colors flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bodyTypes.map((item) => (
            <Link
              key={item.bodyType}
              href={`/cars?bodyType=${encodeURIComponent(item.bodyType)}`}
              className="group flex flex-col justify-between rounded-md border border-[#2A2C30] bg-[#17181B] p-5 transition-all duration-200 hover:border-[#3E8A6C] hover:bg-[#1F2023] hover:shadow-subtle"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-sm bg-[#1F2023] border border-[#2A2C30] group-hover:border-[#3E8A6C] transition-colors">
                  {getIcon(item.bodyType)}
                </div>
                <span className="font-mono text-xs font-semibold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded-sm">
                  {item.count} {item.count === 1 ? "Car" : "Cars"}
                </span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors">
                  {item.bodyType}
                </h3>
                <p className="text-xs text-[#9A9994] mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
