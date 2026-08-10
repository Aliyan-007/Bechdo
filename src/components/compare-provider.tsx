"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { Scale, X, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CompareVehicle {
  id: string;
  brand: string;
  model: string;
  variantName: string;
  priceMinLakh: number;
  priceMaxLakh: number;
}

interface CompareContextType {
  compared: CompareVehicle[];
  toggleCompare: (vehicle: CompareVehicle) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
  isCompared: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType>({
  compared: [],
  toggleCompare: () => {},
  removeCompare: () => {},
  clearCompare: () => {},
  isCompared: () => false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compared, setCompared] = useState<CompareVehicle[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("rasta-compare-list");
      if (saved) {
        setCompared(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load compare list", e);
    }
  }, []);

  const updateList = (newList: CompareVehicle[]) => {
    setCompared(newList);
    if (mounted) {
      localStorage.setItem("rasta-compare-list", JSON.stringify(newList));
    }
  };

  const toggleCompare = (vehicle: CompareVehicle) => {
    const exists = compared.some((v) => v.id === vehicle.id);
    if (exists) {
      updateList(compared.filter((v) => v.id !== vehicle.id));
    } else {
      if (compared.length >= 4) {
        alert("You can compare up to 4 vehicles at a time.");
        return;
      }
      updateList([...compared, vehicle]);
    }
  };

  const removeCompare = (id: string) => {
    updateList(compared.filter((v) => v.id !== id));
  };

  const clearCompare = () => {
    updateList([]);
  };

  const isCompared = (id: string) => {
    return compared.some((v) => v.id === id);
  };

  const compareUrl = `/compare?ids=${compared.map((v) => v.id).join(",")}`;

  return (
    <CompareContext.Provider
      value={{
        compared,
        toggleCompare,
        removeCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}

      {/* Floating Bottom Compare Tray */}
      {mounted && compared.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-[#17181B] border border-[#3E8A6C] rounded-lg shadow-elevated p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-full">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-[#E6C86E] shrink-0">
              <Scale className="h-4 w-4" />
              <span>Compare ({compared.length}/4):</span>
            </div>

            <div className="flex items-center gap-2">
              {compared.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-1.5 bg-[#1F2023] border border-[#2A2C30] px-2.5 py-1 rounded-sm text-xs text-[#EDEBE6] shrink-0"
                >
                  <span className="font-semibold">{v.brand}</span>
                  <span>{v.model}</span>
                  <button
                    onClick={() => removeCompare(v.id)}
                    className="text-[#9A9994] hover:text-[#B24A3C] transition-colors ml-1"
                    aria-label={`Remove ${v.model} from comparison`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={clearCompare}
              className="text-xs text-[#9A9994] hover:text-[#EDEBE6] transition-colors px-2 py-1 flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>

            <Link href={compareUrl}>
              <Button variant="primary" size="sm" className="gap-1.5">
                <span>Make Comparison</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
