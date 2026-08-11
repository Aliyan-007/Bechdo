import { z } from "zod";

// 1. Zod Schema for Brand
export const BrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  logoInitial: z.string().min(1, "Initial required").max(3, "Max 3 chars"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid #HEX color"),
  country: z.string().min(2, "Country required"),
  description: z.string().min(10, "Description must be at least 10 chars"),
  isPakistaniAssembled: z.boolean().default(true),
  parentCompany: z.string().optional(),
  logoUrl: z.string().optional(),
  officialWebsite: z.string().optional(),
  pakistanDistributor: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export type BrandInput = z.input<typeof BrandSchema>;
export type BrandFormInput = z.input<typeof BrandSchema>;

// 2. Zod Schema for Vehicle Variant
export const VehicleSchema = z.object({
  brandName: z.string().min(1, "Brand required"),
  modelName: z.string().min(1, "Model name required"),
  variantName: z.string().min(1, "Variant name required"),
  bodyType: z.string().min(1, "Body type required"),
  fuelType: z.string().min(1, "Fuel type required"),
  priceMinLakh: z.coerce.number().min(5, "Min price required"),
  priceMaxLakh: z.coerce.number().min(5, "Max price required"),
  badge: z.string().optional(),
  engine: z.string().min(2, "Engine required"),
  transmission: z.string().min(2, "Transmission required"),
  powerHp: z.coerce.number().min(20, "Horsepower required"),
  torqueNm: z.coerce.number().min(30, "Torque required"),
  seating: z.coerce.number().min(2, "Seating required"),
  mileageKmpl: z.coerce.number().optional(),
  airbags: z.coerce.number().min(0, "Airbags count required"),
  isFeatured: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isRecentlyAdded: z.boolean().default(true),
});

export type VehicleInput = z.infer<typeof VehicleSchema>;
export type VehicleFormInput = z.input<typeof VehicleSchema>;
