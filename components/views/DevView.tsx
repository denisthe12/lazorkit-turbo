"use client";

import { useLogs } from "@/components/providers/LogsProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, CheckCircle2, XCircle, Terminal } from "lucide-react";

export function DevView() {
  const { logs } = useLogs();

  return (
    <div className="flex flex-col h-full bg-black/50">
      <div className="p-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-green-500" />
          Activity Logs
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No activity yet.<br/>Go buy some sneakers!
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono animate-in slide-in-from-left-2">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2 font-bold text-white">
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  {log.title}
                </div>
                <span className="text-[10px] text-gray-500">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <div className="pl-6 space-y-1">
                <div className="text-xs text-gray-400 uppercase">{log.type}</div>
                
                {/* Исправленная логика ссылок */}
                {log.hash && (
                  log.type === "transaction" ? (
                    // ДЛЯ ТРАНЗАКЦИЙ: Ссылка на Solscan с ПОЛНЫМ хешем
                    <a 
                      href={`https://solscan.io/tx/${log.hash}?cluster=devnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 break-all"
                    >
                      {/* Показываем сокращенный хеш, но ссылка полная */}
                      {log.hash.slice(0, 20)}... <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    // ДЛЯ ПОДПИСЕЙ (SIGNATURE): Просто текст, без ссылки (так как это офф-чейн)
                    <div className="text-[10px] text-gray-500 break-all select-all cursor-text">
                      Signature: {log.hash.slice(0, 20)}...
                    </div>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}