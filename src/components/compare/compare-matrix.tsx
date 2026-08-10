"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  Plus,
  X,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
  ArrowLeft,
  Check,
  AlertCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPriceRange, formatPriceLakh } from "@/lib/utils";
import { useCompare } from "@/components/compare-provider";

export interface CompareDetailVehicle {
  id: string;
  brand: string;
  model: string;
  variantName: string;
  bodyType: string;
  fuelType: string;
  priceMinLakh: number;
  priceMaxLakh: number;
  badge: string | null;
  engine: string;
  transmission: string;
  seating: number;
  mileageKmpl?: number | null;
  powerHp: number;
  torqueNm: number;
  fuelTankL?: number | null;
  bootSpaceL?: number | null;
  groundClearanceMm?: number | null;
  airbags: number;
  specification?: {
    displacementCc?: number | null;
    driveType: string;
    topSpeedKmh: number;
    acceleration0to100: number;
    kerbWeightKg: number;
    lengthMm: number;
    widthMm: number;
    heightMm: number;
    wheelbaseMm: number;
  } | null;
  pakAvailability?: {
    isLocallyAssembled: boolean;
    assemblyPartner: string;
    warrantyYears: number;
    warrantyKm: number;
  } | null;
  images: { url: string; category: string }[];
  features: string[];
}

interface CompareMatrixProps {
  initialVehicles: CompareDetailVehicle[];
  allCatalogVehicles: { id: string; brand: string; model: string; variantName: string; priceMinLakh?: number; priceMaxLakh?: number }[];
}

