"use client";

import { useDevMode } from "@/components/providers/DevModeProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CodeDrawer() {
  const { codeSnippet, closeSnippet } = useDevMode();
  const [copied, setCopied] = useState(false);

  // Сброс состояния копирования при открытии нового окна
  useEffect(() => {
    setCopied(false);
  }, [codeSnippet]);

  const handleCopy = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Sheet open={!!codeSnippet} onOpenChange={(open) => !open && closeSnippet()}>
      <SheetContent side="bottom" className="h-[70vh] bg-zinc-950 border-t border-white/10 p-0 flex flex-col rounded-t-3xl">
        
        <SheetHeader className="p-6 pb-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white font-mono text-lg flex items-center gap-2">
              <span className="text-green-500">&lt;/&gt;</span>
              {codeSnippet?.title}
            </SheetTitle>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCopy}
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
            >
              {copied ? (
                <><Check className="w-4 h-4 mr-2 text-green-500" /> Copied</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copy Code</>
              )}
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6 pt-4 bg-[#0d1117]">
          <pre className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap pb-10">
            <code>{codeSnippet?.code}</code>
          </pre>
        </ScrollArea>

      </SheetContent>
    </Sheet>
  );
}