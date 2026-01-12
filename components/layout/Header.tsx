"use client";

import { Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDevMode } from "@/components/providers/DevModeProvider"; // Импорт хука

export function Header() {
  const { isDevMode, toggleDevMode } = useDevMode(); // Используем контекст

  return (
    <header className="flex justify-between items-center p-4 pt-12 pb-2 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Zap className="w-5 h-5 text-primary" fill="currentColor" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-white">LazorKit</h1>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="dev-mode" className={`text-xs font-mono font-bold transition-colors ${isDevMode ? "text-green-400" : "text-gray-500"}`}>
          {isDevMode ? "DEV ON" : "DEV OFF"}
        </Label>
        <Switch 
          id="dev-mode" 
          checked={isDevMode}
          onCheckedChange={toggleDevMode}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    </header>
  );
}