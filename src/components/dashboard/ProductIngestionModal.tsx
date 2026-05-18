"use client";

import React from "react";
import { ProductIngestionWizard } from "./ProductIngestionWizard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  firmId: string;
  editingProduct?: any;
}

export function ProductIngestionModal({ isOpen, onClose, firmId, editingProduct }: Props) {
  return (
    <ProductIngestionWizard
      isOpen={isOpen}
      onClose={onClose}
      firmId={firmId}
      editingProduct={editingProduct}
    />
  );
}
