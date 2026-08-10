"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B54] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#2F6B54] text-[#EDEBE6] hover:bg-[#3E8A6C] shadow-subtle hover:shadow-medium",
        secondary:
          "bg-[#C9A227] text-[#0E0F11] hover:bg-[#D9B237] font-semibold shadow-subtle",
        outline:
          "border border-[#2A2C30] bg-transparent text-[var(--text)] hover:border-[#3E8A6C] hover:bg-[var(--surface-elevated)]",
        ghost:
          "bg-transparent text-[var(--text-dim)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]",
        danger:
          "bg-[#B24A3C] text-[#EDEBE6] hover:bg-[#C45B4D]",
        accent:
          "bg-[#E6C86E] text-[#0E0F11] hover:bg-[#F0D585] font-semibold",
        dark:
          "bg-[#17181B] text-[#EDEBE6] border border-[#2A2C30] hover:border-[#3E8A6C]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-sm",
        md: "h-10 px-4 text-sm rounded-sm",
        lg: "h-12 px-6 text-base rounded-md",
        icon: "h-9 w-9 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
