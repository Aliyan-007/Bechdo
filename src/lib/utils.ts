import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceLakh(lakhs: number): string {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `PKR ${crores.toFixed(crores % 1 === 0 ? 0 : 2)} Crore`;
  }
  return `PKR ${lakhs} Lakh`;
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) {
    return formatPriceLakh(min);
  }
  if (min >= 100 && max >= 100) {
    return `PKR ${(min / 100).toFixed(2)} – ${(max / 100).toFixed(2)} Crore`;
  }
  return `PKR ${min} – ${max} Lakh`;
}
