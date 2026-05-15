"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { useProductStore } from "@/lib/store";

export function ProductGrid({ onManage }: { onManage?: () => void }) {
  const { inventory, setActiveProduct, isEditMode } = useProductStore();

  return (
    <section className="py-16 px-8 md:px-12 bg-[#050505]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="text-[10px] tracking-[0.25em] font-sans text-[#22D3EE] mb-3 uppercase font-semibold">
            Vector DB Indexed
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#F9F6EE] tracking-tight">
            Digital Inventory
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-zinc-700 font-mono text-[9px] tracking-widest uppercase text-right">
            {inventory.length} ASSETS ACTIVE<br/>
            SOVEREIGN SKU MGMT
          </div>
          {isEditMode && (
            <button
              onClick={onManage}
              className="flex items-center gap-2 bg-[#D4CAA3]/10 border border-[#D4CAA3]/30 hover:bg-[#D4CAA3]/20 text-[#D4CAA3] text-[10px] font-mono tracking-widest uppercase px-5 py-2.5 transition-all group"
            >
              Manage Inventory
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {inventory.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClickAudit={() => setActiveProduct(product.id)} 
          />
        ))}
      </div>
    </section>
  );
}
