import React from "react";
import { cn } from "@/lib/utils";

interface MonoLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  label?: string;
  variant?: "gold" | "cyan" | "bone" | "muted";
}

export function MonoLabel({ 
  children, 
  label, 
  variant = "bone", 
  className,
  ...props 
}: MonoLabelProps) {
  const variants = {
    gold: "text-[#D4CAA3]",
    cyan: "text-[#22D3EE]",
    bone: "text-[#F9F6EE]",
    muted: "text-zinc-500",
  };

  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="text-[10px] font-sans tracking-[0.2em] text-zinc-500 uppercase font-medium">
          {label}
        </span>
      )}
      <span 
        className={cn(
          "font-mono text-xs tracking-wider",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    </div>
  );
}
