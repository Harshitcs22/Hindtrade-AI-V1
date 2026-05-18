'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductAsset } from '@/components/sections/showcase/types';
import { ProductCard } from "../../dashboard/ProductCard";
import { HsnAuditVaultModal } from "../../dashboard/HsnAuditVaultModal";
import { ProductStoryModal } from "../../dashboard/ProductStoryModal";
import { useProductStore } from '@/lib/store';

interface InventoryCardGridProps {
  products: ProductAsset[];
}

export const InventoryCardGrid: React.FC<InventoryCardGridProps> = ({ products }) => {
  const router = useRouter();

  // ─── ZUSTAND STORE HOOKS - Connect to actual store methods ────
  const setActiveProduct = useProductStore((state: any) => state.setActiveProduct);
  const deleteProduct = useProductStore((state: any) => state.deleteProduct);
  const isEditMode = useProductStore((state: any) => state.isEditMode);
  const toggleEditMode = useProductStore((state: any) => state.toggleEditMode);

  // ─── LOCAL STATE - For modal management (not in global store) ────
  const [selectedAuditProduct, setSelectedAuditProduct] = useState<any | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  if (products.length === 0) {
    return (
      <div className="w-full border border-dashed border-zinc-800 rounded-2xl py-24 text-center space-y-4 bg-zinc-950/20 backdrop-blur-md">
        <div className="text-3xl text-zinc-600 font-serif">📭</div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-bold">
          No Operational Asset Mapped
        </p>
      </div>
    );
  }

  /**
   * BUTTON HANDLER 1: Card Click - Opens ProductStoryModal with product journey & telemetry
   * This is the CARD CLICK action - shows origin, supply chain, and available actions
   */
  const handleClickAudit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Set active product in Zustand - ProductStoryModal watches this
      if (setActiveProduct) {
        setActiveProduct(productId);
      }
      console.log('✓ Product story modal opened for:', productId, product.name);
    }
  };

  /**
   * BUTTON HANDLER 2: "EDIT SKU ASSET ✎" - Navigate to inventory management workspace
   * Only visible when isEditMode === true
   * Redirects to /dashboard/inventory/manage?id=productId for full edit workflow
   */
  const handleEditInit = (product: any) => {
    console.log('✓ Redirecting to edit workspace for:', product.id, product.name);
    // Navigate to the manage page with product ID as query param
    router.push(`/dashboard/inventory/manage?id=${product.id}`);
  };

  /**
   * BUTTON HANDLER 3: Delete Product (Trash Icon)
   * Only visible when isEditMode === true
   * Shows confirmation dialog and deletes from Supabase via Zustand
   */
  const handleDeleteProduct = async (product: any) => {
    if (!product.id) {
      console.error("Aborting deletion: Execution context missing valid target UUID token.");
      return;
    }

    const confirmed = confirm(
      `SOVEREIGN PROTOCOL: PERMANENT ASSET DECOMMISSIONING\n\n` +
      `You are about to remove ${product.name?.toUpperCase()} (HSN: ${product.hsn}) from the active digital inventory.\n\n` +
      `THIS ACTION IS IRREVERSIBLE AND WILL BE LOGGED ON THE INSTITUTIONAL LEDGER.\n\n` +
      `Proceed with decommissioning?`
    );

    if (confirmed) {
      try {
        if (deleteProduct) {
          await deleteProduct(product.id);
          console.log('✓ Product deleted successfully:', product.id);
        }
      } catch (err) {
        console.error('✗ Delete failed:', err);
      }
    }
  };

  /**
   * BUTTON HANDLER 4: "SEE HSN AUDIT FOR THIS PRODUCT" - Opens HSN audit vault modal
   * This is the PRIMARY ACTIVE BUTTON that triggers the real compliance vault
   * Always visible (public and admin modes)
   */
  const handleSeeHsnAudit = (product: any) => {
    const adaptedPayload = {
      ...product,
      hsn_code: product.hsn || product.hsn_code,
      image_url: product.image || product.image_url,
      product_name: product.name || product.product_name,
      hsn: product.hsn || product.hsn_code,
      name: product.name || product.product_name,
    };
    
    // Set active product in global store for dashboard sync
    if (setActiveProduct) {
      setActiveProduct(product.id);
    }
    
    // Open local modal state for audit vault
    setSelectedAuditProduct(adaptedPayload);
    setIsAuditModalOpen(true);
    
    console.log('✓ HSN Audit modal opened for:', product.name, product.hsn);
  };

  return (
    <div className="w-full relative">
      {/* DIRECT DASHBOARD PRODUCT CARD IMPORT WITH ALL 4 BUTTONS ACTIVE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item: any) => (
          <ProductCard
            key={item.id}
            product={{
              id: item.id,
              name: item.name || item.product_name,
              hsn: item.hsn || item.hsn_code,
              image: item.image || item.image_url,
              materials: item.materials || [],
              audit_trace: item.audit_trace,
              trade_terms: item.trade_terms,
            }}
            onClickAudit={handleClickAudit}
            onSeeHsnAudit={handleSeeHsnAudit}
            onEditInit={handleEditInit}
          />
        ))}
      </div>

      {/* PRODUCT STORY MODAL - Card Click Opens This (Cinematic Product Journey) */}
      <ProductStoryModal 
        onOpenAI={() => {
          // Can be used for AI interactions
          console.log('AI interaction triggered');
        }}
        onSeeHsnAudit={handleSeeHsnAudit}
      />

      {/* GENUINE HSN AUDIT VAULT MODAL - PRODUCTION COMPLIANCE ENGINE */}
      <HsnAuditVaultModal 
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
          setSelectedAuditProduct(null);
        }}
        product={selectedAuditProduct}
      />
    </div>
  );
};
