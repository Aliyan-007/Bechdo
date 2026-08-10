"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Scale,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  History,
  Car,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, type Theme } from "@/components/theme-provider";
import { useCompare } from "@/components/compare-provider";
import { GlobalSearchModal } from "@/components/global-search-modal";

export interface EditorialNavbarProps {
  allVehicles: Array<{
    id: string;
    brand: string;
    model: string;
    variantName: string;
    bodyType: string;
    fuelType: string;
    priceMinLakh: number;
    priceMaxLakh: number;
    badge: string | null;
    aliases?: string[];
    image?: string | null;
  }>;
}

export function EditorialNavbar({ allVehicles }: EditorialNavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { compared } = useCompare();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Public product navigation ONLY (Admin & Favorites removed per Phase 10.1)
  const navLinks = [
    { href: "/cars", label: "CARS", icon: Car },
    { href: "/brands", label: "BRANDS", icon: Compass },
    { href: "/compare", label: "COMPARE", icon: Scale, badge: compared.length },
    { href: "/history", label: "HISTORY", icon: History },
    { href: "/price-history", label: "PRICE HISTORY", icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2C30] bg-[#0E0F11]/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Editorial Logo */}
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#2F6B54] text-[#EDEBE6] font-display font-bold text-xl group-hover:bg-[#3E8A6C] transition-colors">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wider text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors leading-none">
                  RASTA
                </span>
                <span className="font-mono text-[9px] text-[#9A9994] uppercase tracking-widest leading-none mt-1">
                  Pakistan Archive
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Editorial All-Caps Style — No Admin or Heart) */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-sm text-xs font-mono tracking-widest transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#1F2023] text-[#EDEBE6] border border-[#3E8A6C] font-bold"
                        : "text-[#9A9994] hover:text-[#EDEBE6] hover:bg-[#17181B]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A227] text-[10px] font-bold text-[#0E0F11]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Editorial Controls */}
          <div className="flex items-center gap-3">
            {/* Command Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-[#2A2C30] bg-[#17181B] px-3 py-1.5 text-xs text-[#9A9994] hover:border-[#C9A227] hover:text-[#EDEBE6] transition-colors min-h-[38px]"
              aria-label="Search catalog"
            >
              <Search className="h-4 w-4 text-[#C9A227]" />
              <span className="hidden sm:inline font-mono">SEARCH...</span>
              <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-[#2A2C30] bg-[#1F2023] px-1 font-mono text-[10px] text-[#616266]">
                ⌘K
              </kbd>
            </button>

            {/* 3-Mode Theme Selector (Light | Dark | System — Phase 10.1 Req 7-8) */}
            <div
              className="hidden sm:flex items-center rounded-sm border border-[#2A2C30] bg-[#141518] p-0.5 text-xs font-mono"
              role="group"
              aria-label="Theme mode switcher"
            >
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`px-2 py-1 rounded-sm transition-colors flex items-center gap-1 ${
                  theme === "dark"
                    ? "bg-[#1F2023] text-[#C9A227] font-bold shadow-subtle"
                    : "text-[#9A9994] hover:text-[#EDEBE6]"
                }`}
                title="Dark Mode (Showroom Archive)"
                aria-label="Switch to Dark theme"
              >
                <Moon className="h-3 w-3" />
                <span className="text-[10px]">DARK</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`px-2 py-1 rounded-sm transition-colors flex items-center gap-1 ${
                  theme === "light"
                    ? "bg-[#1F2023] text-[#C9A227] font-bold shadow-subtle"
                    : "text-[#9A9994] hover:text-[#EDEBE6]"
                }`}
                title="Light Mode (Printed Editorial Magazine)"
                aria-label="Switch to Light theme"
              >
                <Sun className="h-3 w-3" />
                <span className="text-[10px]">LIGHT</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`px-2 py-1 rounded-sm transition-colors flex items-center gap-1 ${
                  theme === "system"
                    ? "bg-[#1F2023] text-[#C9A227] font-bold shadow-subtle"
                    : "text-[#9A9994] hover:text-[#EDEBE6]"
                }`}
                title="System Default"
                aria-label="Switch to System theme preference"
              >
                <Laptop className="h-3 w-3" />
                <span className="text-[10px]">SYS</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-sm border border-[#2A2C30] bg-[#17181B] text-[#EDEBE6] md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer (Sheet/Drawer pattern — strictly public navigation) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2A2C30] bg-[#17181B] p-4 space-y-4 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1.5">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-sm text-sm font-mono tracking-widest min-h-[44px] ${
                      isActive
                        ? "bg-[#1F2023] text-[#EDEBE6] border-l-4 border-[#2F6B54] font-bold"
                        : "text-[#9A9994] hover:text-[#EDEBE6] hover:bg-[#1F2023]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#C9A227]" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-xs font-bold text-[#0E0F11]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme Selector */}
            <div className="pt-3 border-t border-[#2A2C30] space-y-2">
              <span className="text-xs font-mono uppercase text-[#9A9994] block">
                APPEARANCE MODE
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`py-2 px-3 rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 border min-h-[44px] ${
                    theme === "dark"
                      ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C] font-bold"
                      : "bg-[#141518] text-[#9A9994] border-[#2A2C30]"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>DARK</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`py-2 px-3 rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 border min-h-[44px] ${
                    theme === "light"
                      ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C] font-bold"
                      : "bg-[#141518] text-[#9A9994] border-[#2A2C30]"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>LIGHT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`py-2 px-3 rounded-sm text-xs font-mono flex items-center justify-center gap-1.5 border min-h-[44px] ${
                    theme === "system"
                      ? "bg-[#2F6B54] text-[#EDEBE6] border-[#3E8A6C] font-bold"
                      : "bg-[#141518] text-[#9A9994] border-[#2A2C30]"
                  }`}
                >
                  <Laptop className="h-3.5 w-3.5" />
                  <span>SYSTEM</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Modal */}
      <GlobalSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        vehicles={allVehicles}
      />
    </>
  );
}
