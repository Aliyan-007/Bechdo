import React from "react";
import { Compass } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-sm bg-[#1F2023] border border-[#2A2C30] animate-pulse">
        <Compass className="h-6 w-6 text-[#2F6B54] animate-spin" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display font-semibold text-lg text-[#EDEBE6]">
          Loading RASTA Automotive Platform...
        </h3>
        <p className="text-xs font-mono text-[#9A9994] uppercase tracking-wider">
          Retrieving live verified ex-factory prices &amp; specifications
        </p>
      </div>
    </div>
  );
}
