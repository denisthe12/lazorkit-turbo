"use client";

import { useDevMode } from "@/components/providers/DevModeProvider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Copy, Check, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CodeDrawer() {
  const { activeTutorial, closeTutorial } = useDevMode();
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setCurrentStep(0);
    setCopied(false);
  }, [activeTutorial]);

  const handleCopy = () => {
    if (activeTutorial) {
      navigator.clipboard.writeText(activeTutorial.steps[currentStep].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!activeTutorial) return null;

  return (
    <Sheet open={!!activeTutorial} onOpenChange={(open) => !open && closeTutorial()}>
      <SheetContent side="bottom" className="h-[85vh] bg-zinc-950 border-t border-white/10 p-0 flex flex-col rounded-t-3xl">
        
        {/* Header */}
        <SheetHeader className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-white font-mono text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                {activeTutorial.title}
              </SheetTitle>
              <p className="text-xs text-gray-400">Step {currentStep + 1} of {activeTutorial.steps.length}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Steps Navigation */}
        <div className="px-6 py-2 border-b border-white/5 bg-white/2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {activeTutorial.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  currentStep === index 
                    ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 bg-[#0d1117]">
          <div className="p-6 pb-20">
            {/* Description Box */}
            <div className="mb-6 p-4 rounded-xl bg-blue-900/10 border border-blue-500/20">
              <h3 className="text-sm font-bold text-blue-300 mb-1">
                {activeTutorial.steps[currentStep].title}
              </h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                {activeTutorial.steps[currentStep].description}
              </p>
            </div>

            {/* Code Block Container */}
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black/50">
              {/* Code Header Bar */}
              <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] text-gray-500 font-mono flex justify-between items-center">
                
                {/* Language Tag */}
                <span className="uppercase tracking-wider">
                  {activeTutorial.steps[currentStep].language}
                </span>

                {/* Copy Button & Status (Inside Header now) */}
                <div className="flex items-center gap-3">
                  <span className="opacity-50">READ-ONLY</span>
                  <button 
                    onClick={handleCopy}
                    className="hover:text-white transition-colors focus:outline-none"
                    title="Copy Code"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>

              {/* Code Content */}
              <pre className="p-4 overflow-x-auto">
                <code className="font-mono text-sm leading-relaxed text-gray-300">
                  {activeTutorial.steps[currentStep].code}
                </code>
              </pre>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center">
          <Button
            variant="ghost"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>

          <Button
            className={currentStep === activeTutorial.steps.length - 1 ? "bg-green-600 hover:bg-green-500" : "bg-primary hover:bg-primary/90"}
            onClick={() => {
              if (currentStep < activeTutorial.steps.length - 1) {
                setCurrentStep(prev => prev + 1);
              } else {
                closeTutorial();
              }
            }}
          >
            {currentStep === activeTutorial.steps.length - 1 ? "Finish" : "Next Step"}
            {currentStep !== activeTutorial.steps.length - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
}