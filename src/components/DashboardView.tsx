"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Fingerprint, 
  Database, 
  LineChart, 
  Users, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus,
  ArrowRight
} from "lucide-react";

export default function DashboardView({ onViewLanding }: { onViewLanding: () => void }) {
  const [activeTab, setActiveTab] = useState("Command Center");
  const [files, setFiles] = useState([
    { name: "Invoice_US.pdf", status: "Extracted Value: $12,000", size: "1.2 MB", date: "2026-04-28" },
    { name: "Hockey_Catalog.pdf", status: "Agent Indexed", size: "4.5 MB", date: "2026-04-27" },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setFiles([
        { name: "Bill_of_Lading_UK.pdf", status: "Analyzing GRI...", size: "850 KB", date: "2026-04-28" },
        ...files
      ]);
      setIsUploading(false);
    }, 1500);
  };

  const navItems = [
    { name: "Command Center", icon: LayoutDashboard },
    { name: "Digital Identity", icon: Fingerprint },
    { name: "Knowledge Vault", icon: Database },
    { name: "Demand Signals", icon: LineChart },
    { name: "Expert Hub", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-100 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-[#0A0A0A] flex flex-col fixed h-full z-30">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between">
          <div className="font-mono text-sm font-bold tracking-wider text-white">
            HINDTRADE AI
          </div>
          <button 
            onClick={onViewLanding}
            className="text-2xs font-mono text-[#22D3EE] hover:underline"
          >
            Exit
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium border transition-all ${
                  activeTab === item.name
                    ? "bg-[#1E293B] border-[#22D3EE] text-[#22D3EE]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeTab === item.name ? "text-[#22D3EE]" : "text-slate-500"}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 text-2xs font-mono text-slate-500 text-center">
          v1.0.0-beta · Sovereign OS
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-[#050505]">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-[#0A0A0A] flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-serif text-white">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <Badge className="bg-slate-900 border-slate-800 text-[#22D3EE] font-mono text-2xs rounded-none px-2 py-0.5">
              IEC: 0503001234
            </Badge>
            <div className="h-8 w-8 bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-white">
              HT
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 space-y-8">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-[#0A0A0A] border-slate-800 rounded-none shadow-none">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-slate-500">TRUST SCORE</div>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-500">92/100</div>
                <div className="text-2xs font-mono text-slate-400 mt-1">Tier 1 Exporter Status</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-slate-800 rounded-none shadow-none">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-slate-500">AGENT ACTIVITY</div>
                  <LayoutDashboard className="h-4 w-4 text-[#22D3EE]" />
                </div>
                <div className="text-3xl font-bold font-mono text-white">124 <span className="text-xs text-slate-500">Chats</span> | 31 <span className="text-xs text-slate-500">Audits</span></div>
                <div className="text-2xs font-mono text-[#22D3EE] mt-1">Autonomous coverage: 98.4%</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0A0A] border-slate-800 rounded-none shadow-none">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs font-mono text-slate-500">VERIFIED LEADS</div>
                  <Users className="h-4 w-4 text-[#22D3EE]" />
                </div>
                <div className="text-3xl font-bold font-mono text-white">14</div>
                <div className="text-2xs font-mono text-slate-400 mt-1">All IEC Checked & Validated</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Area: Knowledge Vault */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="text-lg font-serif text-white mb-4">The Knowledge Vault</div>
              
              {/* Drag and Drop Zone */}
              <div 
                onClick={simulateUpload}
                className={`border-2 border-dashed border-slate-800 bg-[#0A0A0A] p-12 text-center cursor-pointer hover:border-[#22D3EE]/50 transition-colors group ${isUploading ? 'animate-pulse border-[#22D3EE]' : ''}`}
              >
                <Upload className="h-8 w-8 text-slate-500 mx-auto mb-4 group-hover:text-[#22D3EE]" />
                <div className="text-sm font-medium text-slate-300">
                  {isUploading ? "Processing document..." : "Drag & drop trade documents here, or click to browse"}
                </div>
                <div className="text-2xs font-mono text-slate-500 mt-2">
                  Supports PDF, CSV, XML (Commercial Invoices, Bills of Lading, Catalogs)
                </div>
              </div>

              {/* File Feed */}
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-500 px-2">RECENT INGESTIONS</div>
                {files.map((file, idx) => (
                  <div key={idx} className="bg-[#0A0A0A] border border-slate-800 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-slate-500" />
                      <div>
                        <div className="text-sm font-medium text-slate-200">{file.name}</div>
                        <div className="text-2xs font-mono text-slate-400 mt-0.5">{file.size} · {file.date}</div>
                      </div>
                    </div>
                    <Badge 
                      className={`font-mono text-2xs rounded-none border shadow-none ${
                        file.status.includes('Value') 
                          ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/50' 
                          : file.status.includes('Indexed')
                          ? 'bg-blue-950/50 text-blue-400 border-blue-800/50'
                          : 'bg-yellow-950/50 text-yellow-400 border-yellow-800/50'
                      }`}
                    >
                      {file.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel: Expert Hub */}
            <div className="space-y-6">
              <div className="text-lg font-serif text-white mb-4">Digital Asset Acceleration</div>
              <Card className="bg-[#0A0A0A] border-slate-800 rounded-none shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-serif text-white">Hire Verified Talent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    Hire vetted engineering talent from NIT Jalandhar to digitize your physical inventory and build your SME website.
                  </p>
                  <p className="text-sm text-slate-300 font-sans">
                    Connect with your trade card, use anywhere.
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
                    <div>
                      <div className="text-xs font-mono text-slate-500">DELIVERY TIME</div>
                      <div className="text-sm font-bold text-white">48 Hours</div>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-500">FLAT FEE</div>
                      <div className="text-sm font-bold text-[#22D3EE]">₹1,000</div>
                    </div>
                  </div>
                  <Button className="w-full bg-[#22D3EE] text-[#0A0A0A] hover:bg-[#1ebcd3] font-semibold text-xs py-5 mt-4 rounded-none">
                    Hire Verified Talent <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
