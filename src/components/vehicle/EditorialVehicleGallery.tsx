"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Image as ImageIcon,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface GalleryImageItem {
  id?: string;
  url: string;
  category: string;
  caption?: string | null;
  isPrimary?: boolean;
  altText?: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;
  imageMatchLevel?: string | null;
  verificationStatus?: string | null;
  copyrightNotice?: string | null;
}

interface EditorialVehicleGalleryProps {
  images: GalleryImageItem[];
  brandName: string;
  modelName: string;
  variantName: string;
  badge?: string | null;
}

export function EditorialVehicleGallery({
  images,
  brandName,
  modelName,
  variantName,
  badge,
}: EditorialVehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Guarantee we have at least one valid image object
  const validImages =
    images && images.length > 0
      ? images
      : [
          {
            id: "fallback-0",
            url: "",
            category: "exterior",
            caption: "Exterior illustration pending",
          },
        ];

  const currentImage = validImages[activeIndex] || validImages[0];
  const isPlaceholder = currentImage.url.startsWith("data:");

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [validImages.length]);

  // Keyboard navigation for arrow keys & escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext, isFullscreen]);

  // Handle touch swipe navigation
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="space-y-4">
      {/* Primary Hero Image Container (Zero-Box Editorial Presentation) */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-[#0E0F11] rounded-sm border border-[#2A2C30] group select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {currentImage.url ? (
          <img
            src={currentImage.url}
            alt={
              currentImage.altText ||
              `${brandName} ${modelName} — ${currentImage.category.toUpperCase()}`
            }
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.startsWith("data:")) {
                target.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'><rect width='800' height='500' fill='%23141518'/><text x='50%' y='50%' fill='%239A9994' font-family='monospace' font-size='14' text-anchor='middle'>OFFICIAL ASSET PENDING</text></svg>";
              }
            }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#9A9994] font-mono text-xs">
            NO GALLERY IMAGE
          </div>
        )}

        {/* Top Badges & Category */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <Badge
            variant="secondary"
            className="uppercase font-semibold font-mono text-[10px] bg-[#141518]/90 border border-[#2A2C30] text-[#EDEBE6]"
          >
            {currentImage.category}
          </Badge>
          {badge && (
            <Badge
              variant={badge === "New" ? "new" : "default"}
              className="font-mono text-[10px]"
            >
              {badge}
            </Badge>
          )}
        </div>

        {/* Fullscreen Expansion Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-2 rounded-sm bg-[#141518]/80 border border-[#2A2C30] text-[#EDEBE6] hover:bg-[#1F2023] hover:border-[#C9A227] transition-colors z-10"
          title="Open fullscreen lightbox (or press F)"
          aria-label="Open fullscreen gallery view"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Previous / Next Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-sm bg-[#141518]/80 border border-[#2A2C30] text-[#EDEBE6] hover:bg-[#1F2023] hover:border-[#C9A227] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Previous image"
              title="Previous image (← Arrow key)"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-sm bg-[#141518]/80 border border-[#2A2C30] text-[#EDEBE6] hover:bg-[#1F2023] hover:border-[#C9A227] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Next image"
              title="Next image (→ Arrow key)"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Editorial Caption Bar & Placeholder Badging */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-8 flex items-end justify-between pointer-events-none">
          <div>
            <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-widest block">
              {currentImage.sourceName
                ? `SOURCE: ${currentImage.sourceName.toUpperCase()} • FIG. ${String(
                    activeIndex + 1
                  ).padStart(2, "0")}`
                : `FIGURE ${String(activeIndex + 1).padStart(2, "0")} OF ${String(
                    validImages.length
                  ).padStart(2, "0")} — ARCHIVE PHOTO PLATE`}
            </span>
            <p className="text-xs font-mono text-[#EDEBE6] truncate max-w-lg mt-0.5">
              {currentImage.caption ||
                `${brandName} ${modelName} ${variantName} (${currentImage.category.toUpperCase()})`}
            </p>
          </div>

          {isPlaceholder && (
            <div className="bg-black/90 px-3 py-1 rounded-sm text-xs font-mono text-[#9A9994] flex items-center gap-1.5 border border-[#2A2C30]">
              <ImageIcon className="h-3.5 w-3.5 text-[#E6C86E]" />
              <span>Illustrative placeholder — Official photography pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-[16/10] rounded-sm overflow-hidden border transition-all ${
                  isSelected
                    ? "border-[#C9A227] ring-1 ring-[#C9A227] opacity-100"
                    : "border-[#2A2C30] opacity-60 hover:opacity-100 hover:border-[#9A9994]"
                }`}
              >
                {img.url ? (
                  <img
                    src={img.url}
                    alt={img.category}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-[#141518] flex items-center justify-center text-[10px] font-mono text-[#616266]">
                    {img.category}
                  </div>
                )}
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono uppercase text-[#EDEBE6]">
                  {img.category}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#2A2C30] pb-4">
            <div>
              <span className="text-xs font-mono uppercase text-[#C9A227] tracking-widest block">
                {brandName} {modelName} ARCHIVE PLATE
              </span>
              <span className="font-display font-bold text-lg text-[#EDEBE6]">
                {variantName} — {currentImage.category.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-sm bg-[#141518] border border-[#2A2C30] text-[#EDEBE6] hover:bg-[#1F2023] transition-colors"
              title="Close fullscreen view (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lightbox Center Image */}
          <div className="flex-1 flex items-center justify-center relative py-4 overflow-hidden">
            {currentImage.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.category}
                className="max-h-full max-w-full object-contain rounded-sm"
              />
            ) : (
              <div className="text-sm font-mono text-[#9A9994]">
                NO GALLERY IMAGE
              </div>
            )}

            {/* Navigation Left / Right Arrows in Lightbox */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 p-3 rounded-sm bg-black/70 border border-[#2A2C30] text-[#EDEBE6] hover:bg-black/90 hover:border-[#C9A227] transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-sm bg-black/70 border border-[#2A2C30] text-[#EDEBE6] hover:bg-black/90 hover:border-[#C9A227] transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Bar Caption & Attribution */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#2A2C30] pt-4 text-xs font-mono">
            <div>
              <span className="text-[#9A9994] block">
                {currentImage.caption ||
                  `${brandName} ${modelName} ${variantName} (${currentImage.category.toUpperCase()})`}
              </span>
              <span className="text-[#616266] block text-[11px] mt-0.5">
                {currentImage.copyrightNotice ||
                  "© 2026 RASTA Automotive Archive • Official Assembler Material"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C9A227]">
                {activeIndex + 1} of {validImages.length}
              </span>
              {isPlaceholder && (
                <span className="bg-[#17181B] px-2 py-1 rounded border border-[#2A2C30] text-[#9A9994]">
                  Illustrative SVG
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
