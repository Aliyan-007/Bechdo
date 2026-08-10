"use client";

import React, { useMemo } from "react";

export interface PriceHistoryPoint {
  label: string;
  value: number;
  priceType?: string;
  currency?: string;
  note?: string | null;
}

interface PriceHistoryChartProps {
  points: PriceHistoryPoint[];
  currency?: string;
}

function formatPriceLakh(value: number) {
  if (value >= 100) {
    const crores = value / 100;
    return `PKR ${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crore`;
  }
  return `PKR ${value.toFixed(value % 1 === 0 ? 0 : 2)} Lakh`;
}

export function PriceHistoryChart({ points, currency = "PKR" }: PriceHistoryChartProps) {
  const data = useMemo(
    () => points.filter((point) => Number.isFinite(point.value)),
    [points]
  );

  const hasData = data.length > 0;

  const chartData = useMemo(() => {
    if (!hasData) {
      return null;
    }

    const values = data.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || Math.max(1, max * 0.1);
    const paddingX = 48;
    const paddingY = 34;
    const width = 620;
    const height = 240;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingY * 2;

    const pointsWithCoordinates = data.map((point, index) => {
      const x = paddingX + (innerWidth * index) / Math.max(data.length - 1, 1);
      const y = paddingY + ((max - point.value) / range) * innerHeight;
      return { ...point, x, y };
    });

    const path = pointsWithCoordinates
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map((fraction) => {
      const y = paddingY + innerHeight * fraction;
      const value = max - range * fraction;
      return { y, label: formatPriceLakh(value) };
    });

    return {
      width,
      height,
      paddingX,
      paddingY,
      points: pointsWithCoordinates,
      path,
      gridLines,
      min,
      max,
      range,
    };
  }, [data, hasData]);

  const latest = hasData ? data[data.length - 1] : undefined;
  const first = hasData ? data[0] : undefined;
  const rateChange = hasData && first && latest ? (((latest.value - first.value) / first.value) * 100).toFixed(1) : "0";
  const isPositive = Number(rateChange) >= 0;

  return (
    <div className="space-y-4 text-[#EDEBE6]">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-[#616266]">
            Price Trend
          </p>
          <h4 className="font-display text-xl font-bold text-[#EDEBE6]">
            {hasData && latest ? formatPriceLakh(latest.value) : "No price history yet"}
          </h4>
          {hasData && first && latest && (
            <p className="text-sm font-mono text-[#9A9994]">
              From {formatPriceLakh(first.value)} to {formatPriceLakh(latest.value)} ({isPositive ? "+" : ""}{rateChange}% since first documented price)
            </p>
          )}
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold ${
            isPositive ? "bg-[#2F6B54]/15 text-[#4EBA8E]" : "bg-[#B24A3C]/15 text-[#E37A6D]"
          }`}>
            {isPositive ? "↑" : "↓"} {rateChange}%
          </span>
        </div>
      </div>

      {hasData && chartData ? (
        <div className="rounded-sm border border-[#2A2C30] bg-[#121314] p-4">
          <svg
            viewBox={`0 0 ${chartData.width} ${chartData.height}`}
            className="w-full h-[280px]"
          >
            <rect x="0" y="0" width={chartData.width} height={chartData.height} fill="#121314" />
            {chartData.gridLines.map((line, index) => (
              <g key={index}>
                <line
                  x1={chartData.width - chartData.width + chartData.paddingX}
                  y1={line.y}
                  x2={chartData.width - chartData.paddingX}
                  y2={line.y}
                  stroke="#2A2C30"
                  strokeWidth="1"
                />
                <text
                  x={chartData.paddingX - 8}
                  y={line.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#9A9994"
                  fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                >
                  {line.label}
                </text>
              </g>
            ))}
            <path
              d={chartData.path}
              fill="none"
              stroke="#C9A227"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`${chartData.path} L ${chartData.points[chartData.points.length - 1].x} ${chartData.height - chartData.paddingY} L ${chartData.points[0].x} ${chartData.height - chartData.paddingY} Z`}
              fill="rgba(201, 162, 39, 0.12)"
            />
            {chartData.points.map((point, index) => (
              <g key={index}>
                <circle cx={point.x} cy={point.y} r="4" fill="#C9A227" stroke="#141518" strokeWidth="2" />
              </g>
            ))}
            {chartData.points.map((point, index) => (
              <text
                key={`label-${index}`}
                x={point.x}
                y={chartData.height - 12}
                textAnchor="middle"
                fontSize="8"
                fill="#9A9994"
                fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              >
                {point.label}
              </text>
            ))}
          </svg>
        </div>
      ) : (
        <div className="rounded-sm border border-[#2A2C30] bg-[#121314] p-6 text-sm text-[#9A9994]">
          No historical price data is available yet.
        </div>
      )}
    </div>
  );
}
