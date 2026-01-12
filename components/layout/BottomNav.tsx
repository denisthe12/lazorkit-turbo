"use client";

import { Wallet, ShoppingBag, CreditCard, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- ВАЖНО: Интерфейс пропсов ---
interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Компонент теперь принимает props
export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "wallet", icon: Wallet, label: "Wallet" },
    { id: "shop", icon: ShoppingBag, label: "Shop" },
    { id: "saas", icon: CreditCard, label: "SaaS" },
    { id: "dev", icon: Terminal, label: "Dev" },
  ];

  return (
    <nav className="w-full bg-black/90 backdrop-blur-xl border-t border-white/10 px-2 py-4 pb-8 flex justify-around items-center z-50 mt-auto">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="group flex flex-col items-center justify-center w-16 gap-1 bg-transparent border-none outline-none focus:outline-none"
          >
            <div className={cn(
              "relative p-2 rounded-xl transition-all duration-300 ease-out",
              isActive ? "bg-primary/20" : "bg-transparent"
            )}>
              <item.icon
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive 
                    ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]" 
                    : "text-gray-500 group-hover:text-gray-300"
                )}
              />
            </div>
            
            <span
              className={cn(
                "text-[10px] font-medium transition-colors duration-300",
                isActive ? "text-primary" : "text-gray-500"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}