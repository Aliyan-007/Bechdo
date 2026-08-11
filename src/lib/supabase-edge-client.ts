/**
 * BECH DO (بیچ دو) — SUPABASE DIRECT EDGE / SERVERLESS CLIENT
 *
 * Use this module if you are building Cloudflare Workers, Edge Functions, or
 * serverless lambdas and wish to query Supabase PostgreSQL directly over HTTP
 * via `@supabase/supabase-js` without bundling the Prisma Rust query engine.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Helper to initialize a stateless Supabase HTTP client
export function getSupabaseEdgeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Example: Fetch all active Pakistani CKD variants directly from Supabase
 * without using Prisma ORM.
 */
export async function getVariantsDirectFromSupabase(limit = 20) {
  const supabase = getSupabaseEdgeClient();
  if (!supabase) {
    throw new Error(
      "Supabase URL or Anon Key missing in environment variables."
    );
  }

  const { data, error } = await supabase
    .from("Variant")
    .select(
      `
      id,
      name,
      slug,
      priceMinLakh,
      priceMaxLakh,
      marketStatus,
      Model!inner (
        name,
        slug,
        Brand!inner (
          name,
          slug,
          color
        )
      )
    `
    )
    .eq("marketStatus", "LOCAL_CKD")
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Example: Fetch active secondary marketplace classifieds by city directly from Supabase
 */
export async function getUsedListingsByCityDirect(city = "Karachi") {
  const supabase = getSupabaseEdgeClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("UsedListing")
    .select(
      `
      id,
      title,
      askingPriceLakh,
      mileageKm,
      registrationYear,
      registrationCity,
      inspectionGrade,
      sellerName,
      sellerPhone,
      location
    `
    )
    .eq("status", "ACTIVE")
    .eq("registrationCity", city)
    .order("askingPriceLakh", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Supabase direct query error:", error);
    return [];
  }

  return data;
}
