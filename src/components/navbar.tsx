"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  Scale,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  History,
  ShieldAlert,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useFavorites } from "@/components/favorites-provider";
import { useCompare } from "@/components/compare-provider";
import { GlobalSearchModal } from "@/components/global-search-modal";

export interface NavbarProps {
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
  }>;
}

export function Navbar({ allVehicles }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { compared } = useCompare();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K or Cmd+K
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

  const navLinks = [
    { href: "/cars", label: "Cars & Discovery", icon: Car },
    { href: "/brands", label: "Brands", icon: Compass },
    { href: "/compare", label: "Compare", icon: Scale, badge: compared.length },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2C30] bg-[#0E0F11]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo area */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#2F6B54] text-[#EDEBE6] font-display font-bold text-xl shadow-subtle group-hover:bg-[#3E8A6C] transition-colors">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wider text-[#EDEBE6] group-hover:text-[#E6C86E] transition-colors leading-none">
                  RASTA
                </span>
                <span className="font-mono text-[10px] text-[#9A9994] uppercase tracking-widest leading-none mt-1">
                  Pakistan Auto
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#1F2023] text-[#EDEBE6] border border-[#3E8A6C]"
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

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-[#2A2C30] bg-[#17181B] px-3 py-1.5 text-xs text-[#9A9994] hover:border-[#3E8A6C] hover:text-[#EDEBE6] transition-colors shadow-subtle"
              aria-label="Search catalog"
            >
              <Search className="h-4 w-4 text-[#2F6B54]" />
              <span className="hidden sm:inline">Search cars, brands...</span>
              <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-[#2A2C30] bg-[#1F2023] px-1 font-mono text-[10px] text-[#616266]">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-sm border border-[#2A2C30] bg-[#17181B] text-[#9A9994] hover:border-[#3E8A6C] hover:text-[#EDEBE6] transition-colors"
              aria-label="Toggle theme"
              title="Toggle Dark / Light Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-[#E6C86E]" />
              ) : (
                <Moon className="h-4 w-4 text-[#2F6B54]" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-sm border border-[#2A2C30] bg-[#17181B] text-[#EDEBE6] md:hidden"
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

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#2A2C30] bg-[#17181B] p-4 space-y-3 animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-sm text-base font-medium ${
                      isActive
                        ? "bg-[#1F2023] text-[#EDEBE6] border-l-4 border-[#2F6B54]"
                        : "text-[#9A9994] hover:text-[#EDEBE6] hover:bg-[#1F2023]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#2F6B54]" />
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

            <div className="pt-3 border-t border-[#2A2C30] flex items-center justify-between">
              <span className="text-xs text-[#9A9994]">Theme Mode</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-[#E6C86E]" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-[#2F6B54]" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <GlobalSearchModal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        vehicles={allVehicles}
      />
    </>
  );
}
