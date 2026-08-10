"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RASTA runtime error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6">
      <div className="mx-auto h-14 w-14 rounded-full bg-[#B24A3C]/15 border border-[#B24A3C]/40 flex items-center justify-center text-[#E37A6D]">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-[#EDEBE6]">
          Something Went Wrong
        </h2>
        <p className="text-sm text-[#9A9994] max-w-md mx-auto leading-relaxed">
          We encountered an unexpected error while retrieving this automotive
          data. Our database connection might be temporarily resetting.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Button variant="primary" size="md" onClick={() => reset()} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => (window.location.href = "/")}
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
