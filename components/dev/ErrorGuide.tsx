"use client";

import { useState } from "react";
import { KNOWN_ERRORS } from "@/lib/errors";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Wrench, Terminal } from "lucide-react";

export function ErrorGuide() {
  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <div className="text-sm font-medium text-white">Troubleshooting Guide</div>
      </div>

      <div className="p-6">
        <p className="text-xs text-gray-400 mb-4">
          Common issues you might face when integrating LazorKit and how to fix them.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {KNOWN_ERRORS.map((err) => (
            <AccordionItem key={err.id} value={err.id} className="border border-white/10 rounded-lg bg-white/5 px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-mono text-xs text-red-400 font-bold bg-red-950/30 px-2 py-1 rounded">
                    {err.id}
                  </span>
                  <span className="text-sm text-gray-200">{err.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4 space-y-4">
                
                {/* Error Code */}
                <div className="bg-black/50 p-3 rounded-md border border-red-500/20 flex gap-3">
                  <Terminal className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <code className="text-xs text-red-200 font-mono break-all">
                    {err.code}
                  </code>
                </div>

                {/* Cause */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">Root Cause</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{err.cause}</p>
                </div>

                {/* Solution */}
                <div>
                  <h4 className="text-xs font-bold text-green-400 uppercase mb-1 flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> Solution
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {err.solution}
                  </p>
                </div>

              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}