"use client";

import React, { useState, useMemo } from "react";
import { TrendingUp, Calendar, Filter, Info, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PriceHistoryPoint {
  id: string;
  label: string; // YYYY-MM
  year: number;
  month: number;
  value: number; // priceLakh
  inflationValue?: number | null;
  note?: string | null;
  variantName: string;
  modelName: string;
  brandName: string;
}

interface PriceHistoryChartProps {
  points: PriceHistoryPoint[];
  selectedBrand?: string;
}

export function PriceHistoryChart({
  points,
  selectedBrand = "",
}: PriceHistoryChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sortedPoints = useMemo(() => {
    let list = [...points];
    if (selectedBrand) {
      list = list.filter(
        (p) => p.brandName.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    list.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    return list;
  }, [points, selectedBrand]);

  const chartPoints = useMemo(() => {
    // If there are too many points for a single SVG line, we can sample or aggregate by Year-Month
    if (sortedPoints.length === 0) return [];

    // Group by YYYY-MM and take average value to draw a coherent market trend line
    const map = new Map<
      string,
      {
        label: string;
        year: number;
        month: number;
        valueSum: number;
        infSum: number;
        count: number;
        sampleNote: string;
        sampleVariant: string;
      }
    >();

    for (const p of sortedPoints) {
      const key = p.label;
      const existing = map.get(key);
      if (existing) {
        existing.valueSum += p.value;
        if (p.inflationValue) existing.infSum += p.inflationValue;
        existing.count += 1;
      } else {
        map.set(key, {
          label: p.label,
          year: p.year,
          month: p.month,
          valueSum: p.value,
          infSum: p.inflationValue || p.value,
          count: 1,
          sampleNote: p.note || `${p.brandName} ${p.modelName} ${p.variantName}`,
          sampleVariant: `${p.brandName} ${p.modelName}`,
        });
      }
    }

    const arr = Array.from(map.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return arr.map((item) => ({
      label: item.label,
      year: item.year,
      month: item.month,
      value: Math.round((item.valueSum / item.count) * 10) / 10,
      inflationValue: Math.round((item.infSum / item.count) * 10) / 10,
      count: item.count,
      note: item.sampleNote,
      context: item.sampleVariant,
    }));
  }, [sortedPoints]);

  if (chartPoints.length === 0) {
    return (
      <div className="rounded-sm border border-[#2A2C30] bg-[#141518] p-12 text-center space-y-3 font-mono">
        <TrendingUp className="h-8 w-8 text-[#9A9994] mx-auto opacity-50" />
        <p className="text-[#EDEBE6] font-bold">
          No historical price points available for this selection
        </p>
        <p className="text-xs text-[#9A9994]">
          Try selecting all manufacturers to view longitudinal Pakistan market pricing.
        </p>
      </div>
    );
  }

  const values = chartPoints.map((p) => p.value);
  const infValues = chartPoints.map((p) => p.inflationValue);
  const minVal = Math.max(0, Math.min(...values) * 0.9);
  const maxVal = Math.max(...values, ...infValues) * 1.05;

  const width = 800;
  const height = 340;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 50;

  const getX = (idx: number) => {
    if (chartPoints.length === 1) return padLeft + (width - padLeft - padRight) / 2;
    return (
      padLeft +
      (idx / (chartPoints.length - 1)) * (width - padLeft - padRight)
    );
  };

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    return (
      height -
      padBottom -
      ((val - minVal) / range) * (height - padTop - padBottom)
    );
  };

  const linePath = chartPoints
    .map((p, idx) => `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.value)}`)
    .join(" ");

  const inflationPath = chartPoints
    .map(
      (p, idx) =>
        `${idx === 0 ? "M" : "L"} ${getX(idx)} ${getY(p.inflationValue)}`
    )
    .join(" ");

  const areaPath = `${linePath} L ${getX(chartPoints.length - 1)} ${height - padBottom} L ${padLeft} ${height - padBottom} Z`;

  const hoveredData =
    hoveredIndex !== null ? chartPoints[hoveredIndex] : chartPoints[chartPoints.length - 1];

  return (
    <div className="rounded-sm border border-[#2A2C30] bg-[#17181B] p-6 space-y-6">
      {/* Chart Header Controls & Active Point Callout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2C30] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#4EBA8E]">
            <TrendingUp className="h-3.5 w-3.5 text-[#2F6B54]" />
            <span>EX-FACTORY BENCHMARK CURVE</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-[#EDEBE6]">
            Pakistan Automotive Price Chronicle (1950s–2026)
          </h3>
        </div>

        {hoveredData && (
          <div className="flex items-center gap-4 bg-[#1F2023] px-4 py-2.5 rounded-sm border border-[#2A2C30] font-mono shrink-0">
            <div>
              <span className="text-[10px] text-[#9A9994] uppercase block">
                PERIOD: {hoveredData.label}
              </span>
              <span className="font-bold text-[#C9A227] text-base">
                PKR {hoveredData.value} Lakh
              </span>
            </div>
            <div className="border-l border-[#2A2C30] pl-4">
              <span className="text-[10px] text-[#9A9994] uppercase block">
                2026 INFLATION ADJ.
              </span>
              <span className="font-bold text-[#4EBA8E] text-sm">
                ~PKR {hoveredData.inflationValue} Lakh
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="relative aspect-[16/7] w-full bg-[#0E0F11] rounded-sm border border-[#2A2C30] p-2 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padTop + pct * (height - padTop - padBottom);
            const val = Math.round(maxVal - pct * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#2A2C30"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  fill="#9A9994"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {val}L
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          <path d={areaPath} fill="rgba(47, 107, 84, 0.08)" />

          {/* Inflation Adjusted Line */}
          <path
            d={inflationPath}
            fill="none"
            stroke="#4EBA8E"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* Primary Ex-Factory Price Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#C9A227"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {chartPoints.map((p, idx) => {
            const x = getX(idx);
            const y = getY(p.value);
            const isHovered = hoveredIndex === idx;
            return (
              <g key={p.label}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : 4}
                  fill={isHovered ? "#EDEBE6" : "#C9A227"}
                  stroke="#0E0F11"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* X-axis labels (render subset to avoid overlap) */}
                {(idx % Math.max(1, Math.floor(chartPoints.length / 8)) === 0 ||
                  idx === chartPoints.length - 1) && (
                  <text
                    x={x}
                    y={height - padBottom + 20}
                    fill="#9A9994"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Context description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#9A9994] pt-2 border-t border-[#2A2C30]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-[#C9A227] inline-block" />
            <span className="text-[#EDEBE6] font-semibold">
              Ex-Factory Sticker Price (PKR Lakh)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-6 border-b border-dashed border-[#4EBA8E] inline-block" />
            <span>Inflation Adjusted (2026 PKR Benchmark)</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#616266]">
          <Info className="h-3.5 w-3.5" />
          <span>
            {hoveredData?.note || "Standard official assembler retail tariffs."}
          </span>
        </div>
      </div>
    </div>
  );
}
