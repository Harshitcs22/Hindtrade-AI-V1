"use client";

import React from "react";
import LandingView from "@/components/LandingView";

export default function Home() {
  const handleViewDashboard = () => {
    // Optional: could route to dashboard if needed, but keeping single page as requested.
    console.log("Dashboard requested");
  };

  return (
    <main className="flex-1 flex flex-col">
      <LandingView onViewDashboard={handleViewDashboard} />
    </main>
  );
}


