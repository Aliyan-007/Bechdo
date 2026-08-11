"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Car,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Gauge,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SellBrand {
  name: string;
  models: {
    name: string;
    variants: {
      id: string;
      name: string;
      priceMinLakh: number;
      priceMaxLakh: number;
    }[];
  }[];
}

export interface ExistingListing {
  id: string;
  brand: string;
  model: string;
  variant: string;
  registrationYear: number;
  priceLakh: number;
  mileageKm: number;
  location: string;
  grade: string;
  notes: string;
}

interface EditorialSellViewProps {
  brands: SellBrand[];
  initialListings: ExistingListing[];
}

export function EditorialSellView({
  brands,
  initialListings,
}: EditorialSellViewProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [regYear, setRegYear] = useState<string>("2024");
  const [city, setCity] = useState<string>("Karachi");
  const [mileage, setMileage] = useState<string>("25000");
  const [priceLakh, setPriceLakh] = useState<string>("");
  const [conditionGrade, setConditionGrade] = useState<string>("A+");
  const [sellerNotes, setSellerNotes] = useState<string>("");
  const [submittedListings, setSubmittedListings] = useState<ExistingListing[]>(
    []
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Available Models for Selected Brand
  const availableModels = useMemo(() => {
    const b = brands.find((x) => x.name === selectedBrand);
    return b ? b.models : [];
  }, [selectedBrand, brands]);

  // Available Variants for Selected Model
  const availableVariants = useMemo(() => {
    const m = availableModels.find((x) => x.name === selectedModel);
    return m ? m.variants : [];
  }, [selectedModel, availableModels]);

  // Selected Variant Data
  const variantData = useMemo(() => {
    return availableVariants.find((v) => v.id === selectedVariant) || null;
  }, [selectedVariant, availableVariants]);

  // Valuation Calculation
  const estimatedMarketValue = useMemo(() => {
    if (!variantData) return null;
    const base = (variantData.priceMinLakh + variantData.priceMaxLakh) / 2;
    const yearDiff = 2026 - parseInt(regYear || "2024", 10);
    const depFactor = Math.max(0.65, 1 - yearDiff * 0.08);
    const est = base * depFactor;
    return {
      low: Math.round(est * 0.95),
      high: Math.round(est * 1.05),
      exFactory: base,
    };
  }, [variantData, regYear]);

  const handleSubmitAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand || !selectedModel || !selectedVariant || !priceLakh) {
      alert("Please select brand, model, variant, and asking price.");
      return;
    }

    const newListing: ExistingListing = {
      id: `custom-${Date.now()}`,
      brand: selectedBrand,
      model: selectedModel,
      variant: variantData ? variantData.name : selectedVariant,
      registrationYear: parseInt(regYear, 10) || 2024,
      priceLakh: parseFloat(priceLakh) || 50,
      mileageKm: parseInt(mileage, 10) || 10000,
      location: city,
      grade: conditionGrade,
      notes: sellerNotes || "Verified private seller listing on BECH DO.",
    };

    setSubmittedListings((prev) => [newListing, ...prev]);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const allListings = [...submittedListings, ...initialListings];

  return (
    <div className="min-h-screen bg-[#0E0F11] pb-20">
      {/* Header Banner */}
      <section className="border-b border-[#2A2C30] bg-[#141518] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C9A227]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SECONDARY MARKETPLACE • CERTIFIED VALUATION</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#EDEBE6] tracking-tight">
              Sell Your Car on BECH DO
            </h1>
            <p className="text-sm sm:text-base text-[#9A9994] font-mono leading-relaxed">
              List your vehicle across Karachi, Lahore, Islamabad, and nationwide.
              Compare your asking price against verified ex-factory historical benchmarks
              and reach serious Pakistani buyers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Interactive Sell Car & Valuation Form */}
          <div className="lg:col-span-7">
            <div className="rounded-sm border border-[#2A2C30] bg-[#141518] p-6 sm:p-8 space-y-6">
              <div className="border-b border-[#2A2C30] pb-4">
                <h2 className="font-display text-2xl font-bold text-[#EDEBE6]">
                  Vehicle Details &amp; Pricing
                </h2>
                <p className="text-xs font-mono text-[#9A9994]">
                  Select your vehicle to generate an instant market valuation estimate.
                </p>
              </div>

              {showSuccess && (
                <div className="p-4 rounded-sm bg-[#2F6B54]/20 border border-[#2F6B54] text-sm text-[#4EBA8E] font-mono flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    Your vehicle listing has been published to the active BECH DO marketplace feed!
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmitAd} className="space-y-5">
                {/* Brand & Model Select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Brand / Manufacturer *
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setSelectedModel("");
                        setSelectedVariant("");
                      }}
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                      required
                    >
                      <option value="">Select Manufacturer</option>
                      {brands.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Model *
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => {
                        setSelectedModel(e.target.value);
                        setSelectedVariant("");
                      }}
                      disabled={!selectedBrand}
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none disabled:opacity-50"
                      required
                    >
                      <option value="">Select Model</option>
                      {availableModels.map((m) => (
                        <option key={m.name} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Variant Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#9A9994]">
                    Trim / Variant *
                  </label>
                  <select
                    value={selectedVariant}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    disabled={!selectedModel}
                    className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none disabled:opacity-50"
                    required
                  >
                    <option value="">Select Specific Trim Variant</option>
                    {availableVariants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} (PKR {v.priceMinLakh} – {v.priceMaxLakh} Lakh)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instant Valuation Benchmark Box */}
                {estimatedMarketValue && (
                  <div className="p-4 rounded-sm border border-[#C9A227]/40 bg-[#C9A227]/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-[#C9A227]">
                        BECH DO MARKET VALUATION ESTIMATE
                      </span>
                      <ShieldCheck className="h-4 w-4 text-[#C9A227]" />
                    </div>
                    <div className="font-mono-num text-2xl font-bold text-[#EDEBE6]">
                      PKR {estimatedMarketValue.low} – {estimatedMarketValue.high} Lakh
                    </div>
                    <p className="text-xs font-mono text-[#9A9994]">
                      Based on current ex-factory benchmark of PKR{" "}
                      {estimatedMarketValue.exFactory} Lakh and {regYear}{" "}
                      depreciation profile in Pakistan.
                    </p>
                  </div>
                )}

                {/* Registration Year, City, Mileage */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Reg. Year
                    </label>
                    <select
                      value={regYear}
                      onChange={(e) => setRegYear(e.target.value)}
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                    >
                      {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"].map(
                        (y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      City / Location
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                    >
                      {[
                        "Karachi",
                        "Lahore",
                        "Islamabad",
                        "Rawalpindi",
                        "Peshawar",
                        "Faisalabad",
                        "Multan",
                        "Gujranwala",
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Mileage (KM)
                    </label>
                    <input
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="e.g. 25000"
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Asking Price & Condition Grade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Asking Price (Lakh PKR) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={priceLakh}
                      onChange={(e) => setPriceLakh(e.target.value)}
                      placeholder="e.g. 68.5"
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[#9A9994]">
                      Inspection Grade
                    </label>
                    <select
                      value={conditionGrade}
                      onChange={(e) => setConditionGrade(e.target.value)}
                      className="w-full h-11 rounded-sm border border-[#2A2C30] bg-[#0E0F11] px-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                    >
                      <option value="A+">Grade A+ (100% Original, Scratchless)</option>
                      <option value="A">Grade A (Minor Bumper Touchup)</option>
                      <option value="B">Grade B (Average Factory Condition)</option>
                      <option value="C">Grade C (Repainted Panels)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#9A9994]">
                    Seller Comments &amp; Ownership Details
                  </label>
                  <textarea
                    rows={3}
                    value={sellerNotes}
                    onChange={(e) => setSellerNotes(e.target.value)}
                    placeholder="State ownership history, token tax status, maintenance records, and contact details..."
                    className="w-full rounded-sm border border-[#2A2C30] bg-[#0E0F11] p-3 text-sm text-[#EDEBE6] focus:border-[#C9A227] focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full font-display font-bold text-sm uppercase bg-[#2F6B54] hover:bg-[#3E8A6C] text-[#EDEBE6] min-h-[44px]"
                >
                  <span>PUBLISH CAR LISTING</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Right: Active Secondary Classifieds Feed */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between border-b border-[#2A2C30] pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#EDEBE6]">
                  Active Classifieds ({allListings.length})
                </h3>
                <span className="text-xs font-mono text-[#9A9994]">
                  REAL-TIME PAKISTANI USED INVENTORY
                </span>
              </div>
              <Link
                href="/cars"
                className="text-xs font-mono text-[#C9A227] hover:underline uppercase"
              >
                VIEW CATALOG →
              </Link>
            </div>

            <div className="space-y-4">
              {allListings.slice(0, 8).map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-sm border border-[#2A2C30] bg-[#141518] hover:border-[#C9A227] transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#C9A227] uppercase block">
                        {ad.location} • REG. {ad.registrationYear}
                      </span>
                      <h4 className="font-display font-bold text-base text-[#EDEBE6]">
                        {ad.brand} {ad.model} {ad.variant}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1F2023] border border-[#2A2C30] text-[#4EBA8E]">
                      GRADE {ad.grade}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2C30]/50 text-xs font-mono">
                    <span className="font-bold text-base text-[#C9A227]">
                      PKR {ad.priceLakh} Lakh
                    </span>
                    <span className="text-[#9A9994]">
                      {ad.mileageKm.toLocaleString()} km
                    </span>
                  </div>

                  {ad.notes && (
                    <p className="text-xs font-mono text-[#9A9994] line-clamp-1">
                      {ad.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
