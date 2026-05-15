"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CinematicFrame } from "@/components/ui/CinematicFrame";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { Package, ChevronRight, Fingerprint, Trash2 } from "lucide-react";
import { useProductStore } from "@/lib/store";

export interface ProductType {
  id: string;
  name: string;
  hsn: string;
  image: string;
  materials: string[];
}

interface ProductCardProps {
  product: ProductType;
  onClickAudit: (hsn: string) => void;
}

export function ProductCard({ product, onClickAudit }: ProductCardProps) {
  const { isEditMode, deleteProduct } = useProductStore();
  const ref = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove ${product.name}?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer break-inside-avoid perspective-1000"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onClickAudit(product.hsn)}
    >
      <CinematicFrame className="h-[480px] border border-white/10 bg-[#0D0D0D] overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* Image Container */}
        <div className="relative h-[280px] w-full overflow-hidden border-b border-white/5 bg-[#111111]">
          {/* Delete Action Overlay */}
          {isEditMode && (
            <button 
              onClick={handleDelete}
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/40 transition-all group/del"
            >
              <Trash2 className="w-4 h-4 text-red-500/60 group-hover/del:text-white transition-colors" />
            </button>
          )}

          {/* Fallback placeholder shown when image fails or is missing */}
          {(imgError || !product.image || product.image === '/demo/placeholder.png') ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111111] to-[#0A0A0A]">
              <div className="w-16 h-16 border border-[#D4CAA3]/20 flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-[#D4CAA3]/30" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-700 uppercase">
                {product.name.split(" ").slice(0, 3).join(" ")}
              </span>
            </div>
          ) : (
            <motion.img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute top-4 left-4">
            <MonoLabel variant="gold" className="bg-black/90 backdrop-blur-md px-3 py-1 border border-[#D4CAA3]/20 text-[10px]">
              HSN {product.hsn}
            </MonoLabel>
          </div>
          
          <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/80 backdrop-blur-md border border-[#D4CAA3]/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ChevronRight className="w-5 h-5 text-[#D4CAA3]" />
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6 flex flex-col flex-1 justify-between relative">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4CAA3]/60">
              <Package className="w-3 h-3" />
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-bold">
                Digital Inventory
              </span>
            </div>
            <h3 className="text-xl font-serif text-[#F9F6EE] leading-tight group-hover:text-[#D4CAA3] transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="pt-4 mt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="w-3 h-3 text-[#D4CAA3]" />
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                Traceability Narrative
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {product.materials.slice(0, 4).map((mat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 overflow-hidden">
                  <div className="w-1 h-1 rounded-full bg-[#D4CAA3]/40 mt-1.5 shrink-0" />
                  <span className="text-[10px] text-zinc-400 font-light truncate">
                    {mat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CinematicFrame>
    </motion.div>
  );
}
