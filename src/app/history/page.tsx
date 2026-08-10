import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { EditorialHistoryView } from "@/components/history/EditorialHistoryView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pakistan Automotive History Timeline (1950s–2020s) | RASTA",
  description:
    "Explore 8 decades of Pakistan's automotive heritage: from early British and American imports to the Suzuki FX revolution, Corolla local assembly, and the crossover/EV era.",
};

export default async function HistoryPage() {
  const events = await prisma.historicalEvent.findMany({
    orderBy: {
      year: "asc",
    },
  });

  return <EditorialHistoryView events={events} />;
}
