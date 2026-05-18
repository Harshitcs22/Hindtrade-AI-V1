"use client";

import { useState } from "react";
import { supabase, isConfigured } from "@/lib/supabase";
import { useProductStore } from "@/lib/store";
import { Verification } from "@/types/supabase";

export const useVaultUpload = (firmId: string, firmSlug?: string) => {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadAsset = async (file: File, docType: string) => {
    if (!file || !firmId) return;
    setUploadingType(docType);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${firmId}/${docType}_${Date.now()}.${fileExt}`;

      if (!isConfigured) {
        // DEMO MODE BYPASS: Simulate secure upload in local store state
        await new Promise((r) => setTimeout(r, 1200));
        
        const newRecord: Verification = {
          id: `demo-ver-${Date.now()}`,
          firm_id: firmId,
          document_type: docType,
          document_url: 'https://placeholder.supabase.co/mock-doc.pdf',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Append to multiVerifications in Zustand store
        const currentVers = useProductStore.getState().multiVerifications || [];
        useProductStore.setState({ 
          multiVerifications: [...currentVers.filter(v => v.document_type !== docType), newRecord] 
        });
        return;
      }

      // Live mode storage upload
      const { error: uploadErr } = await supabase.storage
        .from('verification-vault')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from('verification-vault').getPublicUrl(filePath);

      // Check if this document type already exists
      const { multiVerifications } = useProductStore.getState();
      const existing = multiVerifications?.find(v => v.document_type === docType);
      
      if (existing) {
        const { error: dbErr } = await supabase
          .from('verifications')
          .update({
            document_url: urlData.publicUrl,
            status: 'PENDING',
            comments: null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase
          .from('verifications')
          .insert({
            firm_id: firmId,
            document_type: docType,
            document_url: urlData.publicUrl,
            status: 'PENDING'
          });

        if (dbErr) throw dbErr;
      }

      // Trigger store refresh to update UI state
      const { fetchDashboardData } = useProductStore.getState();
      if (firmSlug) {
        await fetchDashboardData(firmSlug);
      }

    } catch (err: any) {
      console.error('Core pillar upload failure:', err);
      setUploadError(err.message || 'Verification upload rejected by security policies.');
      throw err;
    } finally {
      setUploadingType(null);
    }
  };

  return { uploadAsset, uploadingType, uploadError, setUploadError };
};
