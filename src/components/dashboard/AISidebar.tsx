"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Send, Briefcase, AlertCircle } from "lucide-react";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { useProductStore } from "@/lib/store";

interface Message {
  role: "user" | "agent" | "system";
  content: string | React.ReactNode;
}

export function AISidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeProductId, inventory, firmDetails, trustScore } = useProductStore();
  const activeProduct = inventory.find(p => p.id === activeProductId);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeProduct) {
      setMessages([
        { 
          role: "system", 
          content: "EXECUTIVE SALES TERMINAL INITIALIZED." 
        },
        { 
          role: "agent", 
          content: `Good day. I am the Sales Head for ${firmDetails.name}. It is a pleasure to assist you with your interest in our ${activeProduct.name}. How can I support your procurement or compliance verification today?` 
        }
      ]);
    } else {
      setMessages([]);
    }
  }, [isOpen, activeProduct, firmDetails.name]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMsg }] as Message[];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.role !== "system")
            .map(m => ({ role: m.role === "agent" ? "assistant" : m.role, content: typeof m.content === 'string' ? m.content : "Inquiry about HSN/Compliance" })),
          context: {
            activeProduct,
            firmName: firmDetails.name,
            trustScore,
            yearsInTrade: firmDetails.yearsInTrade
          }
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Failed to reach Sales Head");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedContent = "";
      let buffer = "";

      // Add placeholder for agent response
      setMessages(prev => [...prev, { role: "agent", content: "" }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        // Add current chunk to buffer
        buffer += decoder.decode(value, { stream: !done });
        
        // Split buffer by newlines to get potential SSE lines
        const lines = buffer.split("\n");
        
        // The last element in 'lines' might be an incomplete line,
        // so we keep it in the buffer for the next iteration.
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;
          
          const dataStr = trimmedLine.slice(6);
          if (dataStr === "[DONE]") {
            done = true;
            break;
          }

          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0].delta?.content || "";
            accumulatedContent += content;
            
            // Update the last message in the state
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { 
                role: "agent", 
                content: processAgentResponse(accumulatedContent) 
              };
              return updated;
            });
          } catch (e) {
            // If parsing fails, it's likely an incomplete JSON chunk in this specific line format, 
            // though with standard SSE and our buffering it should be rare.
            console.error("Error parsing stream chunk", e, "Line:", trimmedLine);
          }
        }
      }

    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Executive Terminal Error";
      setMessages(prev => [...prev, { 
        role: "agent", 
        content: (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>Connection to Sales Head interrupted: {errorMessage}</span>
          </div>
        )
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const processAgentResponse = (text: string): React.ReactNode => {
    const lines = text.split("\n");
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const trimmedLine = line.trim();
          if (!trimmedLine && line.length > 0) return <div key={i} className="h-2" />;
          
          if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
            return <li key={i} className="ml-4 list-disc text-[#F9F6EE] font-light leading-relaxed">{renderLineWithBold(trimmedLine.slice(2))}</li>;
          }
          
          if (trimmedLine.includes("[GRI_ENGINE_CALL]")) {
            return (
              <div key={i} className="bg-[#D4CAA3]/5 border-l-2 border-[#D4CAA3] p-3 my-4">
                <div className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 text-[#D4CAA3]">
                  <Terminal className="w-3 h-3" /> GRI Engine Active
                </div>
                <div className="text-xs opacity-90 font-mono leading-relaxed text-[#F9F6EE]">
                  <strong>STATUTORY RATIONALE:</strong><br />
                  Applying General Rules of Interpretation (GRI) 1-6.<br />
                  Audit Hash: 0x9f8a...{Math.random().toString(16).slice(2, 6)}
                </div>
              </div>
            );
          }
          
          return <p key={i} className="text-[#F9F6EE] font-light leading-relaxed">{renderLineWithBold(trimmedLine)}</p>;
        })}
      </div>
    );
  };

  const renderLineWithBold = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="text-[#D4CAA3] font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] md:w-[500px] bg-[#0A0A0A] border-l border-white/10 shadow-2xl z-[210] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111111]">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-[#D4CAA3]" />
                <div>
                  <h2 className="text-sm tracking-[0.2em] text-[#F9F6EE] uppercase font-bold">
                    Sales Head
                  </h2>
                  <div className="text-[9px] text-[#D4CAA3] tracking-widest mt-0.5">EXECUTIVE BRIEFING TERMINAL</div>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-[#D4CAA3] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Banner */}
            <div className="px-6 py-3 bg-[#D4CAA3]/5 border-b border-[#D4CAA3]/20 flex items-center justify-between">
              <span className="text-[10px] text-[#D4CAA3] uppercase tracking-widest">Inquiry Context</span>
              <MonoLabel variant="gold" className="text-[10px] opacity-80">{activeProduct?.hsn}</MonoLabel>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative text-sm font-sans">
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] opacity-10" />
              
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} relative z-10`}
                >
                  <div className={`text-[10px] tracking-widest uppercase mb-1 opacity-50 ${msg.role === 'user' ? 'text-[#F9F6EE]' : 'text-[#D4CAA3]'}`}>
                    {msg.role === 'agent' ? 'Sales Head' : msg.role}
                  </div>
                  <div className={`max-w-[85%] p-4 border leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-white/5 border-white/10 text-white font-light' 
                      : msg.role === 'system'
                      ? 'bg-transparent border-none text-[#D4CAA3] opacity-30 p-0 text-[10px] font-mono'
                      : 'bg-[#D4CAA3]/5 border-[#D4CAA3]/20 text-[#F9F6EE] font-light shadow-[0_0_20px_rgba(212,202,163,0.02)]'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start relative z-10">
                  <div className="text-[10px] tracking-widest uppercase mb-1 opacity-50 text-[#D4CAA3]">Sales Head</div>
                  <div className="max-w-[85%] p-4 border bg-[#D4CAA3]/5 border-[#D4CAA3]/20 text-[#D4CAA3] flex gap-1">
                    <span className="animate-pulse">_</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#111111] border-t border-white/10 relative z-10">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2 bg-[#0A0A0A] border border-white/20 p-2 focus-within:border-[#D4CAA3] transition-colors"
              >
                <Terminal className="w-4 h-4 text-zinc-600 ml-2" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Draft your inquiry for the Sales Head..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder:text-zinc-600 px-2 font-sans"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 flex items-center justify-center bg-[#D4CAA3]/10 text-[#D4CAA3] hover:bg-[#D4CAA3] hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
