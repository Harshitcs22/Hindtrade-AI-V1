"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { ProductIngestionWizard } from "@/components/dashboard/ProductIngestionWizard";
import { Loader2 } from "lucide-react";

function InventoryManageWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { firmDetails } = useProductStore();

  useEffect(() => {
    if (productId) {
      setLoading(true);
      supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setEditingProduct({
              id: data.id,
              name: data.name,
              hsn: data.hsn_code,
              image: data.image_url,
              materials: data.material || [],
              journey: data.journey || [],
              audit_trace: data.audit_trace
            });
          } else {
            console.error("Failed to load product for editing:", error);
          }
          setLoading(false);
        });
    } else {
      setEditingProduct(null);
    }
  }, [productId]);

  const handleClose = () => {
    const backSlug = firmDetails?.slug || '';
    if (backSlug) {
      router.push(`/dashboard/${backSlug}`);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-[#D4CAA3] animate-spin" />
        <p className="text-[#D4CAA3] font-mono tracking-widest text-[10px] uppercase">
          Loading SKU Parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-12">
      {/* Sovereign Industrial Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-10 max-w-4xl mx-auto">
        <div>
          <h1 className="font-serif text-3xl tracking-wider uppercase text-white">
            {productId ? "SKU Parameter Asset Modification" : "Sovereign Digital Ledger Ingestion"}
          </h1>
          <p className="font-sans text-[10px] tracking-widest text-zinc-500 uppercase mt-1">
            HindTrade Global Compliance Infrastructure Base • Secure Session Active
          </p>
        </div>
        <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors text-[10px] tracking-widest uppercase border border-white/10 px-4 py-2 hover:border-white/35 transition-all">
          ✕ Cancel & Return
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-zinc-950 border border-white/5 p-10 relative overflow-hidden">
        <ProductIngestionWizard 
          isOpen={true} 
          onClose={handleClose} 
          firmId={firmDetails?.id || ""} 
          editingProduct={editingProduct}
          workspaceMode="page"
        />
      </div>
    </div>
  );
}

export default function InventoryManageWorkspace() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-[#D4CAA3] animate-spin" />
        <p className="text-[#D4CAA3] font-mono tracking-widest text-[10px] uppercase">
          Initializing Workspace...
        </p>
      </div>
    }>
      <InventoryManageWorkspaceContent />
    </Suspense>
  );
}
