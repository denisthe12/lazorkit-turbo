"use client";

import { ReactNode } from "react";
import { useDevMode } from "@/components/providers/DevModeProvider";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DevWrapperProps {
  children: ReactNode;
  tutorialId: string; // ID из файла tutorials.ts
  className?: string;
}

export function DevWrapper({ children, tutorialId, className }: DevWrapperProps) {
  const { isDevMode, openTutorial } = useDevMode();

  if (!isDevMode) {
    return <>{children}</>;
  }

  return (
    <div 
      className={cn("relative group cursor-pointer", className)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openTutorial(tutorialId);
      }}
    >
      <div className="absolute -inset-2 border-2 border-dashed border-green-500/50 rounded-xl bg-green-500/5 pointer-events-none z-10 animate-pulse" />
      
      <div className="absolute -top-4 -right-2 bg-green-500 text-black p-1.5 rounded-lg shadow-lg z-20 scale-90 group-hover:scale-100 transition-transform flex items-center gap-1">
        <Code2 className="w-3 h-3" />
        <span className="text-[10px] font-bold">EXPLAIN</span>
      </div>

      <div className="pointer-events-none opacity-80">
        {children}
      </div>
    </div>
  );
}