export function CompareMatrix({
  initialVehicles,
  allCatalogVehicles,
}: CompareMatrixProps) {
  const router = useRouter();
  const { removeCompare, clearCompare } = useCompare();

  const [vehicles, setVehicles] =
    useState<CompareDetailVehicle[]>(initialVehicles);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [addModalIndex, setAddModalIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Custom Make Comparison Modal State
  const [isMakeCompareOpen, setIsMakeCompareOpen] = useState(false);
  const [makeCompareIds, setMakeCompareIds] = useState<string[]>([]);
  const [slotSearch, setSlotSearch] = useState<{ [key: number]: string }>({});
  const [activeSlotDropdown, setActiveSlotDropdown] = useState<number | null>(null);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("make=true")) {
      openMakeCompareModal();
    }
  }, []);

  const openMakeCompareModal = () => {
    const currentIds = vehicles.map((v) => v.id);
    setMakeCompareIds(currentIds);
    setSlotSearch({});
    setActiveSlotDropdown(null);
    setIsMakeCompareOpen(true);
  };

  const handleSlotSelect = (slotIndex: number, vehicleId: string) => {
    const updated = [...makeCompareIds];
    updated[slotIndex] = vehicleId;
    const cleaned = updated.map((id, idx) => (id === vehicleId && idx !== slotIndex ? "" : id)).filter(Boolean);
    setMakeCompareIds(cleaned);
    setActiveSlotDropdown(null);
  };

  const handleSlotRemove = (slotIndex: number) => {
    const updated = [...makeCompareIds];
    updated.splice(slotIndex, 1);
    setMakeCompareIds(updated.filter(Boolean));
  };

  const handleQuickAdd = (vehicleId: string) => {
    if (makeCompareIds.includes(vehicleId)) return;
    if (makeCompareIds.length >= 4) return;
    setMakeCompareIds([...makeCompareIds, vehicleId]);
  };

  const handleMakeComparisonSubmit = () => {
    const validIds = makeCompareIds.filter(Boolean);
    if (validIds.length < 2) {
      alert("Please select at least 2 vehicles to make a comparison.");
      return;
    }
    setIsMakeCompareOpen(false);
    router.push(`/compare?ids=${validIds.join(",")}`);
  };

  const handleRemove = (id: string) => {
    const updated = vehicles.filter((v) => v.id !== id);
    setVehicles(updated);
    removeCompare(id);
    const newIds = updated.map((v) => v.id).join(",");
    router.push(newIds ? `/compare?ids=${newIds}` : "/compare");
  };

  const handleAddVehicle = (id: string) => {
    const newIds = [...vehicles.map((v) => v.id), id].slice(0, 4).join(",");
    setAddModalIndex(null);
    router.push(`/compare?ids=${newIds}`);
  };

  // Define comparison spec rows
  const specRows = useMemo(() => {
    return [
      {
        section: "Pricing & Assembly",
        rows: [
          {
            key: "priceRange",
            label: "Ex-Factory Price",
            getValue: (v: CompareDetailVehicle) =>
              formatPriceRange(v.priceMinLakh, v.priceMaxLakh),
            compareKey: (v: CompareDetailVehicle) => v.priceMinLakh,
            numeric: true,
            better: "low",
          },
          {
            key: "assembly",
            label: "Assembly Status",
            getValue: (v: CompareDetailVehicle) =>
              v.pakAvailability?.isLocallyAssembled ? "CKD (Local)" : "CBU (Imported)",
            compareKey: (v: CompareDetailVehicle) =>
              v.pakAvailability?.isLocallyAssembled ? "CKD" : "CBU",
          },
          {
            key: "partner",
            label: "Authorized Assembler",
            getValue: (v: CompareDetailVehicle) =>
              v.pakAvailability?.assemblyPartner || "Independent Dealer",
            compareKey: (v: CompareDetailVehicle) =>
              v.pakAvailability?.assemblyPartner || "N/A",
          },
          {
            key: "warranty",
            label: "Factory Warranty",
            getValue: (v: CompareDetailVehicle) =>
              v.pakAvailability
                ? `${v.pakAvailability.warrantyYears} Years / ${v.pakAvailability.warrantyKm.toLocaleString()} KM`
                : "Standard Warranty",
            compareKey: (v: CompareDetailVehicle) =>
              v.pakAvailability?.warrantyYears || 3,
            numeric: true,
            better: "high",
          },
        ],
      },
      {
        section: "Powertrain & Output",
        rows: [
          {
            key: "engine",
            label: "Engine Description",
            getValue: (v: CompareDetailVehicle) => v.engine,
            compareKey: (v: CompareDetailVehicle) => v.engine,
          },
          {
            key: "fuelType",
            label: "Fuel / Powertrain",
            getValue: (v: CompareDetailVehicle) => v.fuelType,
            compareKey: (v: CompareDetailVehicle) => v.fuelType,
          },
          {
            key: "power",
            label: "Horsepower (HP)",
            getValue: (v: CompareDetailVehicle) => `${v.powerHp} hp`,
            compareKey: (v: CompareDetailVehicle) => v.powerHp,
            numeric: true,
            better: "high",
          },
          {
            key: "torque",
            label: "Torque (Nm)",
            getValue: (v: CompareDetailVehicle) => `${v.torqueNm} Nm`,
            compareKey: (v: CompareDetailVehicle) => v.torqueNm,
            numeric: true,
            better: "high",
          },
          {
            key: "transmission",
            label: "Transmission",
            getValue: (v: CompareDetailVehicle) => v.transmission,
            compareKey: (v: CompareDetailVehicle) => v.transmission,
          },
          {
            key: "drive",
            label: "Drivetrain",
            getValue: (v: CompareDetailVehicle) =>
              v.specification?.driveType || "FWD",
            compareKey: (v: CompareDetailVehicle) =>
              v.specification?.driveType || "FWD",
          },
        ],
      },
      {
        section: "Dimensions, Capacity & Economy",
        rows: [
          {
            key: "bodyType",
            label: "Body Type",
            getValue: (v: CompareDetailVehicle) => v.bodyType,
            compareKey: (v: CompareDetailVehicle) => v.bodyType,
          },
          {
            key: "seating",
            label: "Seating Capacity",
            getValue: (v: CompareDetailVehicle) => `${v.seating} Seats`,
            compareKey: (v: CompareDetailVehicle) => v.seating,
            numeric: true,
            better: "high",
          },
          {
            key: "clearance",
            label: "Ground Clearance",
            getValue: (v: CompareDetailVehicle) =>
              v.groundClearanceMm ? `${v.groundClearanceMm} mm` : "N/A",
            compareKey: (v: CompareDetailVehicle) =>
              v.groundClearanceMm || 0,
            numeric: true,
            better: "high",
          },
          {
            key: "boot",
            label: "Boot Space",
            getValue: (v: CompareDetailVehicle) =>
              v.bootSpaceL ? `${v.bootSpaceL} Liters` : "N/A",
            compareKey: (v: CompareDetailVehicle) => v.bootSpaceL || 0,
            numeric: true,
            better: "high",
          },
          {
            key: "mileage",
            label: "Approx. Mileage",
            getValue: (v: CompareDetailVehicle) =>
              v.mileageKmpl ? `${v.mileageKmpl} km/l` : "EV / Hybrid range",
            compareKey: (v: CompareDetailVehicle) => v.mileageKmpl || 0,
            numeric: true,
            better: "high",
          },
        ],
      },
      {
        section: "Safety & Equipment",
        rows: [
          {
            key: "airbags",
            label: "Airbags Count",
            getValue: (v: CompareDetailVehicle) => `${v.airbags} Airbags`,
            compareKey: (v: CompareDetailVehicle) => v.airbags,
            numeric: true,
            better: "high",
          },
          {
            key: "kerbWeight",
            label: "Kerb Weight (approx)",
            getValue: (v: CompareDetailVehicle) =>
              v.specification?.kerbWeightKg
                ? `${v.specification.kerbWeightKg} kg`
                : "1,280 kg",
            compareKey: (v: CompareDetailVehicle) =>
              v.specification?.kerbWeightKg || 1280,
          },
        ],
      },
    ];
  }, []);

  // Filter sections by "Show only differences"
  const visibleSpecRows = useMemo(() => {
    if (!showOnlyDifferences || vehicles.length < 2) return specRows;

    return specRows
      .map((sec) => ({
        ...sec,
        rows: sec.rows.filter((row) => {
          const firstVal = row.compareKey(vehicles[0]);
          return vehicles.some((v) => row.compareKey(v) !== firstVal);
        }),
      }))
      .filter((sec) => sec.rows.length > 0);
  }, [specRows, showOnlyDifferences, vehicles]);

  // Determine best value in row
  const getBestIndex = (row: any) => {
    if (!row.numeric || !row.better || vehicles.length < 2) return -1;
    const vals = vehicles.map((v) => row.compareKey(v));
    if (vals.every((x) => x === vals[0])) return -1; // all identical

    if (row.better === "high") {
      const max = Math.max(...vals);
      return vals.indexOf(max);
    } else {
      const min = Math.min(...vals.filter((x) => x > 0));
      return vals.indexOf(min);
    }
  };

  // Preset benchmarks
  const presets = [
    {
      label: "Top Sedans: Corolla vs Civic vs Elantra",
      ids: "toy-corolla,hon-civic,hyu-elantra",
    },
    {
      label: "C-Segment SUVs: Sportage vs Tucson vs H6 vs HS",
      ids: "kia-sportage,hyu-tucson,hav-h6,mg-hs",
    },
    {
      label: "Entry Hatchbacks: Alto vs Swift vs Cultus",
      ids: "suz-alto,suz-swift,suz-cultus",
    },
    {
      label: "7-Seater SUVs: Fortuner vs Sorento vs Gloster",
      ids: "toy-fortuner,kia-sorento,mg-gloster",
    },
  ];

  const availableToAdd = allCatalogVehicles.filter(
    (cv) => !vehicles.some((v) => v.id === cv.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#2A2C30] mb-8">
        <div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9A9994] hover:text-[#EDEBE6] mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#C9A227]">
            <Scale className="h-3.5 w-3.5 text-[#C9A227]" />
            <span>Side-by-Side Matrix</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#EDEBE6]">
            Compare Vehicles
          </h1>
        </div>

        {/* Top Controls: Show only diffs + Clear */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Button
            variant="primary"
            size="sm"
            onClick={openMakeCompareModal}
            className="font-mono text-xs font-semibold uppercase tracking-wider gap-1.5 bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6]"
          >
            <Scale className="h-3.5 w-3.5" />
            <span>+ MAKE COMPARISON</span>
          </Button>

          <label className="flex items-center gap-2 cursor-pointer bg-[#17181B] border border-[#2A2C30] px-3.5 py-2 rounded-sm text-xs font-medium text-[#EDEBE6] hover:border-[#3E8A6C] transition-colors select-none">
            <input
              type="checkbox"
              checked={showOnlyDifferences}
              onChange={(e) => setShowOnlyDifferences(e.target.checked)}
              className="h-4 w-4 rounded border-[#2A2C30] text-[#2F6B54] focus:ring-[#2F6B54]"
            />
            <span className="text-xs">Show only differences</span>
          </label>

          {vehicles.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearCompare();
                router.push("/compare");
              }}
              className="text-xs text-[#B24A3C] hover:text-[#E37A6D]"
            >
              Clear Comparison
            </Button>
          )}
        </div>
      </div>

      {/* Preset Buttons Bar */}
      <div className="mb-8 p-4 rounded-md border border-[#2A2C30] bg-[#141518] space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#9A9994] block">
          Popular Benchmark Comparisons:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.ids}
              onClick={() => router.push(`/compare?ids=${preset.ids}`)}
              className="px-3 py-1.5 rounded-sm bg-[#1F2023] border border-[#2A2C30] hover:border-[#3E8A6C] text-xs font-medium text-[#EDEBE6] transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid Table */}
      {vehicles.length === 0 ? (
        <div className="rounded-md border border-[#2A2C30] bg-[#17181B] p-12 text-center space-y-5">
          <div className="mx-auto h-16 w-16 rounded-full bg-[#1F2023] border border-[#2A2C30] flex items-center justify-center text-[#C9A227]">
            <Scale className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#EDEBE6]">
              No vehicles selected for comparison
            </h3>
            <p className="text-sm text-[#9A9994] max-w-lg mx-auto">
              Make a custom side-by-side comparison across any 2 to 4 Pakistani models, or choose one of our benchmark presets below.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={openMakeCompareModal}
              className="font-semibold text-xs tracking-wider uppercase gap-2 px-6 py-3"
            >
              <Scale className="h-4 w-4" />
              <span>+ MAKE COMPARISON</span>
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() =>
                router.push("/compare?ids=toy-corolla,hon-civic,hyu-elantra")
              }
              className="font-semibold text-xs tracking-wider uppercase px-6 py-3"
            >
              Load Corolla vs Civic vs Elantra
            </Button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <table className="w-full min-w-[760px] border-collapse text-left">
            {/* TH COLUMN HEADERS */}
            <thead>
              <tr className="border-b border-[#2A2C30]">
                <th className="w-48 p-4 align-top bg-[#141518] border-r border-[#2A2C30]">
                  <span className="font-display font-bold text-lg text-[#EDEBE6] block">
                    Models ({vehicles.length}/4)
                  </span>
                  <span className="text-xs text-[#9A9994] font-normal block mt-1">
                    Ex-factory price &amp; tech comparison
                  </span>
                </th>

                {/* 1 to 4 Vehicle Header Cells */}
                {vehicles.map((v) => {
                  const image =
                    v.images.find((x) => x.category === "exterior")?.url ||
                    v.images[0]?.url ||
                    "";
                  const href = `/cars/${v.brand.toLowerCase()}/${v.model.toLowerCase()}/${v.id}`;

                  return (
                    <th
                      key={v.id}
                      className="w-64 p-4 align-top bg-[#17181B] border-r border-[#2A2C30] relative group"
                    >
                      <button
                        onClick={() => handleRemove(v.id)}
                        className="absolute right-3 top-3 p-1 rounded-sm bg-[#1F2023] border border-[#2A2C30] text-[#9A9994] hover:text-[#B24A3C] transition-colors"
                        title="Remove vehicle"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="aspect-[16/10] overflow-hidden rounded-sm bg-[#0E0F11] mb-3">
                        {image ? (
                          <img
                            src={image}
                            alt={`${v.brand} ${v.model}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs text-[#616266] font-mono">
                            NO IMAGE
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-mono uppercase text-[#9A9994] block">
                        {v.brand}
                      </span>
                      <Link
                        href={href}
                        className="font-display text-xl font-bold text-[#EDEBE6] hover:text-[#E6C86E] block truncate"
                      >
                        {v.model}
                      </Link>
                      <span className="text-xs text-[#9A9994] block truncate">
                        {v.variantName}
                      </span>

                      <div className="font-mono-num text-lg font-bold text-[#C9A227] mt-2">
                        {formatPriceRange(v.priceMinLakh, v.priceMaxLakh)}
                      </div>
                    </th>
                  );
                })}

                {/* Add Vehicle Slot if < 4 */}
                {vehicles.length < 4 && (
                  <th className="w-64 p-6 align-middle bg-[#141518]/50 border-r border-[#2A2C30] text-center">
                    <div className="space-y-3">
                      <div className="mx-auto h-12 w-12 rounded-full border-2 border-dashed border-[#2A2C30] flex items-center justify-center text-[#9A9994]">
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold text-[#EDEBE6] block">
                        Add Model to Compare
                      </span>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddModalIndex(vehicles.length)}
                          className="w-full text-xs"
                        >
                          + Select Car
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={openMakeCompareModal}
                          className="w-full text-xs font-mono uppercase"
                        >
                          MAKE COMPARISON
                        </Button>
                      </div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            {/* TBODY SPEC SECTIONS */}
            <tbody className="divide-y divide-[#2A2C30]">
              {visibleSpecRows.map((section) => (
                <React.Fragment key={section.section}>
                  {/* SECTION HEADER ROW */}
                  <tr className="bg-[#1F2023]/60">
                    <td
                      colSpan={vehicles.length + (vehicles.length < 4 ? 2 : 1)}
                      className="py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider text-[#C9A227]"
                    >
                      {section.section}
                    </td>
                  </tr>

                  {/* SECTION ROWS */}
                  {section.rows.map((row) => {
                    const bestIdx = getBestIndex(row);

                    return (
                      <tr
                        key={row.key}
                        className="hover:bg-[#1A1C1E] transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-semibold text-[#9A9994] bg-[#141518] border-r border-[#2A2C30]">
                          {row.label}
                        </td>

                        {vehicles.map((v, idx) => {
                          const isBest = idx === bestIdx;
                          return (
                            <td
                              key={v.id}
                              className={`py-3 px-4 text-sm font-medium border-r border-[#2A2C30] ${
                                isBest
                                  ? "bg-[#2F6B54]/15 text-[#4EBA8E] font-semibold"
                                  : "text-[#EDEBE6]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{row.getValue(v)}</span>
                                {isBest && (
                                  <Badge
                                    variant="new"
                                    className="text-[10px] py-0 px-1.5 ml-2"
                                  >
                                    Best
                                  </Badge>
                                )}
                              </div>
                            </td>
                          );
                        })}

                        {vehicles.length < 4 && (
                          <td className="bg-[#141518]/30 border-r border-[#2A2C30]" />
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding Vehicle to Compare */}
      {addModalIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-md border border-[#2A2C30] bg-[#17181B] p-6 space-y-4 shadow-elevated">
            <div className="flex items-center justify-between border-b border-[#2A2C30] pb-3">
              <h3 className="font-display font-bold text-lg text-[#EDEBE6]">
                Select Vehicle to Add ({vehicles.length + 1}/4)
              </h3>
              <button
                onClick={() => setAddModalIndex(null)}
                className="text-[#9A9994] hover:text-[#EDEBE6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand or model (e.g. 'Toyota Corolla')..."
              className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#2F6B54] focus:outline-none"
              autoFocus
            />

            <div className="max-h-72 overflow-y-auto divide-y divide-[#2A2C30]">
              {availableToAdd
                .filter((cv) =>
                  `${cv.brand} ${cv.model} ${cv.variantName}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .slice(0, 10)
                .map((cv) => (
                  <div
                    key={cv.id}
                    onClick={() => handleAddVehicle(cv.id)}
                    className="flex items-center justify-between py-3 px-2 hover:bg-[#1F2023] rounded-sm cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-[#EDEBE6]">
                        {cv.brand} {cv.model}
                      </span>
                      <span className="text-xs text-[#9A9994] block">
                        {cv.variantName}
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      + Add
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Editorial "Make Comparison" Custom Builder Modal */}
      {isMakeCompareOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMakeCompareOpen(false);
          }}
        >
          <div className="w-full max-w-4xl rounded-sm border border-[#2A2C30] bg-[#141518] p-6 sm:p-8 space-y-6 shadow-elevated animate-in fade-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#2A2C30] pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227] mb-1">
                  <Scale className="h-3.5 w-3.5 text-[#C9A227]" />
                  <span>CUSTOM COMPARISON BUILDER</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-[#EDEBE6]">
                  Make Comparison
                </h3>
                <p className="text-xs font-mono text-[#9A9994] mt-1">
                  Select 2 to 4 Pakistani models to compare side by side across
                  ex-factory pricing, powertrains, warranties, and equipment.
                </p>
              </div>
              <button
                onClick={() => setIsMakeCompareOpen(false)}
                className="p-1 rounded-sm text-[#9A9994] hover:text-[#EDEBE6] hover:bg-[#1F2023] transition-colors"
                title="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Quick Benchmark Presets inside modal */}
            <div className="p-3 rounded-sm border border-[#2A2C30] bg-[#17181B] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9994] block">
                QUICK BENCHMARK PRESETS:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.ids}
                    onClick={() => {
                      setIsMakeCompareOpen(false);
                      router.push(`/compare?ids=${preset.ids}`);
                    }}
                    className="px-2.5 py-1 rounded-sm bg-[#1F2023] border border-[#2A2C30] hover:border-[#3E8A6C] text-xs font-mono font-medium text-[#EDEBE6] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Vehicle Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((slotIndex) => {
                const selectedId = makeCompareIds[slotIndex];
                const selectedVehicle = allCatalogVehicles.find(
                  (v) => v.id === selectedId
                );
                const isRequired = slotIndex < 2;
                const searchQuery = slotSearch[slotIndex] || "";
                const isDropdownOpen = activeSlotDropdown === slotIndex;

                const filteredCatalog = allCatalogVehicles.filter(
                  (cv) =>
                    `${cv.brand} ${cv.model} ${cv.variantName}`
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    !makeCompareIds.some(
                      (id, idx) => id === cv.id && idx !== slotIndex
                    )
                );

                return (
                  <div
                    key={slotIndex}
                    className={`p-4 rounded-sm border transition-colors ${
                      selectedVehicle
                        ? "border-[#3E8A6C] bg-[#17181B]"
                        : "border-[#2A2C30] bg-[#17181B]/60"
                    } relative flex flex-col justify-between min-h-[140px]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#9A9994]">
                        VEHICLE {slotIndex + 1}{" "}
                        <span
                          className={
                            isRequired ? "text-[#C9A227]" : "text-[#616266]"
                          }
                        >
                          {isRequired ? "(REQUIRED)" : "(OPTIONAL)"}
                        </span>
                      </span>
                      {selectedVehicle && (
                        <button
                          onClick={() => handleSlotRemove(slotIndex)}
                          className="text-[#9A9994] hover:text-[#B24A3C] transition-colors p-1"
                          title="Clear slot"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {selectedVehicle ? (
                      <div className="space-y-2 py-2">
                        <div>
                          <span className="text-xs font-mono uppercase text-[#C9A227] block">
                            {selectedVehicle.brand}
                          </span>
                          <span className="font-display font-bold text-lg text-[#EDEBE6] block leading-tight">
                            {selectedVehicle.model}
                          </span>
                          <span className="text-xs font-mono text-[#9A9994] block truncate">
                            {selectedVehicle.variantName}
                          </span>
                        </div>
                        {selectedVehicle.priceMinLakh !== undefined &&
                          selectedVehicle.priceMinLakh > 0 && (
                            <div className="text-xs font-mono-num font-semibold text-[#4EBA8E]">
                              {formatPriceRange(
                                selectedVehicle.priceMinLakh,
                                selectedVehicle.priceMaxLakh ||
                                  selectedVehicle.priceMinLakh
                              )}
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="relative my-auto">
                        <input
                          type="text"
                          value={searchQuery}
                          onFocus={() => setActiveSlotDropdown(slotIndex)}
                          onChange={(e) => {
                            setSlotSearch({
                              ...slotSearch,
                              [slotIndex]: e.target.value,
                            });
                            setActiveSlotDropdown(slotIndex);
                          }}
                          placeholder={`Search brand or model (e.g. Corolla)...`}
                          className="w-full h-10 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-xs font-mono text-[#EDEBE6] placeholder:text-[#616266] focus:border-[#2F6B54] focus:outline-none"
                        />

                        {isDropdownOpen && (
                          <div className="absolute top-11 left-0 right-0 z-50 max-h-56 overflow-y-auto rounded-sm border border-[#2A2C30] bg-[#141518] shadow-elevated divide-y divide-[#2A2C30]">
                            {filteredCatalog.length > 0 ? (
                              filteredCatalog.slice(0, 15).map((cv) => (
                                <div
                                  key={cv.id}
                                  onClick={() =>
                                    handleSlotSelect(slotIndex, cv.id)
                                  }
                                  className="flex items-center justify-between p-2.5 hover:bg-[#1F2023] cursor-pointer transition-colors"
                                >
                                  <div className="truncate pr-2">
                                    <span className="font-display font-semibold text-xs text-[#EDEBE6] block truncate">
                                      {cv.brand} {cv.model}
                                    </span>
                                    <span className="text-[11px] font-mono text-[#9A9994] block truncate">
                                      {cv.variantName}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-[#C9A227] shrink-0">
                                    SELECT
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-center text-xs font-mono text-[#9A9994]">
                                No vehicles found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Popular Models to Quick Add */}
            <div className="p-3 rounded-sm border border-[#2A2C30] bg-[#17181B] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9994] block">
                POPULAR MODELS TO ADD:
              </span>
              <div className="flex flex-wrap gap-2">
                {allCatalogVehicles
                  .filter((cv) =>
                    [
                      "toy-corolla-e170-2014-altis-grande",
                      "hon-civic-fe-15-oriel-2022",
                      "hyu-elantra",
                      "kia-sportage",
                      "hyu-tucson",
                      "suz-alto",
                      "suz-swift",
                    ].includes(cv.id)
                  )
                  .map((cv) => {
                    const isAlreadySelected = makeCompareIds.includes(cv.id);
                    return (
                      <button
                        key={cv.id}
                        disabled={isAlreadySelected}
                        onClick={() => handleQuickAdd(cv.id)}
                        className={`px-2.5 py-1 rounded-sm border text-xs font-mono transition-colors ${
                          isAlreadySelected
                            ? "bg-[#1F2023]/40 border-[#2A2C30] text-[#616266] cursor-not-allowed"
                            : "bg-[#1F2023] border-[#2A2C30] hover:border-[#3E8A6C] text-[#EDEBE6]"
                        }`}
                      >
                        + {cv.brand} {cv.model}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2A2C30] pt-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9A9994]">
                <span>SELECTED:</span>
                <span className="font-semibold text-[#EDEBE6]">
                  {makeCompareIds.filter(Boolean).length} / 4 VEHICLES
                </span>
                {makeCompareIds.filter(Boolean).length < 2 && (
                  <span className="text-[#B24A3C]">
                    (Select at least 2 models)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMakeCompareIds([])}
                  className="text-xs font-mono uppercase text-[#9A9994] hover:text-[#EDEBE6]"
                >
                  RESET SLOTS
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={makeCompareIds.filter(Boolean).length < 2}
                  onClick={handleMakeComparisonSubmit}
                  className="font-mono text-xs uppercase tracking-wider gap-2 px-6 bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6]"
                >
                  <Scale className="h-4 w-4" />
                  <span>
                    MAKE COMPARISON ({makeCompareIds.filter(Boolean).length})
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

