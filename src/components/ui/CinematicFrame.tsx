import React from "react";
import { cn } from "@/lib/utils";

interface CinematicFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  overlayClassName?: string;
  withGlow?: boolean;
}

export function CinematicFrame({ 
  children, 
  className, 
  overlayClassName,
  withGlow = true,
  ...props 
}: CinematicFrameProps) {
  return (
    <div className={cn("relative overflow-hidden group", className)} {...props}>
      {/* Base Content */}
      {children}

      {/* Grain/Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Luxury Gradient Overlay */}
      <div className={cn(
        "absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent",
        overlayClassName
      )} />

      {/* Subtle Glow Effect */}
      {withGlow && (
        <div className="absolute -inset-px bg-gradient-to-r from-[#D4CAA3]/0 via-[#D4CAA3]/10 to-[#D4CAA3]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      )}
    </div>
  );
}
