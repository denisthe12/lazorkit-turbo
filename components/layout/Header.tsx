"use client";

import { Zap, Coins } from "lucide-react"; // Добавил иконку Coins
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDevMode } from "@/components/providers/DevModeProvider";
import { useLogs } from "@/components/providers/LogsProvider"; // Импорт логов
import { useEffect, useState } from "react";

export function Header() {
  const { isDevMode, toggleDevMode } = useDevMode();
  const { savedAmount } = useLogs();
  const [bump, setBump] = useState(false);

  // Анимация при изменении суммы
  useEffect(() => {
    if (savedAmount > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [savedAmount]);

  return (
    <header className="flex justify-between items-center p-4 pt-12 pb-2 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
      
      {/* Логотип + Счетчик */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-primary" fill="currentColor" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white leading-none">LazorKit</h1>
        </div>
        
        {/* Счетчик Экономии */}
        <div className={`flex items-center gap-1 text-[10px] font-medium transition-transform duration-300 ${bump ? "scale-110 text-green-400" : "text-gray-400"}`}>
          <Coins className="w-3 h-3" />
          <span>Saved: ${savedAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Переключатель */}
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
        <Label 
          htmlFor="dev-mode" 
          className={`text-[10px] font-bold px-2 cursor-pointer transition-colors ${isDevMode ? "text-green-400" : "text-gray-500"}`}
          onClick={toggleDevMode}
        >
          {isDevMode ? "DEV ON" : "UI VIEW"}
        </Label>
        <Switch 
          id="dev-mode" 
          checked={isDevMode}
          onCheckedChange={toggleDevMode}
          className="data-[state=checked]:bg-green-500 scale-75 origin-right"
        />
      </div>
    </header>
  );
}