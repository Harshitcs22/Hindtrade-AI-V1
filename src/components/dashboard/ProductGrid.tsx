"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { useProductStore } from "@/lib/store";
import { HsnAuditVaultModal } from "./HsnAuditVaultModal";

export function ProductGrid({ onManage, onEditInit }: { onManage?: () => void; onEditInit?: (product: any) => void }) {
  const { firmDetails, setActiveProduct, isEditMode, inventory, fetchProducts } = useProductStore();
  
  // Local state to manage HSN Audit visual ledger modal
  const [selectedAuditProduct, setSelectedAuditProduct] = useState<any | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  React.useEffect(() => {
    if (firmDetails?.id) {
      fetchProducts(firmDetails.id);
    }
  }, [firmDetails?.id, fetchProducts]);

  // Bind directly to inventory or fallback to firmDetails.products
  const products = inventory && inventory.length > 0 ? inventory : (firmDetails.products || []);
  const isEmpty = !products || products.length === 0;

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
            {products.length} ASSETS ACTIVE<br/>
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

      {/* ── EMPTY STATE ─────────────────────────────────────────────────── */}
      {isEmpty ? (
        <div className="border-2 border-dashed border-white/5 rounded-lg p-12 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-sm font-mono text-zinc-600 tracking-[0.15em]">
              // NO ACTIVE ASSETS INGESTED IN LOGISTICS TERMINAL
            </div>
            <div className="text-xs text-zinc-700 mt-2">
              {isEditMode ? "Click 'Manage Inventory' to add products" : "No products available yet"}
            </div>
          </div>
        </div>
      ) : (
        /* ── DYNAMIC PRODUCT GRID ────────────────────────────────────────── */
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{
                  type: "spring",
                  damping: 24,
                  stiffness: 200,
                  delay: idx * 0.05,
                }}
              >
                <ProductCard
                  product={product}
                  onClickAudit={() => setActiveProduct(product.id)}
                  onSeeHsnAudit={(prod) => {
                    setSelectedAuditProduct(prod);
                    setIsAuditModalOpen(true);
                  }}
                  onEditInit={onEditInit}
                />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* ── HSN AUDIT VAULT MODAL ────────────────────────────────────────── */}
      <HsnAuditVaultModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
          setSelectedAuditProduct(null);
        }}
        product={selectedAuditProduct}
      />
    </section>
  );
}
