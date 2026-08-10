import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#2F6B54] text-[#EDEBE6] border border-[#3E8A6C]/30",
        secondary:
          "bg-[#1F2023] text-[#9A9994] border border-[#2A2C30]",
        accent:
          "bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/40 font-semibold",
        danger:
          "bg-[#B24A3C]/20 text-[#E37A6D] border border-[#B24A3C]/40",
        outline:
          "text-[#EDEBE6] border border-[#2A2C30]",
        new:
          "bg-[#2F6B54]/20 text-[#4EBA8E] border border-[#2F6B54]/50 font-semibold",
        ev:
          "bg-[#3D7399]/20 text-[#6CB1E6] border border-[#3D7399]/50 font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
