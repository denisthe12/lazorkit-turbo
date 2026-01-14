"use client";

import { KNOWLEDGE_BASE } from "@/lib/knowledge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, ExternalLink, Lightbulb } from "lucide-react";

interface SmartCodeProps {
  code: string;
}

export function SmartCode({ code }: SmartCodeProps) {
  // Функция для безопасного разделения текста и вставки компонентов
  const renderInteractiveCode = () => {
    let parts: (string | JSX.Element)[] = [code];

    // Проходимся по каждому ключевому слову из базы знаний
    KNOWLEDGE_BASE.forEach((item) => {
      const newParts: (string | JSX.Element)[] = [];
      
      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part); // Уже обработанный кусок (JSX), пропускаем
          return;
        }

        // Ищем ключевое слово (простая замена, можно усложнить regex)
        const split = part.split(item.keyword);
        
        split.forEach((textFragment, index) => {
          newParts.push(textFragment);
          // Если это не последний кусок, значит после него было ключевое слово
          if (index < split.length - 1) {
            newParts.push(
              <Popover key={`${item.id}-${index}`}>
                <PopoverTrigger asChild>
                  <span className="cursor-help text-yellow-400 font-bold border-b border-dashed border-yellow-400/50 hover:bg-yellow-400/10 transition-colors rounded px-0.5">
                    {item.keyword}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-zinc-900 border-yellow-500/30 text-white p-0 shadow-xl z-[100]">
                  <div className="bg-yellow-500/10 p-3 border-b border-yellow-500/20 flex items-center gap-2">
                    <Info className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-sm text-yellow-100">{item.title}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                    {item.proTip && (
                      <div className="bg-blue-900/20 p-2 rounded-lg border border-blue-500/20 flex gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-blue-200">{item.proTip}</span>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            );
          }
        });
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <code className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
      {renderInteractiveCode()}
    </code>
  );
}