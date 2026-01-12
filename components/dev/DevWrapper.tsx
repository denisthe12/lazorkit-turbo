"use client";

import { ReactNode } from "react";
import { useDevMode } from "@/components/providers/DevModeProvider";
import { Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DevWrapperProps {
  children: ReactNode;
  title: string; // Заголовок сниппета (например "Gasless Buy Button")
  code: string;  // Сам код
  className?: string;
}

export function DevWrapper({ children, title, code, className }: DevWrapperProps) {
  const { isDevMode, openSnippet } = useDevMode();

  if (!isDevMode) {
    return <>{children}</>;
  }

  return (
    <div 
      className={cn("relative group cursor-pointer", className)}
      onClick={(e) => {
        // Останавливаем всплытие, чтобы не сработал клик кнопки внутри (например покупка)
        e.preventDefault();
        e.stopPropagation();
        openSnippet(title, code);
      }}
    >
      {/* Визуальная обводка при наведении */}
      <div className="absolute -inset-2 border-2 border-dashed border-green-500/50 rounded-xl bg-green-500/5 pointer-events-none z-10 animate-pulse" />
      
      {/* Иконка кода */}
      <div className="absolute -top-4 -right-2 bg-green-500 text-black p-1.5 rounded-lg shadow-lg z-20 scale-90 group-hover:scale-100 transition-transform">
        <Code2 className="w-4 h-4" />
      </div>

      {/* Сам контент (кнопка) */}
      <div className="pointer-events-none opacity-80">
        {children}
      </div>
    </div>
  );
}