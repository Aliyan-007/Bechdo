import React from "react";
import Link from "next/link";
import { Car, ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center space-y-6">
      <div className="mx-auto h-16 w-16 rounded-full bg-[#1F2023] border border-[#2A2C30] flex items-center justify-center text-[#C9A227]">
        <Car className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#C9A227]">
          404 — NOT FOUND IN DATABASE
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6]">
          Vehicle or Page Not Found
        </h1>
        <p className="text-sm text-[#9A9994] max-w-md mx-auto leading-relaxed">
          The vehicle variant, brand profile, or page you are looking for may
          have been discontinued or moved to a different URL slug.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Link href="/cars">
          <Button variant="primary" size="md" className="w-full sm:w-auto gap-2">
            <Compass className="h-4 w-4" />
            <span>Browse Full Cars Catalog</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
