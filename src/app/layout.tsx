import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/components/favorites-provider";
import { CompareProvider } from "@/components/compare-provider";
import { EditorialNavbar } from "@/components/editorial/EditorialNavbar";
import { EditorialFooter } from "@/components/editorial/EditorialFooter";
import { prisma } from "@/lib/prisma";

const fontDisplay = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const fontBody = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const fontNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BECH DO (بیچ دو) — New & Used Cars in Pakistan | Automotive Marketplace & Intelligence",
  description:
    "Pakistan's definitive automotive marketplace and intelligence platform. Track ex-factory prices, specifications, compare cars, and explore historical automotive data across 40 brands.",
  keywords: [
    "Pakistan Cars",
    "New Cars Pakistan",
    "Toyota Corolla Price Pakistan",
    "Honda Civic Price Pakistan",
    "Kia Sportage",
    "Car Comparison Pakistan",
    "Bech Do",
    "Bech Do Auto",
  ],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch vehicles for global search modal
  const rawVariants = await prisma.variant.findMany({
    select: {
      id: true,
      name: true,
      bodyType: true,
      fuelType: true,
      priceMinLakh: true,
      priceMaxLakh: true,
      badge: true,
      model: {
        select: {
          name: true,
          brand: {
            select: {
              name: true,
            },
          },
        },
      },
      aliases: {
        select: {
          alias: true,
        },
      },
      images: {
        select: {
          url: true,
          category: true,
        },
        take: 1,
      },
    },
    orderBy: {
      releaseYear: "desc" as const,
    },
  });

  const allVehicles = rawVariants.map((v: any) => ({
    id: v.id,
    brand: v.model.brand.name,
    model: v.model.name,
    variantName: v.name,
    bodyType: v.bodyType,
    fuelType: v.fuelType,
    priceMinLakh: v.priceMinLakh,
    priceMaxLakh: v.priceMaxLakh,
    badge: v.badge,
    aliases: v.aliases.map((a: any) => a.alias),
    image: v.images[0]?.url || null,
  }));

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable} ${fontNastaliq.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0E0F11] text-[#EDEBE6]">
        <ThemeProvider>
          <FavoritesProvider>
            <CompareProvider>
              <EditorialNavbar allVehicles={allVehicles} />
              <main className="flex-1 w-full">{children}</main>
              <EditorialFooter />
            </CompareProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
